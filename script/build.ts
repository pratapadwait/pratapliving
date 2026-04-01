import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { pathToFileURL } from "url";
import path from "path";

const allowlist = [
  "@google/generative-ai",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "pg",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

const SSG_ROUTES = [
  { url: "/", file: "index.html" },
  { url: "/properties", file: "properties.html" },
  { url: "/villa-homestay-golf-city", file: "villa-homestay-golf-city.html" },
  { url: "/luxe-studio-omaxe-hazratganj", file: "luxe-studio-omaxe-hazratganj.html" },
  { url: "/about", file: "about.html" },
  { url: "/blog", file: "blog.html" },
  { url: "/blog/best-hotels-gomti-nagar-lucknow", file: "blog/best-hotels-gomti-nagar-lucknow.html" },
  { url: "/blog/hourly-hotels-lucknow-unmarried-couples", file: "blog/hourly-hotels-lucknow-unmarried-couples.html" },
  { url: "/blog/couple-friendly-hotels-lucknow-safe-private", file: "blog/couple-friendly-hotels-lucknow-safe-private.html" },
  { url: "/partner", file: "partner.html" },
  { url: "/contact", file: "contact.html" },
];

function injectSSR(
  template: string,
  html: string,
  helmet: Record<string, { toString(): string }>,
): string {
  let result = template;

  result = result.replace(
    '<div id="root"></div>',
    `<div id="root">${html}</div>`,
  );

  const helmetParts = [
    helmet.title?.toString(),
    helmet.meta?.toString(),
    helmet.link?.toString(),
    helmet.script?.toString(),
    helmet.noscript?.toString(),
    helmet.style?.toString(),
  ].filter((s) => s && s.trim() && s !== "undefined");

  if (helmetParts.length > 0) {
    const helmetHead = helmetParts.join("\n    ");
    result = result.replace(/<title>[^<]*<\/title>/, "");
    result = result.replace(/<meta\s+name="description"[^>]*>/i, "");
    result = result.replace(/<meta\s+name="keywords"[^>]*>/i, "");
    result = result.replace(/<meta\s+property="og:title"[^>]*>/i, "");
    result = result.replace(/<meta\s+property="og:description"[^>]*>/i, "");
    result = result.replace("</head>", `    ${helmetHead}\n  </head>`);
  }

  return result;
}

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();

  console.log("building SSR bundle...");
  await viteBuild({
    build: {
      ssr: "src/entry-server.tsx",
      outDir: path.resolve(import.meta.dirname, "..", "dist/server"),
      emptyOutDir: true,
      rollupOptions: {
        output: { format: "esm" },
      },
    },
  });

  console.log("pre-rendering routes...");
  const templateHtml = await readFile(
    path.resolve(import.meta.dirname, "..", "dist/public/index.html"),
    "utf-8",
  );

  const entryServerPath = path.resolve(
    import.meta.dirname,
    "..",
    "dist/server/entry-server.js",
  );
  const { render } = (await import(pathToFileURL(entryServerPath).href)) as {
    render: (url: string) => {
      html: string;
      helmet: Record<string, { toString(): string }>;
    };
  };

  for (const route of SSG_ROUTES) {
    try {
      const { html, helmet } = render(route.url);
      const outHtml = injectSSR(templateHtml, html, helmet);

      const outPath = path.resolve(
        import.meta.dirname,
        "..",
        "dist/public",
        route.file,
      );
      const outDir = path.dirname(outPath);
      if (!existsSync(outDir)) {
        await mkdir(outDir, { recursive: true });
      }
      await writeFile(outPath, outHtml, "utf-8");
      console.log(`  ✓ ${route.url} → ${route.file}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`  ✗ Failed to prerender ${route.url}: ${msg}`);
    }
  }

  console.log("building server...");
  const pkg = JSON.parse(
    await readFile(
      path.resolve(import.meta.dirname, "..", "package.json"),
      "utf-8",
    ),
  );
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: [...externals, "dotenv"],
    logLevel: "info",
  });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});

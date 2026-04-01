import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { pathToFileURL } from "url";
import path from "path";
import { Pool } from "pg";

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

interface Property {
  id: string;
  slug: string | null;
  name: string;
  type: string;
  location: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  amenities: string[];
  imageUrl: string;
  images: string[] | null;
  featured: boolean | null;
}

const SSG_ROUTES = [
  { url: "/", file: "index.html" },
  { url: "/properties", file: "properties.html" },
  { url: "/villa-homestay-golf-city", file: "villa-homestay-golf-city.html", propertySlug: "villa-homestay-golf-city" },
  { url: "/luxe-studio-omaxe-hazratganj", file: "luxe-studio-omaxe-hazratganj.html", propertySlug: "luxe-studio-omaxe-hazratganj" },
  { url: "/about", file: "about.html" },
  { url: "/blog", file: "blog.html" },
  { url: "/blog/best-hotels-gomti-nagar-lucknow", file: "blog/best-hotels-gomti-nagar-lucknow.html" },
  { url: "/blog/hourly-hotels-lucknow-unmarried-couples", file: "blog/hourly-hotels-lucknow-unmarried-couples.html" },
  { url: "/blog/couple-friendly-hotels-lucknow-safe-private", file: "blog/couple-friendly-hotels-lucknow-safe-private.html" },
  { url: "/partner", file: "partner.html" },
  { url: "/contact", file: "contact.html" },
];

type Helmet = Record<string, { toString(): string }>;

function injectSSR(
  template: string,
  html: string,
  helmet: Helmet,
  dehydratedState?: unknown,
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

  if (dehydratedState) {
    const stateScript = `<script>window.__REACT_QUERY_STATE__ = ${JSON.stringify(dehydratedState)}</script>`;
    result = result.replace("</body>", `  ${stateScript}\n</body>`);
  }

  return result;
}

async function fetchProperties(): Promise<Map<string, Property>> {
  const connStr = process.env.EXTERNAL_DATABASE_URL || process.env.DATABASE_URL;
  if (!connStr) {
    console.warn("  No database URL found; property pages will render as skeletons.");
    return new Map();
  }

  const pool = new Pool({ connectionString: connStr, ssl: { rejectUnauthorized: false } });
  try {
    const { rows } = await pool.query<Property>(`
      SELECT id, slug, name, type, location, description, price,
             bedrooms, bathrooms, guests, amenities, image_url AS "imageUrl",
             images, featured
      FROM properties
      WHERE slug IN ('villa-homestay-golf-city', 'luxe-studio-omaxe-hazratganj')
    `);
    const map = new Map<string, Property>();
    for (const row of rows) {
      if (row.slug) map.set(row.slug, row);
    }
    return map;
  } finally {
    await pool.end();
  }
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

  console.log("fetching property data for prerender...");
  const propertiesBySlug = await fetchProperties();

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
    render: (
      url: string,
      queryData?: Array<{ key: unknown[]; value: unknown }>,
    ) => {
      html: string;
      helmet: Helmet;
      dehydratedState: unknown;
    };
  };

  for (const route of SSG_ROUTES) {
    try {
      const queryData: Array<{ key: unknown[]; value: unknown }> = [];

      if (route.propertySlug) {
        const property = propertiesBySlug.get(route.propertySlug);
        if (property) {
          queryData.push({ key: ["/api/properties", route.propertySlug], value: property });
        } else {
          console.warn(`  Property not found for slug: ${route.propertySlug}`);
        }
      }

      const { html, helmet, dehydratedState } = render(route.url, queryData.length > 0 ? queryData : undefined);
      const outHtml = injectSSR(templateHtml, html, helmet, dehydratedState);

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

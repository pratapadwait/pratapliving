import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { pathToFileURL } from "url";
import path from "path";
import { Pool } from "pg";

const SITE_URL = (process.env.SITE_URL ?? "https://pratapliving.com").replace(/\/$/, "");

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

interface StaticRoute {
  url: string;
  file: string;
  queryData?: Array<{ key: unknown[]; value: unknown }>;
}

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
    const safeJson = JSON.stringify(dehydratedState)
      .replace(/&/g, "\\u0026")
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e");
    const stateScript = `<script id="__TANSTACK_QUERY_DEHYDRATED_STATE__" type="application/json">${safeJson}</script>`;
    result = result.replace("</body>", `  ${stateScript}\n</body>`);
  }

  return result;
}

async function fetchAllProperties(): Promise<Property[]> {
  const connStr = process.env.EXTERNAL_DATABASE_URL || process.env.DATABASE_URL;
  if (!connStr) {
    console.warn("  No database URL found; property pages will render as skeletons.");
    return [];
  }

  const pool = new Pool({ connectionString: connStr });
  try {
    const { rows } = await pool.query<Property>(`
      SELECT id, slug, name, type, location, description, price,
             bedrooms, bathrooms, guests, amenities, image_url AS "imageUrl",
             images, featured
      FROM properties
      ORDER BY featured DESC, name ASC
    `);
    return rows;
  } finally {
    await pool.end();
  }
}

function buildRoutes(allProperties: Property[]): StaticRoute[] {
  const staticRoutes: StaticRoute[] = [
    {
      url: "/",
      file: "index.html",
      queryData: [
        { key: ["/api/properties"], value: allProperties },
      ],
    },
    {
      url: "/properties",
      file: "properties.html",
      queryData: [
        { key: ["/api/properties"], value: allProperties },
      ],
    },
    { url: "/about", file: "about.html" },
    { url: "/blog", file: "blog.html" },
    { url: "/blog/best-hotels-gomti-nagar-lucknow", file: "blog/best-hotels-gomti-nagar-lucknow.html" },
    { url: "/blog/hourly-hotels-lucknow-unmarried-couples", file: "blog/hourly-hotels-lucknow-unmarried-couples.html" },
    { url: "/blog/couple-friendly-hotels-lucknow-safe-private", file: "blog/couple-friendly-hotels-lucknow-safe-private.html" },
    { url: "/partner", file: "partner.html" },
    { url: "/contact", file: "contact.html" },
  ];

  for (const property of allProperties) {
    if (!property.slug) continue;
    const slug = property.slug;
    staticRoutes.push({
      url: `/${slug}`,
      file: `${slug}.html`,
      queryData: [
        { key: ["/api/properties", slug], value: property },
        { key: ["/api/properties"], value: allProperties },
      ],
    });
  }

  return staticRoutes;
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
  const allProperties = await fetchAllProperties();
  console.log(`  found ${allProperties.length} properties`);

  const routes = buildRoutes(allProperties);

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

  for (const route of routes) {
    try {
      const { html, helmet, dehydratedState } = render(
        route.url,
        route.queryData,
      );
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

  console.log("generating sitemap...");
  await generateSitemap(allProperties);

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

async function generateSitemap(allProperties: Property[]): Promise<void> {
  interface SitemapEntry {
    url: string;
    priority: string;
    changefreq: string;
  }

  const today = new Date().toISOString().split("T")[0];

  const staticEntries: SitemapEntry[] = [
    { url: "/", priority: "1.0", changefreq: "weekly" },
    { url: "/properties", priority: "0.9", changefreq: "weekly" },
    { url: "/about", priority: "0.7", changefreq: "monthly" },
    { url: "/partner", priority: "0.7", changefreq: "monthly" },
    { url: "/contact", priority: "0.6", changefreq: "monthly" },
    { url: "/blog", priority: "0.8", changefreq: "weekly" },
    {
      url: "/blog/best-hotels-gomti-nagar-lucknow",
      priority: "0.8",
      changefreq: "monthly",
    },
    {
      url: "/blog/hourly-hotels-lucknow-unmarried-couples",
      priority: "0.8",
      changefreq: "monthly",
    },
    {
      url: "/blog/couple-friendly-hotels-lucknow-safe-private",
      priority: "0.8",
      changefreq: "monthly",
    },
  ];

  const propertyEntries: SitemapEntry[] = allProperties
    .filter((p) => p.slug)
    .map((p) => ({ url: `/${p.slug}`, priority: "0.9", changefreq: "daily" }));

  const allEntries = [...staticEntries, ...propertyEntries];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries
  .map(
    (e) => `  <url>
    <loc>${SITE_URL}${e.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  await writeFile(
    path.resolve(import.meta.dirname, "..", "dist/public/sitemap.xml"),
    xml,
    "utf-8",
  );
  console.log(`  ✓ sitemap.xml (${allEntries.length} URLs)`);
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});

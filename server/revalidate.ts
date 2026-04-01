import { readFile, writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import { pathToFileURL } from "url";
import path from "path";
import { Pool } from "pg";
import { createSign } from "crypto";

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
  updatedAt: Date | null;
}

type Helmet = Record<string, { toString(): string }>;

interface RevalidateRoute {
  url: string;
  file: string;
  queryData?: Array<{ key: unknown[]; value: unknown }>;
}

let debounceTimer: NodeJS.Timeout | null = null;
const pendingPaths = new Set<string>();
let isBuilding = false;

export function scheduleRevalidation(urlPaths: string[]): void {
  if (process.env.NODE_ENV !== "production") return;

  for (const p of urlPaths) {
    pendingPaths.add(p);
  }

  if (debounceTimer) clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    if (isBuilding) {
      scheduleRevalidation([]);
      return;
    }

    const batch = Array.from(pendingPaths);
    pendingPaths.clear();
    debounceTimer = null;

    runBatch(batch).catch((e) =>
      console.error("[revalidate] unhandled error:", e),
    );
  }, 5000);
}

const DIST_PUBLIC = path.resolve("dist/public");
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function removePropertyFiles(slug: string): Promise<void> {
  if (!SLUG_RE.test(slug)) return;
  const htmlFile = path.join(DIST_PUBLIC, `${slug}.html`);
  try {
    await unlink(htmlFile);
    console.log(`[revalidate] removed stale file: ${slug}.html`);
  } catch (e: any) {
    if (e.code !== "ENOENT") {
      console.error(`[revalidate] failed to remove ${slug}.html:`, e);
    }
  }
}

async function fetchAllProperties(): Promise<Property[]> {
  const connStr =
    process.env.EXTERNAL_DATABASE_URL || process.env.DATABASE_URL;
  if (!connStr) return [];

  const pool = new Pool({ connectionString: connStr });
  try {
    const { rows } = await pool.query<Property>(`
      SELECT id, slug, name, type, location, description, price,
             bedrooms, bathrooms, guests, amenities, image_url AS "imageUrl",
             images, featured, updated_at AS "updatedAt"
      FROM properties
      ORDER BY featured DESC, name ASC
    `);
    return rows;
  } finally {
    await pool.end();
  }
}

function resolveRoutes(
  urlPaths: string[],
  allProperties: Property[],
): RevalidateRoute[] {
  const routes: RevalidateRoute[] = [];
  const seen = new Set<string>();

  for (const url of urlPaths) {
    if (seen.has(url)) continue;
    seen.add(url);

    const file =
      url === "/" ? "index.html" : `${url.replace(/^\/+/, "")}.html`;

    const slug = url.replace(/^\/+/, "");
    const property = allProperties.find((p) => p.slug === slug);

    if (property) {
      routes.push({
        url,
        file,
        queryData: [
          { key: ["/api/properties", slug], value: property },
          { key: ["/api/properties"], value: allProperties },
        ],
      });
    } else if (url === "/" || url === "/properties") {
      routes.push({
        url,
        file,
        queryData: [{ key: ["/api/properties"], value: allProperties }],
      });
    } else {
      routes.push({ url, file });
    }
  }

  return routes;
}

function safeJson(obj: unknown): string {
  return JSON.stringify(obj)
    .replace(/&/g, "\\u0026")
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e");
}

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
    const stateScript = `<script id="__TANSTACK_QUERY_DEHYDRATED_STATE__" type="application/json">${safeJson(dehydratedState)}</script>`;
    result = result.replace("</body>", `  ${stateScript}\n</body>`);
  }

  return result;
}

function toDateStr(d: Date | null | undefined, fallback: string): string {
  if (d instanceof Date && !isNaN(d.getTime())) {
    return d.toISOString().split("T")[0];
  }
  return fallback;
}

async function regenerateSitemap(
  allProperties: Property[],
  distPath: string,
): Promise<void> {
  const SITE_URL = (
    process.env.SITE_URL ?? "https://pratapliving.com"
  ).replace(/\/$/, "");

  interface SitemapEntry {
    url: string;
    lastmod: string;
    priority: string;
    changefreq: string;
  }

  const staticEntries: SitemapEntry[] = [
    { url: "/", lastmod: "2025-01-01", priority: "1.0", changefreq: "weekly" },
    {
      url: "/properties",
      lastmod: "2025-01-01",
      priority: "0.9",
      changefreq: "weekly",
    },
    {
      url: "/about",
      lastmod: "2025-01-01",
      priority: "0.7",
      changefreq: "monthly",
    },
    {
      url: "/partner",
      lastmod: "2025-01-01",
      priority: "0.7",
      changefreq: "monthly",
    },
    {
      url: "/contact",
      lastmod: "2025-01-01",
      priority: "0.6",
      changefreq: "monthly",
    },
    {
      url: "/blog",
      lastmod: "2025-01-01",
      priority: "0.8",
      changefreq: "weekly",
    },
    {
      url: "/blog/best-hotels-gomti-nagar-lucknow",
      lastmod: "2025-03-10",
      priority: "0.8",
      changefreq: "monthly",
    },
    {
      url: "/blog/hourly-hotels-lucknow-unmarried-couples",
      lastmod: "2025-04-05",
      priority: "0.8",
      changefreq: "monthly",
    },
    {
      url: "/blog/couple-friendly-hotels-lucknow-safe-private",
      lastmod: "2025-05-12",
      priority: "0.8",
      changefreq: "monthly",
    },
  ];

  const today = new Date().toISOString().split("T")[0];
  const propertyEntries: SitemapEntry[] = allProperties
    .filter((p) => p.slug)
    .map((p) => ({
      url: `/${p.slug}`,
      lastmod: toDateStr(p.updatedAt, today),
      priority: "0.9",
      changefreq: "daily",
    }));

  const allEntries = [...staticEntries, ...propertyEntries];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries
  .map(
    (e) => `  <url>
    <loc>${SITE_URL}${e.url}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  await writeFile(path.resolve(distPath, "sitemap.xml"), xml, "utf-8");
  console.log(`[revalidate] ✓ sitemap.xml (${allEntries.length} URLs)`);
}

async function runBatch(urlPaths: string[]): Promise<void> {
  isBuilding = true;
  try {
    const distPath = path.resolve(process.cwd(), "dist/public");
    const entryServerPath = path.resolve(
      process.cwd(),
      "dist/server/entry-server.js",
    );

    if (!existsSync(entryServerPath)) {
      console.warn(
        "[revalidate] dist/server/entry-server.js not found; run a full build first",
      );
      return;
    }

    const templatePath = path.resolve(distPath, "_template.html");
    if (!existsSync(templatePath)) {
      console.warn(
        "[revalidate] _template.html not found; run a full build first",
      );
      return;
    }

    const [templateHtml, allProperties] = await Promise.all([
      readFile(templatePath, "utf-8"),
      fetchAllProperties(),
    ]);

    const cacheBuster = Date.now();
    const { render } = (await import(
      `${pathToFileURL(entryServerPath).href}?t=${cacheBuster}`
    )) as {
      render: (
        url: string,
        queryData?: Array<{ key: unknown[]; value: unknown }>,
      ) => {
        html: string;
        helmet: Helmet;
        dehydratedState: unknown;
      };
    };

    const routes = resolveRoutes(urlPaths, allProperties);
    const rebuiltUrls: string[] = [];
    const baseUrl = (
      process.env.SITE_URL ?? "https://pratapliving.com"
    ).replace(/\/$/, "");

    for (const route of routes) {
      try {
        const { html, helmet, dehydratedState } = render(
          route.url,
          route.queryData,
        );
        const outPath = path.resolve(distPath, route.file);
        const outDir = path.dirname(outPath);
        if (!existsSync(outDir)) await mkdir(outDir, { recursive: true });

        await writeFile(
          outPath,
          injectSSR(templateHtml, html, helmet, dehydratedState),
          "utf-8",
        );
        rebuiltUrls.push(`${baseUrl}${route.url}`);
        console.log(`[revalidate] ✓ ${route.url}`);
      } catch (e) {
        console.warn(`[revalidate] ✗ ${route.url}:`, e);
      }
    }

    const hasPropertyChange = urlPaths.some(
      (u) =>
        u === "/" ||
        u === "/properties" ||
        allProperties.some((p) => p.slug && u === `/${p.slug}`),
    );
    if (hasPropertyChange) {
      await regenerateSitemap(allProperties, distPath).catch((e) =>
        console.warn("[revalidate] sitemap update failed:", e),
      );
    }

    await pingGoogleIndexing(rebuiltUrls);
  } catch (e) {
    console.error("[revalidate] Error during targeted revalidation:", e);
  } finally {
    isBuilding = false;
  }
}

async function getGoogleAccessToken(key: {
  client_email: string;
  private_key: string;
}): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: key.client_email,
    sub: key.client_email,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
    scope: "https://www.googleapis.com/auth/indexing",
  };

  const b64url = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString("base64url");

  const signingInput = `${b64url(header)}.${b64url(payload)}`;
  const signer = createSign("RSA-SHA256");
  signer.update(signingInput);
  const signature = signer.sign(key.private_key, "base64url");
  const jwt = `${signingInput}.${signature}`;

  const tokenResp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const data = (await tokenResp.json()) as {
    access_token?: string;
    error?: string;
  };
  if (!data.access_token) {
    throw new Error(
      `Failed to get Google access token: ${data.error ?? JSON.stringify(data)}`,
    );
  }
  return data.access_token;
}

async function pingGoogleIndexing(urls: string[]): Promise<void> {
  if (urls.length === 0) return;

  const keyJson = process.env.GOOGLE_INDEXING_SA_KEY;
  if (!keyJson) {
    console.log(
      "[revalidate] GOOGLE_INDEXING_SA_KEY not set; skipping Google Indexing API ping",
    );
    return;
  }

  let key: { client_email: string; private_key: string };
  try {
    key = JSON.parse(keyJson);
  } catch {
    console.warn("[revalidate] GOOGLE_INDEXING_SA_KEY is not valid JSON; skipping");
    return;
  }

  let token: string;
  try {
    token = await getGoogleAccessToken(key);
  } catch (e) {
    console.warn("[revalidate] Could not get Google access token:", e);
    return;
  }

  for (const url of urls) {
    try {
      const resp = await fetch(
        "https://indexing.googleapis.com/v3/urlNotifications:publish",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ url, type: "URL_UPDATED" }),
        },
      );
      if (resp.ok) {
        console.log(`[revalidate] Google pinged ✓ ${url}`);
      } else {
        const body = await resp.text();
        console.warn(
          `[revalidate] Google ping failed for ${url}: ${resp.status} ${body}`,
        );
      }
    } catch (e) {
      console.warn(`[revalidate] Google ping error for ${url}:`, e);
    }
  }
}

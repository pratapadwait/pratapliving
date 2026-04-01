import { readFile, writeFile } from "fs/promises";
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
}

type Helmet = Record<string, { toString(): string }>;

let debounceTimer: NodeJS.Timeout | null = null;
const pendingSlugs = new Set<string>();
let isBuilding = false;

export function scheduleRevalidation(slugs: string[]): void {
  if (process.env.NODE_ENV !== "production") return;

  for (const slug of slugs) {
    pendingSlugs.add(slug);
  }

  if (debounceTimer) clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    if (isBuilding) {
      scheduleRevalidation([]);
      return;
    }

    const batch = Array.from(pendingSlugs);
    pendingSlugs.clear();
    debounceTimer = null;

    runTargetedRevalidation(batch).catch((e) =>
      console.error("[revalidate] unhandled error:", e),
    );
  }, 5000);
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
             images, featured
      FROM properties
      ORDER BY featured DESC, name ASC
    `);
    return rows;
  } finally {
    await pool.end();
  }
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

async function runTargetedRevalidation(slugs: string[]): Promise<void> {
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

    const [templateHtml, allProperties] = await Promise.all([
      readFile(path.resolve(distPath, "index.html"), "utf-8"),
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

    const rebuiltUrls: string[] = [];
    const baseUrl =
      process.env.SITE_URL?.replace(/\/$/, "") ?? "https://pratapliving.com";

    const listRoutes = [
      { url: "/", file: "index.html" },
      { url: "/properties", file: "properties.html" },
    ];

    for (const route of listRoutes) {
      try {
        const { html, helmet, dehydratedState } = render(route.url, [
          { key: ["/api/properties"], value: allProperties },
        ]);
        await writeFile(
          path.resolve(distPath, route.file),
          injectSSR(templateHtml, html, helmet, dehydratedState),
          "utf-8",
        );
        rebuiltUrls.push(`${baseUrl}${route.url}`);
        console.log(`[revalidate] ✓ ${route.url}`);
      } catch (e) {
        console.warn(`[revalidate] ✗ ${route.url}:`, e);
      }
    }

    const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

    for (const slug of slugs) {
      if (!SLUG_RE.test(slug)) {
        console.warn(`[revalidate] rejected invalid slug: "${slug}"`);
        continue;
      }

      const property = allProperties.find((p) => p.slug === slug);
      if (!property) {
        console.warn(`[revalidate] slug "${slug}" not found in DB; skipping`);
        continue;
      }

      try {
        const { html, helmet, dehydratedState } = render(`/${slug}`, [
          { key: ["/api/properties", slug], value: property },
          { key: ["/api/properties"], value: allProperties },
        ]);
        await writeFile(
          path.resolve(distPath, `${slug}.html`),
          injectSSR(templateHtml, html, helmet, dehydratedState),
          "utf-8",
        );
        rebuiltUrls.push(`${baseUrl}/${slug}`);
        console.log(`[revalidate] ✓ /${slug}`);
      } catch (e) {
        console.warn(`[revalidate] ✗ /${slug}:`, e);
      }
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

  const data = (await tokenResp.json()) as { access_token?: string; error?: string };
  if (!data.access_token) {
    throw new Error(`Failed to get Google access token: ${data.error ?? JSON.stringify(data)}`);
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
    console.warn(
      "[revalidate] GOOGLE_INDEXING_SA_KEY is not valid JSON; skipping",
    );
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

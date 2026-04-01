import express, { type Express } from "express";
import fs from "fs";
import path from "path";

const HTML_CACHE = "public, s-maxage=3600, stale-while-revalidate=86400";
const ASSET_CACHE = "public, max-age=31536000, immutable";
const ASSET_RE = /\.(js|css|woff2?|ttf|eot|svg|png|jpg|jpeg|webp|avif|ico|json)$/;

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(
    express.static(distPath, {
      setHeaders(res, filePath) {
        if (filePath.endsWith(".html")) {
          res.setHeader("Cache-Control", HTML_CACHE);
        } else if (ASSET_RE.test(filePath)) {
          res.setHeader("Cache-Control", ASSET_CACHE);
        }
      },
    }),
  );

  app.use("/{*path}", (req, res, next) => {
    if (req.originalUrl.startsWith("/api") || req.originalUrl.startsWith("/objects")) {
      return next();
    }

    const urlPath = req.path === "/" ? "index" : req.path.replace(/^\/+/, "");
    const prerenderPath = path.resolve(distPath, `${urlPath}.html`);

    if (fs.existsSync(prerenderPath)) {
      res.setHeader("Cache-Control", HTML_CACHE);
      return res.sendFile(prerenderPath);
    }

    res.setHeader("Cache-Control", HTML_CACHE);
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

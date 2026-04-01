import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import App from "./App";

export function render(url: string): { html: string; helmet: HelmetServerState } {
  const helmetContext: { helmet?: HelmetServerState } = {};

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <Router hook={() => [url, () => {}] as [string, () => void]}>
        <App />
      </Router>
    </HelmetProvider>
  );

  return { html, helmet: helmetContext.helmet! };
}

import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import { dehydrate, type DehydratedState } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import App from "./App";

export interface QueryDataEntry {
  key: unknown[];
  value: unknown;
}

export interface RenderResult {
  html: string;
  helmet: HelmetServerState;
  dehydratedState: DehydratedState;
}

export function render(url: string, queryData?: QueryDataEntry[]): RenderResult {
  queryClient.clear();

  if (queryData) {
    for (const { key, value } of queryData) {
      queryClient.setQueryData(key, value);
    }
  }

  const dehydratedState = dehydrate(queryClient);
  const helmetContext: { helmet?: HelmetServerState } = {};

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <Router hook={() => [url, () => {}] as [string, () => void]}>
        <App />
      </Router>
    </HelmetProvider>
  );

  return { html, helmet: helmetContext.helmet!, dehydratedState };
}

import { useEffect } from "react";

type JsonLdSchema = Record<string, unknown> | Record<string, unknown>[];

export function useJsonLd(schema: JsonLdSchema | null | undefined) {
  useEffect(() => {
    if (!schema) return;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "json-ld-schema";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById("json-ld-schema");
      if (existing) {
        document.head.removeChild(existing);
      }
    };
  }, []);
}

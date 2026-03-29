import { useEffect } from "react";

export function useJsonLd(schema: Record<string, unknown>) {
  useEffect(() => {
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

import { useEffect } from "react";

export function useDocumentTitle(title: string, description?: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      const previousDescription = metaDescription?.getAttribute("content") || "";
      
      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.setAttribute("name", "description");
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute("content", description);

      return () => {
        document.title = previousTitle;
        if (metaDescription) {
          metaDescription.setAttribute("content", previousDescription);
        }
      };
    }

    return () => {
      document.title = previousTitle;
    };
  }, [title, description]);
}

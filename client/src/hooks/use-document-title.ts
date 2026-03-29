import { useEffect } from "react";

export function useDocumentTitle(title: string, description?: string, keywords?: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    let previousDescription = "";
    let previousKeywords = "";

    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      previousDescription = metaDescription?.getAttribute("content") || "";
      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.setAttribute("name", "description");
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute("content", description);
    }

    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      previousKeywords = metaKeywords?.getAttribute("content") || "";
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.setAttribute("name", "keywords");
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", keywords);
    }

    return () => {
      document.title = previousTitle;
      if (description) {
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) metaDescription.setAttribute("content", previousDescription);
      }
      if (keywords) {
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
          if (previousKeywords) {
            metaKeywords.setAttribute("content", previousKeywords);
          } else {
            metaKeywords.parentNode?.removeChild(metaKeywords);
          }
        }
      }
    };
  }, [title, description, keywords]);
}

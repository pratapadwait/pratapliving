import { useState, useRef, useEffect } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  sizes?: string;
  "data-testid"?: string;
}

function isImageKitUrl(url: string): boolean {
  return url.includes("ik.imagekit.io");
}

function getImageKitTransformed(url: string, width: number, quality: number = 80): string {
  if (!isImageKitUrl(url)) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}tr=w-${width},q-${quality},f-auto`;
}

function generateSrcSet(url: string): string | undefined {
  if (!isImageKitUrl(url)) return undefined;
  const widths = [400, 640, 768, 1024, 1280, 1920];
  return widths
    .map((w) => `${getImageKitTransformed(url, w)} ${w}w`)
    .join(", ");
}

const DEFAULT_SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

export function OptimizedImage({
  src,
  alt,
  className = "",
  loading = "lazy",
  sizes,
  "data-testid": testId,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(loading === "eager");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading === "eager") {
      setIsInView(true);
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loading]);

  const srcSet = generateSrcSet(src);
  const optimizedSrc = isImageKitUrl(src) ? getImageKitTransformed(src, 800) : src;

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isLoaded ? "opacity-0" : "opacity-100"
        }`}
        aria-hidden="true"
      >
        <div className="w-full h-full bg-muted shimmer-placeholder" />
      </div>

      {isInView && (
        <img
          src={optimizedSrc}
          srcSet={srcSet}
          sizes={sizes || DEFAULT_SIZES}
          alt={alt}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          data-testid={testId}
        />
      )}
    </div>
  );
}

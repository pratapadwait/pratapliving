import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X, GripVertical, ImagePlus, Loader2, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  folder?: string;
}

export function ImageUploadManager({ images, onChange, maxImages = 20, folder = "/pratapliving-com" }: ImageUploadManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/imagekit/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Upload failed");
      }

      const { url } = await res.json();
      return url;
    } catch (err) {
      console.error("Upload error:", err);
      return null;
    }
  }, [folder]);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith("image/"));

    if (fileArray.length === 0) {
      toast({ title: "Please select image files only", variant: "destructive" });
      return;
    }

    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      toast({ title: `Maximum ${maxImages} images allowed`, variant: "destructive" });
      return;
    }

    const filesToUpload = fileArray.slice(0, remaining);
    setIsUploading(true);
    setUploadProgress(0);

    const newUrls: string[] = [];
    for (let i = 0; i < filesToUpload.length; i++) {
      setUploadProgress(Math.round(((i) / filesToUpload.length) * 100));
      const url = await uploadFile(filesToUpload[i]);
      if (url) newUrls.push(url);
    }

    setUploadProgress(100);
    setIsUploading(false);

    if (newUrls.length > 0) {
      onChange([...images, ...newUrls]);
      toast({ title: `${newUrls.length} image${newUrls.length > 1 ? "s" : ""} uploaded` });
    }

    if (newUrls.length < filesToUpload.length) {
      toast({ title: "Some images failed to upload", variant: "destructive" });
    }
  }, [images, onChange, maxImages, uploadFile, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const removeImage = useCallback((index: number) => {
    setActiveIndex(null);
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  }, [images, onChange]);

  const setAsMain = useCallback((index: number) => {
    if (index === 0) return;
    setActiveIndex(null);
    const updated = [...images];
    const [moved] = updated.splice(index, 1);
    updated.unshift(moved);
    onChange(updated);
    toast({ title: "Main photo updated" });
  }, [images, onChange, toast]);

  const handleReorderDragStart = useCallback((index: number) => {
    setDragIndex(index);
  }, []);

  const handleReorderDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  }, []);

  const handleReorderDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...images];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(dropIndex, 0, moved);
    onChange(updated);
    setDragIndex(null);
    setDragOverIndex(null);
  }, [dragIndex, images, onChange]);

  const toggleActive = useCallback((index: number) => {
    setActiveIndex(prev => prev === index ? null : index);
  }, []);

  return (
    <div className="space-y-3">
      <div
        className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors border-muted-foreground/25"
        onClick={() => !isUploading && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        data-testid="dropzone-images"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
            e.target.value = "";
          }}
          data-testid="input-file-upload"
        />
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Uploading to ImageKit... {uploadProgress}%</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drag & drop images here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              {images.length}/{maxImages} images
            </p>
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {images.map((img, index) => {
            const isActive = activeIndex === index;
            return (
              <div
                key={`${img}-${index}`}
                className={`relative aspect-square rounded-md cursor-pointer select-none ${
                  dragOverIndex === index ? "ring-2 ring-primary" : ""
                } ${dragIndex === index ? "opacity-50" : ""}`}
                draggable
                onDragStart={() => handleReorderDragStart(index)}
                onDragOver={(e) => handleReorderDragOver(e, index)}
                onDrop={(e) => handleReorderDrop(e, index)}
                onDragEnd={() => { setDragIndex(null); setDragOverIndex(null); }}
                onClick={() => toggleActive(index)}
                data-testid={`image-preview-${index}`}
              >
                <img
                  src={img}
                  alt={`Property photo ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                  loading="lazy"
                />
                {index === 0 && (
                  <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-md font-medium z-10">
                    Main
                  </span>
                )}
                {isActive && (
                  <>
                    <div className="absolute inset-0 bg-black/40 rounded-md pointer-events-none" />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 z-20"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeImage(index); }}
                      data-testid={`button-remove-image-${index}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    {index !== 0 && (
                      <Button
                        type="button"
                        size="sm"
                        className="absolute bottom-1 right-1 z-20 text-[10px] h-6 px-2"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setAsMain(index); }}
                        data-testid={`button-set-main-${index}`}
                      >
                        <Star className="h-3 w-3 mr-1" />
                        Set as main
                      </Button>
                    )}
                    <div className="absolute bottom-1 left-1 cursor-grab z-20">
                      <GripVertical className="h-4 w-4 text-white drop-shadow-md" />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Click an image to see options. Drag to reorder. First image is the main photo.
        </p>
      )}
    </div>
  );
}

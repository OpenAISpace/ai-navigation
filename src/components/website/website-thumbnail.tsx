"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import Image from "next/image";

interface WebsiteThumbnailProps {
  url: string;
  thumbnail: string | null;
  thumbnail_base64: string | null;
  title: string;
  className?: string;
}

export function WebsiteThumbnail({
  url,
  thumbnail,
  thumbnail_base64,
  title,
  className,
}: WebsiteThumbnailProps) {
  const [imageError, setImageError] = useState(false);
  const [faviconError, setFaviconError] = useState(false);
  const hostname = new URL(url).hostname;
  const faviconUrl = `https://icon.horse/icon/${hostname}`;
  const thumbnailSrc = thumbnail_base64 || thumbnail || "";

  if ((!thumbnail_base64 && !thumbnail) || imageError) {
    return (
      <div
        className={cn(
          "relative w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center",
          "group-hover:bg-primary/10 transition-colors duration-300",
          className
        )}
      >
        {!faviconError ? (
          <Image
            src={faviconUrl}
            alt={title}
            width={20}
            height={20}
            className="w-5 h-5"
            onError={() => setFaviconError(true)}
          />
        ) : (
          <Globe className="h-5 w-5 text-primary/50" />
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-10 h-10 rounded-lg overflow-hidden",
        "group-hover:ring-2 ring-primary/20 transition-all duration-300",
        className
      )}
    >
      <Image
        src={thumbnailSrc}
        alt={title}
        fill
        sizes="40px"
        className="object-cover"
        placeholder={thumbnail_base64 ? "blur" : "empty"}
        blurDataURL={thumbnail_base64 ? `data:image/png;base64,${thumbnail_base64}` : undefined}
        onError={() => setImageError(true)}
      />
    </div>
  );
}

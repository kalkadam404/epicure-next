import Image from "next/image";
import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallback?: string;
}

export function Avatar({
  src,
  alt,
  fallback,
  className,
  ...props
}: AvatarProps) {
  return (
    <div
      className={cn(
        "relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-gray-50 to-gray-100 text-2xl font-semibold text-gray-500",
        className
      )}
      {...props}
    >
      {src ? (
        <Image
          src={src}
          alt={alt ?? "User avatar"}
          fill
          className="object-cover"
        />
      ) : (
        <span>{fallback ?? "?"}</span>
      )}
    </div>
  );
}

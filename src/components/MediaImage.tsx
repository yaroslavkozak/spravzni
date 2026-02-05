'use client'

import Image from 'next/image';

interface MediaImageProps {
  src: string; // Local path from public folder (e.g., "/images/header/logo.svg")
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  [key: string]: unknown; // Allow other Next.js Image props
}

/**
 * Simplified MediaImage component that loads images from local public folder
 * This replaces the R2/D1 fetching mechanism for now
 */
export default function MediaImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  priority,
  ...props
}: MediaImageProps) {
  // Use Next.js Image component for local images
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        priority={priority}
        unoptimized={true}
        {...props}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      unoptimized={true}
      {...props}
    />
  );
}


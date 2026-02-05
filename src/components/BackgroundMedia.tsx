'use client'

interface BackgroundMediaProps {
  src: string; // Local path from public folder (e.g., "/images/hero/hero.png")
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/**
 * BackgroundMedia component for CSS background images from local public folder
 */
export default function BackgroundMedia({
  src,
  className = '',
  style = {},
  children,
}: BackgroundMediaProps) {
  // Clean up the src to handle url() wrapper if provided
  const cleanSrc = src.startsWith('url(') ? src.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '') : src;
  const backgroundImage = `url(${cleanSrc})`;

  return (
    <div
      className={className}
      style={{ backgroundImage, ...style }}
    >
      {children}
    </div>
  );
}


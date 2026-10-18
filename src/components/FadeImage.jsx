import { useEffect, useRef, useState } from "react";

export default function FadeImage({
  src,
  alt,
  className = "",
  onLoad,
  onError,
  ...props
}) {
  const imageRef = useRef(null);
  const [loadedSrc, setLoadedSrc] = useState(null);

  useEffect(() => {
    if (imageRef.current?.complete) {
      setLoadedSrc(src);
    }
  }, [src]);

  const handleLoad = (event) => {
    setLoadedSrc(src);
    onLoad?.(event);
  };

  const handleError = (event) => {
    setLoadedSrc(src);
    onError?.(event);
  };

  return (
    <img
      {...props}
      ref={imageRef}
      src={src}
      alt={alt}
      onLoad={handleLoad}
      onError={handleError}
      className={[
        className,
        "transition-opacity duration-700 motion-reduce:transition-none",
        loadedSrc === src ? "opacity-100" : "opacity-0",
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

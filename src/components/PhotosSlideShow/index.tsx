"use client";

import { useState, useEffect } from "react";
import { Box, Fade } from "@mui/material";
import Image from "next/image";

interface PhotosSlideShowProps {
  images: string[];
  interval?: number; // Time in milliseconds between transitions
  height?: number | string | { xs: number; sm: number; md: number };
  width?: number | string;
}

const PhotosSlideShow = ({
  images,
  interval = 5000,
  height = { xs: 400, sm: 500, md: 500 },
  width = "100%",
}: PhotosSlideShowProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <Box
      sx={{
        position: "relative",
        height,
        width,
        overflow: "hidden",
      }}
    >
      {images.map((src, index) => (
        <Fade
          key={src}
          in={index === currentImageIndex}
          timeout={1000}
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
          }}
        >
          <Box>
            <Image
              src={src}
              alt={`Slide ${index + 1}`}
              fill
              style={{
                objectFit: "cover",
              }}
              priority={index === 0}
            />
          </Box>
        </Fade>
      ))}
    </Box>
  );
};

export default PhotosSlideShow;

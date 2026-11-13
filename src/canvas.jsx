import PropTypes from 'prop-types';
import { useEffect, useRef, useState, useCallback } from "react";
import canvasImages from "./canvasImages";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function Canvas({details}) {
    const {startIndex, numImages, duration, size, top, left, zIndex} = details;
  const [index, setIndex] = useState(startIndex);
  const canvasRef = useRef(null);
  const counterRef = useRef({val : startIndex});
  const imageCache = useRef({});
  const scrollSpeed = useRef((Math.random() * 2 - 1).toFixed(2));

  // Preload images
  useEffect(() => {
    canvasImages.forEach((src) => {
      if (!imageCache.current[src]) {
        const img = new Image();
        img.src = src;
        imageCache.current[src] = img;
      }
    });
  }, []);

  useGSAP(() => {
    gsap.to(counterRef.current, {
      val: startIndex + numImages - 1,
      duration: duration,
      repeat: -1,
      ease: "linear",
      onUpdate: () => {
        setIndex(Math.round(counterRef.current.val));
      },
    });
  }, [startIndex, numImages, duration]);

  useGSAP(() => {
    gsap.from(canvasRef.current, {
      y : 20,
      opacity: 0,
      duration: 1,
      ease: "power1.inOut",
    });
  }, []);

  // Draw image to canvas
  const drawImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    const scale = window.devicePixelRatio || 1;
    const imgSrc = canvasImages[index];
    const cachedImg = imageCache.current[imgSrc];

    if (cachedImg && cachedImg.complete) {
      canvas.width = canvas.offsetWidth * scale;
      canvas.height = canvas.offsetHeight * scale;
      canvas.style.width = canvas.offsetWidth + "px";
      canvas.style.height = canvas.offsetHeight + "px";
      ctx.scale(scale, scale);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(cachedImg, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
    }
  }, [index]);

  useEffect(() => {
    drawImage();
  }, [drawImage]);

  return (
    <canvas
    data-scroll
    data-scroll-speed={scrollSpeed.current}
      ref={canvasRef}
      className="absolute pointer-events-none"
      style={{
        width: `${size * 1.8}px`,
        height: `${size * 1.8}px`,
        top: `${top}%`,
        left: `${left}%`,
        zIndex: zIndex,
      }}
    ></canvas>
  );
}

Canvas.propTypes = {
  details: PropTypes.shape({
    startIndex: PropTypes.number.isRequired,
    numImages: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    zIndex: PropTypes.number.isRequired,
  }).isRequired,
};

export default Canvas;

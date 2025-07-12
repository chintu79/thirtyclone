import { useEffect, useRef, useState } from "react";
import canvasImages from "./canvasImages";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function Canvas({details}) {
    const {startIndex, numImages, duration, size, top, left, zIndex} = details;
  const [index, setIndex] = useState(startIndex);
  const canvasRef = useRef(null);
  const counterRef = useRef({val : startIndex});

  useGSAP(() => {
    gsap.to(counterRef.current, {
      val: startIndex + numImages-1,
      duration: duration,
      repeat: -1,
      ease: "linear",
      onUpdate: () => {
        setIndex(Math.round(counterRef.current.val));
      },
    });
  }, []);

  useGSAP(() => {
    gsap.from(canvasRef.current, {
      y : 20,
      opacity: 0,
      duration: 1,
      ease: "power1.inOut",
    });
  }, []);

  useEffect(() => {
    const scale = window.devicePixelRatio;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = canvasImages[index];

    img.onload = () => {
      canvas.width = canvas.offsetWidth * scale;
      canvas.height = canvas.offsetHeight * scale;
      canvas.style.width = canvas.offsetWidth + "px";
      canvas.style.height = canvas.offsetHeight + "px";
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
    };
  }, [index]);

  return (
    <canvas
    data-scroll
    data-scroll-speed={(Math.random() * 2 - 1).toFixed(2)}
      ref={canvasRef}
      className="absolute"
      style={{
        width: `${size *1.8}px`,
        height: `${size * 1.8}px`,
        top: `${top}%`,
        left: `${left}%`,
        zIndex: zIndex,
      }}
      id="canvas"
    ></canvas>
  );
}

export default Canvas;

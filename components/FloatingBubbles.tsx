'use client';

import React, { useEffect, useRef } from 'react';

const FloatingBubbles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();

    const bubbles: Bubble[] = [];
    const bubbleCount = 50; // increasing bubble count for testing.
    // const bubbleCount = 15; // Adjust this for more or fewer bubbles

    class Bubble {
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = canvas!.height + Math.random() * 100;
        this.size = Math.random() * 80 + 20; // Size between 20 and 100
        // this.size = Math.random() * 150 + 50; // Testing. Increasing bubble size for visbility.
        this.speed = Math.random() * 0.5 + 0.1;
        this.opacity = Math.random() * 0.5 + 0.1; // Opacity between 0.1 and 0.6
        // this.opacity = 1; // Making bubbles fully opaque for visbility.
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 51, 234, ${this.opacity})`;
        ctx.fill();
      }

      update() {
        this.y -= this.speed;
        if (this.y < -this.size) {
          this.y = canvas!.height + this.size;
        }
      }
    }

    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push(new Bubble());
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      bubbles.forEach((bubble) => {
        bubble.update();
        bubble.draw();
      });
      requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
};

export default FloatingBubbles;
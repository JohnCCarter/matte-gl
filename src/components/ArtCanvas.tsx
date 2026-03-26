import { useEffect, useRef } from 'react';

interface ArtCanvasProps {
  correctCount: number;
  totalAnswered: number;
}

const COLORS = [
  'hsl(340, 70%, 55%)',
  'hsl(25, 90%, 58%)',
  'hsl(45, 95%, 65%)',
  'hsl(175, 55%, 50%)',
  'hsl(155, 45%, 65%)',
  'hsl(270, 50%, 60%)',
  'hsl(10, 80%, 65%)',
];

export function ArtCanvas({ correctCount, totalAnswered }: ArtCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const splatsRef = useRef<Array<{ x: number; y: number; r: number; color: string; rotation: number }>>([]);

  useEffect(() => {
    if (correctCount === 0 && totalAnswered === 0) {
      splatsRef.current = [];
    }
  }, [correctCount, totalAnswered]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Add a new splat for the latest correct answer
    if (correctCount > splatsRef.current.length) {
      const count = correctCount - splatsRef.current.length;
      for (let i = 0; i < count; i++) {
        splatsRef.current.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          r: 15 + Math.random() * 25,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rotation: Math.random() * Math.PI * 2,
        });
      }
    }

    // Clear & draw
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Background dots pattern
    ctx.globalAlpha = 0.08;
    for (let x = 0; x < rect.width; x += 20) {
      for (let y = 0; y < rect.height; y += 20) {
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'hsl(280, 30%, 20%)';
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    // Draw splats
    splatsRef.current.forEach((splat) => {
      ctx.save();
      ctx.translate(splat.x, splat.y);
      ctx.rotate(splat.rotation);
      ctx.globalAlpha = 0.7;

      // Main blob
      ctx.beginPath();
      ctx.fillStyle = splat.color;
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const wobble = splat.r * (0.7 + Math.random() * 0.6);
        const px = Math.cos(angle) * wobble;
        const py = Math.sin(angle) * wobble;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.quadraticCurveTo(
          Math.cos(angle - 0.3) * wobble * 1.2,
          Math.sin(angle - 0.3) * wobble * 1.2,
          px, py
        );
      }
      ctx.closePath();
      ctx.fill();

      // Small drips
      for (let d = 0; d < 3; d++) {
        const da = Math.random() * Math.PI * 2;
        const dd = splat.r + Math.random() * 12;
        ctx.beginPath();
        ctx.arc(Math.cos(da) * dd, Math.sin(da) * dd, 2 + Math.random() * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.restore();
    });

    // Star overlay for milestones
    if (correctCount >= 5) {
      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.font = `${40 + correctCount * 2}px serif`;
      ctx.textAlign = 'center';
      ctx.fillText('⭐', rect.width / 2, rect.height / 2 + 15);
      ctx.globalAlpha = 1;
      ctx.restore();
    }
  }, [correctCount, totalAnswered]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-28 rounded-xl"
      style={{ background: 'hsl(40, 40%, 97%)' }}
    />
  );
}

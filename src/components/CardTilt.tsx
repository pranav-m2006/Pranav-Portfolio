import React, { useRef, useState, useCallback } from 'react';

interface CardTiltProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glowColor?: string;
}

export default function CardTilt({
  children,
  className = '',
  maxTilt = 4,
  glowColor = 'rgba(0, 240, 255, 0.12)',
  ...rest
}: CardTiltProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [glowPos, setGlowPos] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotX = ((y - centerY) / centerY) * -maxTilt;
      const rotY = ((x - centerX) / centerX) * maxTilt;

      setTransform(
        `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`
      );

      setGlowPos({
        x: Math.round((x / rect.width) * 100),
        y: Math.round((y / rect.height) * 100),
        opacity: 1,
      });
    },
    [maxTilt]
  );

  const handleMouseLeave = useCallback(() => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlowPos((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: 'transform 0.25s cubic-bezier(0.2, 0, 0.2, 1), box-shadow 0.25s ease',
        transformStyle: 'preserve-3d',
      }}
      className={`relative overflow-hidden ${className}`}
      {...rest}
    >
      {/* Dynamic Cursor Light Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: glowPos.opacity,
          background: `radial-gradient(circle 260px at ${glowPos.x}% ${glowPos.y}%, ${glowColor}, transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}


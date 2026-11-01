import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import DeveloperWorkstation3D from './DeveloperWorkstation3D';
import { Sparkles, Monitor } from 'lucide-react';

interface Workstation3DProps {
  className?: string;
  enableControls?: boolean;
}

// Error Boundary for WebGL failure fallback
class WebGLErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('WebGL Workstation render fallback:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function Workstation3D({
  className = '',
  enableControls = true,
}: Workstation3DProps) {
  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
      }
    } catch {
      setWebGLSupported(false);
    }
  }, []);

  const fallbackUI = (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center">
      <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 shadow-glow-cyan">
        <Monitor className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2 font-display">Developer Workstation</h3>
      <p className="text-slate-400 text-sm max-w-xs mb-4">
        3D Hardware Acceleration fallback mode active. Workstation initialized.
      </p>
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 text-cyan-300 font-mono text-xs border border-cyan-500/20">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        WebGL Fallback Engine
      </div>
    </div>
  );

  if (!webGLSupported) {
    return fallbackUI;
  }

  return (
    <div
      className={`relative w-full h-full select-none ${className}`}
      role="region"
      aria-label="Interactive 3D Futuristic Developer Workstation"
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <WebGLErrorBoundary fallback={fallbackUI}>
        <Canvas
          camera={{ position: [0.15, 0.58, 3.8], fov: 42 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <ambientLight intensity={0.8} color="#94A3B8" />

          {/* Key Light on Character's Side Profile & Desk */}
          <directionalLight
            position={[4.5, 5.5, 3.5]}
            intensity={2.5}
            color="#E0F2FE"
          />

          {/* Electric Violet Rim Light outlining Character from behind */}
          <directionalLight
            position={[-4.5, 3.5, -3.5]}
            intensity={2.6}
            color="#8B5CF6"
          />

          {/* Underglow Fill Light */}
          <pointLight position={[0, -2, 2]} intensity={1.3} color="#00F0FF" />

          <Suspense fallback={null}>
            {/* Neat and clean 3D developer sitting at workstation */}
            <DeveloperWorkstation3D isSceneHovered={isHovered} />

            {/* High-performance ground contact shadow plane (Zero off-screen render pass!) */}
            <mesh position={[0, -1.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[4.2, 2.6]} />
              <meshBasicMaterial color="#020617" transparent opacity={0.65} />
            </mesh>
          </Suspense>

          {enableControls && (
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              maxPolarAngle={Math.PI / 2 + 0.1}
              minPolarAngle={Math.PI / 3.4}
              maxAzimuthAngle={Math.PI / 3.4}
              minAzimuthAngle={-Math.PI / 3.4}
              rotateSpeed={0.4}
              dampingFactor={0.05}
            />
          )}
        </Canvas>
      </WebGLErrorBoundary>

      {/* Floating HUD status badges */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none flex items-center gap-2">
        <div className="px-3.5 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-cyan-500/35 text-cyan-300 font-mono text-[11px] flex items-center gap-2 shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>Interactive 3D Workstation // Seated Developer</span>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10 pointer-events-none">
        <div className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/10 text-slate-400 font-mono text-[10px] flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Hover to Accelerate</span>
        </div>
      </div>
    </div>
  );
}

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Global centralized pointer tracking across the entire document
// Ensures pointer events over HTML content, cards, and buttons still drive the stars
const globalPointer = {
  x: 0,
  y: 0,
  prevX: 0,
  prevY: 0,
  vx: 0,
  vy: 0,
  active: false,
  lastMoved: 0,
};

if (typeof window !== 'undefined') {
  const onPointerMove = (e: PointerEvent) => {
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = -(e.clientY / window.innerHeight) * 2 + 1;

    globalPointer.vx = normX - globalPointer.prevX;
    globalPointer.vy = normY - globalPointer.prevY;
    globalPointer.prevX = normX;
    globalPointer.prevY = normY;

    globalPointer.x = normX;
    globalPointer.y = normY;
    globalPointer.active = true;
    globalPointer.lastMoved = performance.now();
  };

  const onPointerLeave = () => {
    globalPointer.active = false;
  };

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerleave', onPointerLeave, { passive: true });
}

// ---------------------------------------------------------------------------
// 1. REACTIVE STARFIELD (2,400 Stars with Natural Repulsion, Brightness & Trails)
// ---------------------------------------------------------------------------
function ReactiveStarfield({ count = 2400 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const posAttrRef = useRef<THREE.BufferAttribute>(null);
  const colAttrRef = useRef<THREE.BufferAttribute>(null);

  // Pre-allocate typed arrays for positions, base anchors, velocities, colors & base colors
  const data = useMemo(() => {
    const currentPositions = new Float32Array(count * 3);
    const basePositions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const baseColors = new Float32Array(count * 3);
    const starDepths = new Float32Array(count); // distance factor (0 to 1)

    const palette = [
      new THREE.Color('#00F0FF'), // Bright Cyan
      new THREE.Color('#38BDF8'), // Sky Blue
      new THREE.Color('#818CF8'), // Indigo / Violet
      new THREE.Color('#E0F2FE'), // Ice White
      new THREE.Color('#C084FC'), // Soft Purple
      new THREE.Color('#FFFFFF'), // Pure White
    ];

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // Spread across wide screen space to cover full scrolling page
      const x = (Math.random() - 0.5) * 85;
      const y = (Math.random() - 0.5) * 120;
      const z = (Math.random() - 0.5) * 45 - 8;

      currentPositions[idx] = x;
      currentPositions[idx + 1] = y;
      currentPositions[idx + 2] = z;

      basePositions[idx] = x;
      basePositions[idx + 1] = y;
      basePositions[idx + 2] = z;

      velocities[idx] = 0;
      velocities[idx + 1] = 0;
      velocities[idx + 2] = 0;

      // Depth ratio: closer stars (higher z) react more vigorously
      const depthRatio = Math.max(0.2, (z + 30) / 45);
      starDepths[i] = depthRatio;

      const baseColor = palette[Math.floor(Math.random() * palette.length)].clone();
      // Introduce subtle random brightness variations
      const lum = 0.5 + Math.random() * 0.5;
      baseColor.multiplyScalar(lum);

      colors[idx] = baseColor.r;
      colors[idx + 1] = baseColor.g;
      colors[idx + 2] = baseColor.b;

      baseColors[idx] = baseColor.r;
      baseColors[idx + 1] = baseColor.g;
      baseColors[idx + 2] = baseColor.b;
    }

    return {
      currentPositions,
      basePositions,
      velocities,
      colors,
      baseColors,
      starDepths,
    };
  }, [count]);

  useFrame((state) => {
    if (!posAttrRef.current || !colAttrRef.current) return;

    const t = state.clock.getElapsedTime();
    const now = performance.now();
    const isMouseActive = now - globalPointer.lastMoved < 3000;

    // Determine target pointer position in 3D world space
    let targetX = 0;
    let targetY = 0;

    if (isMouseActive) {
      targetX = globalPointer.x * 26;
      targetY = globalPointer.y * 16;
    } else {
      // Gentle ambient floating Lissajous movement for mobile/idle
      targetX = Math.sin(t * 0.4) * 8 + Math.cos(t * 0.7) * 4;
      targetY = Math.cos(t * 0.35) * 6 + Math.sin(t * 0.6) * 3;
    }

    const pos = posAttrRef.current.array as Float32Array;
    const cols = colAttrRef.current.array as Float32Array;
    const { basePositions, velocities, baseColors, starDepths } = data;

    const repulsionRadius = 8.5;
    const repulsionRadiusSq = repulsionRadius * repulsionRadius;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const depth = starDepths[i];

      // Subtle ambient drift for living cosmos
      const driftX = basePositions[idx] + Math.sin(t * 0.25 + i * 0.1) * 0.3;
      const driftY = basePositions[idx + 1] + Math.cos(t * 0.2 + i * 0.1) * 0.3;
      const driftZ = basePositions[idx + 2];

      const dx = pos[idx] - targetX;
      const dy = pos[idx + 1] - targetY;
      const distSq = dx * dx + dy * dy;

      if (distSq < repulsionRadiusSq && distSq > 0.001) {
        const dist = Math.sqrt(distSq);
        const normDist = dist / repulsionRadius; // 0 (center) to 1 (outer edge)

        // Force factor: closer particles push stronger, depth weighted
        const force = (1 - normDist) * (1.8 * depth);
        const dirX = dx / dist;
        const dirY = dy / dist;

        // Subtle follow-velocity drag + radial push
        const pushX = dirX * force * 0.35 + globalPointer.vx * 0.8 * depth;
        const pushY = dirY * force * 0.35 + globalPointer.vy * 0.8 * depth;

        velocities[idx] += pushX;
        velocities[idx + 1] += pushY;

        // Subtle wave/ripple effect radiating through particles
        const ripple = Math.sin(dist * 3.5 - t * 6) * 0.08 * (1 - normDist);
        velocities[idx] += dirX * ripple;
        velocities[idx + 1] += dirY * ripple;

        // Proximity Brightness Boost: Brighten star towards pure cyan-white
        const brightFactor = (1 - normDist) * 1.6;
        cols[idx] = Math.min(1.0, baseColors[idx] + brightFactor * 0.5);
        cols[idx + 1] = Math.min(1.0, baseColors[idx + 1] + brightFactor * 0.7);
        cols[idx + 2] = Math.min(1.0, baseColors[idx + 2] + brightFactor * 0.9);
      } else {
        // Return colors smoothly to base resting colors
        cols[idx] += (baseColors[idx] - cols[idx]) * 0.06;
        cols[idx + 1] += (baseColors[idx + 1] - cols[idx + 1]) * 0.06;
        cols[idx + 2] += (baseColors[idx + 2] - cols[idx + 2]) * 0.06;
      }

      // Spring-damping restoration physics back to anchor
      const springX = (driftX - pos[idx]) * 0.045;
      const springY = (driftY - pos[idx + 1]) * 0.045;
      const springZ = (driftZ - pos[idx + 2]) * 0.045;

      velocities[idx] = (velocities[idx] + springX) * 0.88;
      velocities[idx + 1] = (velocities[idx + 1] + springY) * 0.88;
      velocities[idx + 2] = (velocities[idx + 2] + springZ) * 0.88;

      pos[idx] += velocities[idx];
      pos[idx + 1] += velocities[idx + 1];
      pos[idx + 2] += velocities[idx + 2];
    }

    posAttrRef.current.needsUpdate = true;
    colAttrRef.current.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          ref={posAttrRef}
          attach="attributes-position"
          count={data.currentPositions.length / 3}
          array={data.currentPositions}
          itemSize={3}
        />
        <bufferAttribute
          ref={colAttrRef}
          attach="attributes-color"
          count={data.colors.length / 3}
          array={data.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.16}
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ---------------------------------------------------------------------------
// 2. CURSOR STARDUST TRAIL (Fine particles tracing pointer movement)
// ---------------------------------------------------------------------------
function CursorStardustTrail({ trailLength = 50 }: { trailLength?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const posAttrRef = useRef<THREE.BufferAttribute>(null);
  const colAttrRef = useRef<THREE.BufferAttribute>(null);

  const { positions, colors, lifeTimes } = useMemo(() => {
    const pos = new Float32Array(trailLength * 3);
    const col = new Float32Array(trailLength * 3);
    const life = new Float32Array(trailLength);

    for (let i = 0; i < trailLength; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 2; // slightly in front

      col[i * 3] = 0.0;
      col[i * 3 + 1] = 0.94;
      col[i * 3 + 2] = 1.0;

      life[i] = (i / trailLength);
    }

    return { positions: pos, colors: col, lifeTimes: life };
  }, [trailLength]);

  useFrame((state) => {
    if (!posAttrRef.current || !colAttrRef.current) return;

    const t = state.clock.getElapsedTime();
    const pos = posAttrRef.current.array as Float32Array;
    const col = colAttrRef.current.array as Float32Array;

    const targetX = globalPointer.x * 24;
    const targetY = globalPointer.y * 15;

    // Shift previous trail particles backwards
    for (let i = trailLength - 1; i > 0; i--) {
      const idx = i * 3;
      const prevIdx = (i - 1) * 3;

      pos[idx] = pos[prevIdx] + (Math.random() - 0.5) * 0.04;
      pos[idx + 1] = pos[prevIdx + 1] + (Math.random() - 0.5) * 0.04;
      pos[idx + 2] = pos[prevIdx + 2];

      const fade = Math.max(0, 1 - i / trailLength);
      col[idx] = 0.2 * fade;
      col[idx + 1] = 0.9 * fade;
      col[idx + 2] = 1.0 * fade;
    }

    // Lead particle tracks target
    pos[0] = targetX;
    pos[1] = targetY;
    pos[2] = 1.5;

    col[0] = 0.8;
    col[1] = 0.95;
    col[2] = 1.0;

    posAttrRef.current.needsUpdate = true;
    colAttrRef.current.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          ref={posAttrRef}
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          ref={colAttrRef}
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.18}
        vertexColors
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ---------------------------------------------------------------------------
// 3. DEEP COSMIC BACKDROP & GALACTIC TWINKLING STARS (2,000 Distant Stars)
// ---------------------------------------------------------------------------
function DeepCosmicStars({ count = 2000 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Distant sphere/disc distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 60 + Math.random() * 80;

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi) - 20;

      // Soft galactic palette
      const r = Math.random();
      if (r < 0.4) {
        // Cyan-ice
        col[i * 3] = 0.6;
        col[i * 3 + 1] = 0.9;
        col[i * 3 + 2] = 1.0;
      } else if (r < 0.7) {
        // Lavender-violet
        col[i * 3] = 0.75;
        col[i * 3 + 1] = 0.65;
        col[i * 3 + 2] = 1.0;
      } else {
        // White-blue
        col[i * 3] = 0.95;
        col[i * 3 + 1] = 0.95;
        col[i * 3 + 2] = 1.0;
      }
    }

    return [pos, col];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    // Very subtle slow cosmic rotation
    pointsRef.current.rotation.y = t * 0.003;
    pointsRef.current.rotation.x = Math.sin(t * 0.002) * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.11}
        vertexColors
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ---------------------------------------------------------------------------
// 4. CELESTIAL PLANET WITH DUAL GLOWING RINGS & AXIAL TILT
// ---------------------------------------------------------------------------
function CelestialPlanet() {
  const planetRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (planetRef.current) {
      planetRef.current.rotation.y = t * 0.02;
      planetRef.current.rotation.x = 0.35 + globalPointer.y * 0.05;
      planetRef.current.rotation.z = 0.25 + globalPointer.x * 0.05;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = -t * 0.025;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = t * 0.015;
    }
  });

  return (
    <group ref={planetRef} position={[22, 14, -32]} rotation={[0.4, 0.2, 0.35]}>
      {/* Planet Core Sphere */}
      <mesh>
        <sphereGeometry args={[4.5, 32, 32]} />
        <meshStandardMaterial
          color="#060C1A"
          roughness={0.75}
          metalness={0.25}
          emissive="#021024"
          emissiveIntensity={0.7}
        />
      </mesh>

      {/* Atmospheric Glow Rim */}
      <mesh scale={[1.045, 1.045, 1.045]}>
        <sphereGeometry args={[4.5, 32, 32]} />
        <meshStandardMaterial
          color="#00F0FF"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Inner Planetary Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2.3, 0.2, 0]}>
        <ringGeometry args={[5.6, 8.2, 64]} />
        <meshStandardMaterial
          color="#38BDF8"
          emissive="#00F0FF"
          emissiveIntensity={0.45}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer Holographic Ring */}
      <mesh ref={outerRingRef} rotation={[Math.PI / 2.3, 0.2, 0]}>
        <ringGeometry args={[9.0, 9.4, 64]} />
        <meshStandardMaterial
          color="#8B5CF6"
          emissive="#8B5CF6"
          emissiveIntensity={0.6}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 5. ORBITAL SATELLITE RELAY
// ---------------------------------------------------------------------------
function OrbitalSatelliteRelay() {
  const satelliteRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!satelliteRef.current) return;
    const t = state.clock.getElapsedTime();
    // Smooth celestial orbit
    const radius = 24;
    satelliteRef.current.position.x = Math.cos(t * 0.08) * radius - 8;
    satelliteRef.current.position.y = Math.sin(t * 0.06) * 12 + 6;
    satelliteRef.current.position.z = Math.sin(t * 0.08) * 10 - 15;
    satelliteRef.current.rotation.y = t * 0.15;
    satelliteRef.current.rotation.z = Math.sin(t * 0.1) * 0.2;
  });

  return (
    <group ref={satelliteRef}>
      {/* Central Module */}
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.7]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Blinking Beacon Light */}
      <mesh position={[0, 0.45, 0]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshBasicMaterial color="#00F0FF" />
      </mesh>
      {/* Left Solar Array */}
      <mesh position={[-0.85, 0, 0]}>
        <boxGeometry args={[0.85, 0.26, 0.02]} />
        <meshStandardMaterial color="#0F172A" emissive="#38BDF8" emissiveIntensity={0.35} />
      </mesh>
      {/* Right Solar Array */}
      <mesh position={[0.85, 0, 0]}>
        <boxGeometry args={[0.85, 0.26, 0.02]} />
        <meshStandardMaterial color="#0F172A" emissive="#38BDF8" emissiveIntensity={0.35} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 6. DISTANT GEODESIC MEGASTRUCTURE
// ---------------------------------------------------------------------------
function DistantMegastructure() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.015;
    meshRef.current.rotation.y = t * 0.02;
  });

  return (
    <mesh ref={meshRef} position={[-24, -16, -38]}>
      <icosahedronGeometry args={[5.2, 1]} />
      <meshBasicMaterial
        color="#8B5CF6"
        wireframe
        transparent
        opacity={0.16}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// 7. SHOOTING STAR METEORS
// ---------------------------------------------------------------------------
function ShootingStar() {
  const meteorRef = useRef<THREE.Mesh>(null);
  const meteorState = useRef({
    active: false,
    startX: 0,
    startY: 0,
    startZ: 0,
    progress: 0,
    speed: 0.04,
  });

  useFrame(() => {
    const s = meteorState.current;

    if (!s.active) {
      // 0.4% chance per frame to ignite shooting star
      if (Math.random() < 0.004) {
        s.active = true;
        s.progress = 0;
        s.startX = (Math.random() - 0.5) * 40 - 5;
        s.startY = 18 + Math.random() * 8;
        s.startZ = -10 - Math.random() * 15;
        s.speed = 0.035 + Math.random() * 0.025;
      }
      return;
    }

    s.progress += s.speed;
    if (meteorRef.current) {
      meteorRef.current.position.x = s.startX + s.progress * 35;
      meteorRef.current.position.y = s.startY - s.progress * 22;
      meteorRef.current.position.z = s.startZ;

      const mat = meteorRef.current.material as THREE.MeshBasicMaterial;
      if (s.progress < 0.25) {
        mat.opacity = s.progress * 4 * 0.8;
      } else if (s.progress > 0.7) {
        mat.opacity = (1 - s.progress) * 3.3 * 0.8;
      } else {
        mat.opacity = 0.8;
      }
    }

    if (s.progress >= 1.0) {
      s.active = false;
      if (meteorRef.current) {
        (meteorRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
      }
    }
  });

  return (
    <mesh ref={meteorRef} rotation={[0, 0, -Math.PI / 6]}>
      <cylinderGeometry args={[0.03, 0.12, 5.0, 8]} />
      <meshBasicMaterial
        color="#00F0FF"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// 8. CAMERA PARALLAX CONTROLLER
// ---------------------------------------------------------------------------
function SpaceCameraController() {
  useFrame((state) => {
    const targetCamX = globalPointer.x * 1.4;
    const targetCamY = globalPointer.y * 0.9;

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetCamX, 0.04);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetCamY, 0.04);
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

// ---------------------------------------------------------------------------
// MAIN EXPORT: SPACE BACKGROUND
// ---------------------------------------------------------------------------
export default function SpaceBackground() {
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setWebGLSupported(false);
    } catch {
      setWebGLSupported(false);
    }
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Deep Space Background Atmosphere Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020408] via-[#040816] to-[#02040A] opacity-95" />

      {/* Atmospheric Nebula Ambient Light Pools */}
      <div className="absolute top-1/4 left-1/6 w-[700px] h-[700px] bg-cyan-600/10 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute top-2/3 right-1/5 w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[190px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[950px] h-[950px] bg-indigo-900/10 rounded-full blur-[210px] pointer-events-none" />

      {webGLSupported ? (
        <Canvas
          camera={{ position: [0, 0, 16], fov: 58 }}
          gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
          className="w-full h-full"
        >
          {/* Lighting */}
          <ambientLight intensity={0.3} color="#38BDF8" />
          <directionalLight position={[12, 16, 6]} intensity={1.6} color="#00F0FF" />
          <directionalLight position={[-16, -12, -6]} intensity={1.3} color="#8B5CF6" />

          {/* 1. Interactive Reactive Starfield (Cursor Repulsion & Brightness) */}
          <ReactiveStarfield count={2400} />

          {/* 2. Cursor Stardust Trail */}
          <CursorStardustTrail trailLength={45} />

          {/* 3. Deep Cosmic Backdrop Stars */}
          <DeepCosmicStars count={2000} />

          {/* 4. Celestial Planet with Dual Glowing Rings */}
          <CelestialPlanet />

          {/* 5. Orbital Satellite Relay */}
          <OrbitalSatelliteRelay />

          {/* 6. Distant Megastructure */}
          <DistantMegastructure />

          {/* 7. Shooting Star Meteor */}
          <ShootingStar />

          {/* 8. Parallax Camera Controller */}
          <SpaceCameraController />
        </Canvas>
      ) : (
        <div className="absolute inset-0 bg-cyber-grid opacity-20" />
      )}
    </div>
  );
}

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ---------------------------------------------------------------------------
// 1. DATA DEFINITIONS FOR THE SKILL TOOLKIT SPHERE
// Exactly matching the user's required skills + cohesive core stack
// ---------------------------------------------------------------------------
export interface ToolkitSkill {
  name: string;
  color: string;
  category: string;
}

export const TOOLKIT_SKILLS: ToolkitSkill[] = [
  // 12 Required Skills
  { name: 'React', color: '#00F0FF', category: 'Frontend' },
  { name: 'JavaScript', color: '#FACC15', category: 'Language' },
  { name: 'Python', color: '#38BDF8', category: 'AI & Data' },
  { name: 'Java', color: '#FB923C', category: 'Backend' },
  { name: 'Node.js', color: '#4ADE80', category: 'Backend' },
  { name: 'AI Development', color: '#C084FC', category: 'Applied AI' },
  { name: 'Machine Learning', color: '#818CF8', category: 'AI & Data' },
  { name: 'Data Structures & Algorithms', color: '#A855F7', category: 'Core CS' },
  { name: 'Git & GitHub', color: '#F1F5F9', category: 'Tooling' },
  { name: 'SQL', color: '#38BDF8', category: 'Database' },
  { name: 'HTML', color: '#F97316', category: 'Web' },
  { name: 'CSS', color: '#60A5FA', category: 'Styling' },
  // Complementary high-frequency skills for perfectly balanced 16-node sphere
  { name: 'TypeScript', color: '#38BDF8', category: 'Language' },
  { name: 'Tailwind CSS', color: '#06B6D4', category: 'Styling' },
  { name: 'Next.js', color: '#E2E8F0', category: 'Fullstack' },
  { name: 'Deep Learning', color: '#C084FC', category: 'Applied AI' },
];

// Helper to generate glowing radial gradient particle sprite texture
function createNodeParticleTexture(colorHex: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, '#FFFFFF');
  grad.addColorStop(0.25, colorHex);
  grad.addColorStop(0.7, colorHex + '55');
  grad.addColorStop(1, colorHex + '00');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(32, 32, 32, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

// Helper to generate crisp, high-DPI skill pill sprite texture
function createLabelPillTexture(label: string, colorHex: string): { texture: THREE.CanvasTexture; aspect: number } {
  const font = 'bold 36px "Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const measureCanvas = document.createElement('canvas');
  const measureCtx = measureCanvas.getContext('2d')!;
  measureCtx.font = font;
  const textWidth = Math.ceil(measureCtx.measureText(label).width + 56);
  const height = 64;

  const canvas = document.createElement('canvas');
  // 2x Retina Resolution
  canvas.width = textWidth * 2;
  canvas.height = height * 2;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(2, 2);

  const radius = 32;

  // Dark glass pill background
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.arcTo(textWidth, 0, textWidth, height, radius);
  ctx.arcTo(textWidth, height, 0, height, radius);
  ctx.arcTo(0, height, 0, 0, radius);
  ctx.arcTo(0, 0, textWidth, 0, radius);
  ctx.closePath();

  ctx.fillStyle = 'rgba(7, 11, 22, 0.92)';
  ctx.fill();

  // Vibrant colored border
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = colorHex;
  ctx.stroke();

  // Subtle interior glow accent dot
  ctx.beginPath();
  ctx.arc(28, height / 2, 4.5, 0, Math.PI * 2);
  ctx.fillStyle = colorHex;
  ctx.fill();

  // White crisp text
  ctx.font = font;
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, textWidth / 2 + 10, height / 2 + 1);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  return { texture, aspect: textWidth / height };
}

// ---------------------------------------------------------------------------
// 2. DELICATE GLOBE OUTLINE & SURFACE DETAILS (GRID, EQUATOR & STARDUST)
// ---------------------------------------------------------------------------
function GlobeOutlineDetails({ radius = 2.36 }: { radius?: number }) {
  const { graticuleGroup, microNodes } = useMemo(() => {
    const group = new THREE.Group();

    // Material for subtle glowing latitude & longitude outlines
    const outlineMat = new THREE.LineBasicMaterial({
      color: '#00F0FF',
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const equatorMat = new THREE.LineBasicMaterial({
      color: '#FF9500',
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // Latitude Parallels
    const latSteps = [-60, -35, 0, 35, 60];
    latSteps.forEach((lat) => {
      const pts: THREE.Vector3[] = [];
      const segs = 64;
      const phi = (90 - lat) * (Math.PI / 180);
      const rAtLat = radius * Math.sin(phi);
      const y = radius * Math.cos(phi);

      for (let i = 0; i <= segs; i++) {
        const theta = (i / segs) * Math.PI * 2;
        pts.push(new THREE.Vector3(rAtLat * Math.cos(theta), y, rAtLat * Math.sin(theta)));
      }

      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(geom, lat === 0 ? equatorMat : outlineMat);
      group.add(line);
    });

    // Longitude Meridians
    const lonSteps = 12; // every 30 degrees
    for (let i = 0; i < lonSteps; i++) {
      const theta = (i / lonSteps) * Math.PI * 2;
      const pts: THREE.Vector3[] = [];
      const segs = 48;

      for (let j = 0; j <= segs; j++) {
        const phi = (j / segs) * Math.PI; // 0 to PI
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        pts.push(new THREE.Vector3(x, y, z));
      }

      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(geom, outlineMat);
      group.add(line);
    }

    // 160 subtle glowing micro-nodes on the sphere surface
    const nodeCount = 160;
    const nodePos = new Float32Array(nodeCount * 3);
    const nodeColors = new Float32Array(nodeCount * 3);
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < nodeCount; i++) {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / nodeCount);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);

      nodePos[i * 3] = x;
      nodePos[i * 3 + 1] = y;
      nodePos[i * 3 + 2] = z;

      if (i % 3 === 0) {
        nodeColors[i * 3] = 1.0;
        nodeColors[i * 3 + 1] = 0.65;
        nodeColors[i * 3 + 2] = 0.2;
      } else {
        nodeColors[i * 3] = 0.0;
        nodeColors[i * 3 + 1] = 0.94;
        nodeColors[i * 3 + 2] = 1.0;
      }
    }

    const nodeGeom = new THREE.BufferGeometry();
    nodeGeom.setAttribute('position', new THREE.BufferAttribute(nodePos, 3));
    nodeGeom.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3));

    return { graticuleGroup: group, microNodes: nodeGeom };
  }, [radius]);

  return (
    <group>
      {/* Latitude / Longitude Glowing Outlines */}
      <primitive object={graticuleGroup} />

      {/* Surface Micro-Nodes (Fine Stardust Grid Points) */}
      <points geometry={microNodes}>
        <pointsMaterial
          size={0.038}
          vertexColors
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Outer Rim Silhouette Glow Outline */}
      <mesh>
        <sphereGeometry args={[radius * 1.015, 32, 32]} />
        <meshBasicMaterial
          color="#00F0FF"
          transparent
          opacity={0.09}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 3. 3D SPHERE OF SKILLS & CONSTELLATION WEB
// ---------------------------------------------------------------------------
function SphereToolkitScene({
  rotationState,
  activeSkillName,
  setActiveSkillName,
}: {
  rotationState: React.MutableRefObject<{ x: number; y: number }>;
  activeSkillName: string | null;
  setActiveSkillName: (name: string | null) => void;
}) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const sphereRadius = 2.45;
  const count = TOOLKIT_SKILLS.length;

  // Calculate Fibonacci sphere points & nearest-neighbor constellation lines
  const { points, linesGeometry, spriteData } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden ratio angle (~2.39996 rad)

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      const pos = new THREE.Vector3(x, y, z).multiplyScalar(sphereRadius);
      pts.push(pos);
    }

    // Connect nearest neighbor nodes with glowing constellation lines
    const linePositions: number[] = [];
    const lineColors: number[] = [];
    const edges: Record<string, boolean> = {};

    for (let i = 0; i < count; i++) {
      const neighbors = pts
        .map((p, idx) => ({ idx, dist: p.distanceTo(pts[i]) }))
        .filter((item) => item.idx !== i)
        .sort((a, b) => a.dist - b.dist);

      // Connect to 2 closest nodes
      for (let k = 0; k < 2; k++) {
        const j = neighbors[k].idx;
        const key1 = `${i}-${j}`;
        const key2 = `${j}-${i}`;
        if (!edges[key1] && !edges[key2]) {
          edges[key1] = true;
          linePositions.push(pts[i].x, pts[i].y, pts[i].z);
          linePositions.push(pts[j].x, pts[j].y, pts[j].z);

          const c1 = new THREE.Color(TOOLKIT_SKILLS[i].color);
          const c2 = new THREE.Color(TOOLKIT_SKILLS[j].color);
          lineColors.push(c1.r, c1.g, c1.b);
          lineColors.push(c2.r, c2.g, c2.b);
        }
      }
    }

    const linesGeom = new THREE.BufferGeometry();
    linesGeom.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    linesGeom.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

    // Pre-create textures and materials for nodes and label pills
    const data = TOOLKIT_SKILLS.map((skill, idx) => {
      const nodeTex = createNodeParticleTexture(skill.color);
      const { texture: pillTex, aspect } = createLabelPillTexture(skill.name, skill.color);
      return {
        skill,
        pos: pts[idx],
        nodeTex,
        pillTex,
        aspect,
      };
    });

    return { points: pts, linesGeometry: linesGeom, spriteData: data };
  }, [count, sphereRadius]);

  // Frame Loop applying smooth rotation from physics controller
  useFrame(() => {
    if (rootGroupRef.current) {
      rootGroupRef.current.rotation.x = rotationState.current.x;
      rootGroupRef.current.rotation.y = rotationState.current.y;
    }
  });

  return (
    <group ref={rootGroupRef} position={[0, 0, 0]}>
      {/* Translucent Cosmic Glass Sphere (subtle depth occlusion without solid blackness) */}
      <mesh>
        <sphereGeometry args={[sphereRadius * 0.95, 32, 32]} />
        <meshBasicMaterial
          color="#060B1C"
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>

      {/* Delicate Glowing Globe Graticule Outlines & Surface Stardust Details */}
      <GlobeOutlineDetails radius={sphereRadius * 0.95} />

      {/* Constellation Network Lines connecting Skill Nodes */}
      <lineSegments geometry={linesGeometry}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.38}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* 3D Skills Distributed Across the Spherical Surface */}
      {spriteData.map(({ skill, pos, nodeTex, pillTex, aspect }) => {
        const isActive = activeSkillName === skill.name;
        const scaleBase = 0.42;

        // Position label slightly proud of the node
        const labelPos = pos.clone().multiplyScalar(1.14);

        return (
          <group key={skill.name}>
            {/* Glowing Anchor Node Particle */}
            <sprite position={pos} scale={isActive ? [0.65, 0.65, 1] : [0.45, 0.45, 1]}>
              <spriteMaterial
                map={nodeTex}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </sprite>

            {/* Floating Skill Pill Label (Billboarded, always faces camera!) */}
            <sprite
              position={labelPos}
              scale={
                isActive
                  ? [scaleBase * aspect * 1.15, scaleBase * 1.15, 1]
                  : [scaleBase * aspect, scaleBase, 1]
              }
              onPointerOver={(e) => {
                e.stopPropagation();
                setActiveSkillName(skill.name);
              }}
              onPointerOut={() => setActiveSkillName(null)}
            >
              <spriteMaterial
                map={pillTex}
                transparent
                depthWrite={false}
              />
            </sprite>
          </group>
        );
      })}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 3. MAIN COMPONENT: INTERACTIVE 3D SKILL TOOLKIT SPHERE
// Smooth mouse/touch drag, natural momentum inertia, and idle auto-rotation
// ---------------------------------------------------------------------------
export default function SkillToolkitSphere3D({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Physics rotation & momentum tracking
  const rotationState = useRef({ x: 0.15, y: -0.3 });
  const velocityRef = useRef({ x: 0, y: 0.004 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const lastInteractionTimeRef = useRef(performance.now());

  const [activeSkillName, setActiveSkillName] = useState<string | null>(null);

  // Smooth animation frame loop for momentum & idle rotation recovery
  useEffect(() => {
    let animId: number;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const loop = () => {
      if (!isDraggingRef.current) {
        if (!reducedMotion) {
          rotationState.current.x += velocityRef.current.x;
          rotationState.current.y += velocityRef.current.y;
        }

        // Natural friction damping
        velocityRef.current.x *= 0.94;
        velocityRef.current.y *= 0.94;

        // Smooth recovery to idle rotation
        if (!reducedMotion && Math.abs(velocityRef.current.y) < 0.004) {
          velocityRef.current.y += (0.004 - velocityRef.current.y) * 0.05;
        }
      }

      // Clamp vertical tilt to keep sphere in natural viewing angle
      rotationState.current.x = Math.max(-1.15, Math.min(1.15, rotationState.current.x));

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Universal pointer handlers for desktop mouse and mobile touch
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    velocityRef.current = { x: 0, y: 0 };
    lastInteractionTimeRef.current = performance.now();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    dragStartRef.current = { x: e.clientX, y: e.clientY };

    const sensitivity = 0.005;
    const deltaY = dx * sensitivity;
    const deltaX = dy * sensitivity;

    rotationState.current.y += deltaY;
    rotationState.current.x += deltaX;

    velocityRef.current = {
      x: deltaX,
      y: deltaY,
    };

    lastInteractionTimeRef.current = performance.now();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full select-none overflow-hidden touch-none ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      role="region"
      aria-label="Interactive 3D Toolkit Skills Sphere"
    >
      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 0, 7.2], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.9} color="#94A3B8" />
        <directionalLight position={[5, 8, 6]} intensity={1.5} color="#FFFFFF" />
        <directionalLight position={[-6, -4, -4]} intensity={1.2} color="#00F0FF" />

        <SphereToolkitScene
          rotationState={rotationState}
          activeSkillName={activeSkillName}
          setActiveSkillName={setActiveSkillName}
        />
      </Canvas>

      {/* Floating HUD Badges matching Reference Website */}
      <div className="absolute bottom-3 left-4 z-10 pointer-events-none flex items-center gap-2">
        <div className="px-3.5 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 text-cyan-300 font-mono text-[11px] flex items-center gap-2 shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>Interactive 3D Sphere &bull; My Toolkit</span>
        </div>
      </div>

      <div className="absolute top-3 right-4 z-10 pointer-events-none">
        <div className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/10 text-slate-400 font-mono text-[10px] flex items-center gap-1.5">
          <span className="text-cyan-400">❖</span>
          <span>Drag sphere to spin</span>
        </div>
      </div>
    </div>
  );
}


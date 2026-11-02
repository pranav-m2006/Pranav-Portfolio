import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ---------------------------------------------------------------------------
// 1. DATA DEFINITIONS FOR THE 12 SKILLS & CONTINENT POINT PROJECTIONS
// ---------------------------------------------------------------------------
export interface SkillNodeData {
  id: string;
  name: string;
  category: string;
  iconType: string;
  color: string;
  accentBg: string;
  // Spherical coordinates on globe (latitude [-90, 90], longitude [-180, 180])
  lat: number;
  lon: number;
  // Target position on 2D screen perimeter layout (percent [0..100])
  side: 'left' | 'right';
  badgeYPercent: number; // Vertical position percentage along the column
}

export const SKILL_NODES: SkillNodeData[] = [
  // LEFT COLUMN (5 skills)
  {
    id: 'ai-dev',
    name: 'AI Development',
    category: 'Applied AI',
    iconType: 'brain',
    color: '#C084FC', // Purple
    accentBg: 'rgba(192, 132, 252, 0.15)',
    lat: 38,
    lon: -65,
    side: 'left',
    badgeYPercent: 14,
  },
  {
    id: 'ml',
    name: 'Machine Learning',
    category: 'Analytics & Models',
    iconType: 'chart',
    color: '#38BDF8', // Sky Blue
    accentBg: 'rgba(56, 189, 248, 0.15)',
    lat: 14,
    lon: -48,
    side: 'left',
    badgeYPercent: 30,
  },
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    category: 'Core CS',
    iconType: 'brackets',
    color: '#A855F7', // Violet
    accentBg: 'rgba(168, 85, 247, 0.15)',
    lat: -12,
    lon: -70,
    side: 'left',
    badgeYPercent: 48,
  },
  {
    id: 'git',
    name: 'Git & GitHub',
    category: 'Tooling',
    iconType: 'git',
    color: '#F1F5F9', // Clean White/Silver
    accentBg: 'rgba(241, 245, 249, 0.15)',
    lat: -36,
    lon: -42,
    side: 'left',
    badgeYPercent: 66,
  },
  {
    id: 'python',
    name: 'Python',
    category: 'Language / AI',
    iconType: 'python',
    color: '#38BDF8', // Python Blue/Yellow
    accentBg: 'rgba(56, 189, 248, 0.15)',
    lat: -54,
    lon: -18,
    side: 'left',
    badgeYPercent: 84,
  },

  // RIGHT COLUMN & PERIMETER (7 skills)
  {
    id: 'java',
    name: 'Java',
    category: 'Language',
    iconType: 'coffee',
    color: '#FB923C', // Orange/Coffee
    accentBg: 'rgba(251, 146, 60, 0.15)',
    lat: 56,
    lon: 25,
    side: 'right',
    badgeYPercent: 12,
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'Frontend & Web',
    iconType: 'js',
    color: '#FACC15', // JS Yellow
    accentBg: 'rgba(250, 204, 21, 0.15)',
    lat: 42,
    lon: 60,
    side: 'right',
    badgeYPercent: 24,
  },
  {
    id: 'react',
    name: 'React',
    category: 'UI Framework',
    iconType: 'react',
    color: '#00F0FF', // Cyan Atom
    accentBg: 'rgba(0, 240, 255, 0.15)',
    lat: 22,
    lon: 48,
    side: 'right',
    badgeYPercent: 36,
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'Backend Runtime',
    iconType: 'node',
    color: '#4ADE80', // Green Hexagon
    accentBg: 'rgba(74, 222, 128, 0.15)',
    lat: 4,
    lon: 76,
    side: 'right',
    badgeYPercent: 49,
  },
  {
    id: 'html',
    name: 'HTML',
    category: 'Web Core',
    iconType: 'html',
    color: '#F97316', // HTML5 Orange
    accentBg: 'rgba(249, 115, 22, 0.15)',
    lat: -16,
    lon: 55,
    side: 'right',
    badgeYPercent: 62,
  },
  {
    id: 'css',
    name: 'CSS',
    category: 'Styling & Motion',
    iconType: 'css',
    color: '#60A5FA', // CSS Blue
    accentBg: 'rgba(96, 165, 250, 0.15)',
    lat: -34,
    lon: 72,
    side: 'right',
    badgeYPercent: 74,
  },
  {
    id: 'sql',
    name: 'SQL',
    category: 'Database Systems',
    iconType: 'database',
    color: '#38BDF8', // Database Cyan/Blue
    accentBg: 'rgba(56, 189, 248, 0.15)',
    lat: -52,
    lon: 30,
    side: 'right',
    badgeYPercent: 88,
  },
];

// Helper to convert lat/lon to 3D Cartesian coordinates on sphere of radius R
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Procedural geographic continent test for realistic landmass dot distributions
function isContinentLand(lat: number, lon: number): boolean {
  // North America
  if (lat >= 15 && lat <= 72 && lon >= -168 && lon <= -52) {
    if (lat < 30 && lon > -80) return false;
    return true;
  }
  // South America
  if (lat >= -56 && lat <= 13 && lon >= -82 && lon <= -34) {
    if (lat < -40 && lon > -60) return false;
    return true;
  }
  // Europe
  if (lat >= 35 && lat <= 71 && lon >= -10 && lon <= 45) {
    return true;
  }
  // Africa
  if (lat >= -35 && lat <= 38 && lon >= -18 && lon <= 52) {
    if (lat > 20 && lon < -12) return false;
    return true;
  }
  // Asia
  if (lat >= 8 && lat <= 76 && lon >= 45 && lon <= 150) {
    if (lat < 22 && lon < 65) return false;
    return true;
  }
  // Australia / Oceania
  if (lat >= -44 && lat <= -10 && lon >= 112 && lon <= 154) {
    return true;
  }
  // Antarctica subtle ring
  if (lat <= -68) {
    return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// 2. CONTINENT FIBONACCI POINT CLOUD (EARTH LANDMASSES + OCEANS)
// ---------------------------------------------------------------------------
function GlobePointCloud({ radius = 1.62 }: { radius?: number }) {
  const count = 2800;

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const s = new Float32Array(count);

    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < count; i++) {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);

      const lat = 90 - (phi * 180) / Math.PI;
      const lon = ((theta * 180) / Math.PI) % 360 - 180;

      const isLand = isContinentLand(lat, lon);

      // Micro-jitter for organic geographic feel
      const r = isLand ? radius + (Math.sin(i * 12.3) * 0.008) : radius - 0.005;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      if (isLand) {
        // Vibrant glowing amber/gold and cyan landmass dots (matching reference image)
        const isWarmLand = i % 3 === 0;
        if (isWarmLand) {
          cols[i * 3] = 1.0; // R
          cols[i * 3 + 1] = 0.62; // G (Warm amber/orange)
          cols[i * 3 + 2] = 0.15; // B
        } else {
          cols[i * 3] = 0.0; // R
          cols[i * 3 + 1] = 0.94; // G (Electric cyan)
          cols[i * 3 + 2] = 1.0; // B
        }
        s[i] = 0.038 + (i % 4) * 0.008;
      } else {
        // Faint deep cosmic ocean dots
        cols[i * 3] = 0.06;
        cols[i * 3 + 1] = 0.16;
        cols[i * 3 + 2] = 0.32;
        s[i] = 0.016;
      }
    }

    return { positions: pos, colors: cols, sizes: s };
  }, [radius]);

  const pointTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(255, 200, 100, 0.9)');
    grad.addColorStop(0.65, 'rgba(0, 240, 255, 0.4)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        map={pointTexture}
        transparent
        opacity={0.92}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ---------------------------------------------------------------------------
// 3. LATITUDE & LONGITUDE GLOWING GRATICULE RINGS
// ---------------------------------------------------------------------------
function GlobeGraticule({ radius = 1.62 }: { radius?: number }) {
  const graticuleGroup = useMemo(() => {
    const group = new THREE.Group();
    const matCyan = new THREE.LineBasicMaterial({
      color: '#00F0FF',
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const matAmber = new THREE.LineBasicMaterial({
      color: '#FF9E2C',
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // Parallels (Latitudes)
    const latSteps = [-60, -30, 0, 30, 60];
    latSteps.forEach((lat) => {
      const pts: THREE.Vector3[] = [];
      const segs = 64;
      for (let i = 0; i <= segs; i++) {
        const lon = (i / segs) * 360 - 180;
        pts.push(latLonToVector3(lat, lon, radius));
      }
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(geom, lat === 0 ? matAmber : matCyan);
      group.add(line);
    });

    // Meridians (Longitudes)
    const lonSteps = [-120, -60, 0, 60, 120, 180];
    lonSteps.forEach((lon) => {
      const pts: THREE.Vector3[] = [];
      const segs = 48;
      for (let i = 0; i <= segs; i++) {
        const lat = (i / segs) * 180 - 90;
        pts.push(latLonToVector3(lat, lon, radius));
      }
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(geom, matCyan);
      group.add(line);
    });

    return group;
  }, [radius]);

  return <primitive object={graticuleGroup} />;
}

// ---------------------------------------------------------------------------
// 4. SURFACE CONNECTING ARCS / GREAT CIRCLES
// ---------------------------------------------------------------------------
function GlobeFlightArcs({ radius = 1.62 }: { radius?: number }) {
  const arcsGroup = useMemo(() => {
    const group = new THREE.Group();
    const arcPairs = [
      [SKILL_NODES[0], SKILL_NODES[7]], // AI Dev -> React
      [SKILL_NODES[1], SKILL_NODES[6]], // ML -> JS
      [SKILL_NODES[2], SKILL_NODES[8]], // DSA -> Node
      [SKILL_NODES[3], SKILL_NODES[9]], // Git -> HTML
      [SKILL_NODES[4], SKILL_NODES[11]], // Python -> SQL
      [SKILL_NODES[5], SKILL_NODES[0]], // Java -> AI Dev
      [SKILL_NODES[7], SKILL_NODES[1]], // React -> ML
      [SKILL_NODES[8], SKILL_NODES[4]], // Node -> Python
    ];

    arcPairs.forEach(([start, end], i) => {
      const vStart = latLonToVector3(start.lat, start.lon, radius);
      const vEnd = latLonToVector3(end.lat, end.lon, radius);

      const vMid = vStart.clone().add(vEnd).multiplyScalar(0.5);
      const dist = vStart.distanceTo(vEnd);
      const altitude = radius + dist * 0.18;
      vMid.normalize().multiplyScalar(altitude);

      const curve = new THREE.QuadraticBezierCurve3(vStart, vMid, vEnd);
      const points = curve.getPoints(32);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? '#FF8A00' : '#00F0FF',
        transparent: true,
        opacity: 0.32,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      group.add(new THREE.Line(geometry, material));
    });

    return group;
  }, [radius]);

  return <primitive object={arcsGroup} />;
}

// ---------------------------------------------------------------------------
// 5. RADIANT ORBITAL RINGS (INCLINED ELLIPTICAL TRACKS WITH SATELLITE BEADS)
// ---------------------------------------------------------------------------
function OrbitalRings() {
  const ring1BeadRef = useRef<THREE.Group>(null);
  const ring2BeadRef = useRef<THREE.Group>(null);
  const ring3BeadRef = useRef<THREE.Group>(null);

  const ring1Mesh = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, 2.35, 1.45, 0, 2 * Math.PI, false, 0);
    const pts = curve.getPoints(80).map((p) => new THREE.Vector3(p.x, p.y, 0));
    const geom = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({
      color: '#FFA726',
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    return new THREE.Line(geom, mat);
  }, []);

  const ring2Mesh = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, 2.5, 1.35, 0, 2 * Math.PI, false, 0);
    const pts = curve.getPoints(80).map((p) => new THREE.Vector3(p.x, p.y, 0));
    const geom = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({
      color: '#00F0FF',
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    return new THREE.Line(geom, mat);
  }, []);

  const ring3Mesh = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, 2.65, 1.55, 0, 2 * Math.PI, false, 0);
    const pts = curve.getPoints(80).map((p) => new THREE.Vector3(p.x, p.y, 0));
    const geom = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({
      color: '#C084FC',
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    return new THREE.Line(geom, mat);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (ring1BeadRef.current) {
      const angle = t * 0.9;
      ring1BeadRef.current.position.set(2.35 * Math.cos(angle), 1.45 * Math.sin(angle), 0);
    }
    if (ring2BeadRef.current) {
      const angle = -t * 0.75 + 1.5;
      ring2BeadRef.current.position.set(2.5 * Math.cos(angle), 1.35 * Math.sin(angle), 0);
    }
    if (ring3BeadRef.current) {
      const angle = t * 0.6 + 3.2;
      ring3BeadRef.current.position.set(2.65 * Math.cos(angle), 1.55 * Math.sin(angle), 0);
    }
  });

  return (
    <group>
      {/* Ring 1: Warm Amber / Gold inclined orbital track */}
      <group rotation={[0.42, 0.25, 0.62]}>
        <primitive object={ring1Mesh} />
        <group ref={ring1BeadRef}>
          <mesh>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshBasicMaterial color="#FFB74D" />
          </mesh>
          <pointLight color="#FFA726" intensity={1.8} distance={1.2} />
        </group>
      </group>

      {/* Ring 2: Radiant Cyan / Blue inclined track */}
      <group rotation={[-0.52, 0.38, -0.48]}>
        <primitive object={ring2Mesh} />
        <group ref={ring2BeadRef}>
          <mesh>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshBasicMaterial color="#E0F2FE" />
          </mesh>
          <pointLight color="#00F0FF" intensity={1.6} distance={1.2} />
        </group>
      </group>

      {/* Ring 3: Electric Violet / Amber inclined track */}
      <group rotation={[0.2, 0.82, -0.3]}>
        <primitive object={ring3Mesh} />
        <group ref={ring3BeadRef}>
          <mesh>
            <sphereGeometry args={[0.038, 16, 16]} />
            <meshBasicMaterial color="#F3E8FF" />
          </mesh>
          <pointLight color="#C084FC" intensity={1.4} distance={1.0} />
        </group>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 6. HOLOGRAPHIC PEDESTAL & CONCENTRIC BASE RINGS
// ---------------------------------------------------------------------------
function HolographicPedestal() {
  const baseRingsGroup = useMemo(() => {
    const group = new THREE.Group();
    const radii = [0.65, 1.1, 1.6, 2.15];
    radii.forEach((r, idx) => {
      const curve = new THREE.EllipseCurve(0, 0, r, r * 0.45, 0, 2 * Math.PI, false, 0);
      const pts = curve.getPoints(64).map((p) => new THREE.Vector3(p.x, 0, p.y));
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: idx % 2 === 0 ? '#FF9500' : '#00F0FF',
        transparent: true,
        opacity: 0.5 - idx * 0.08,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      group.add(new THREE.Line(geom, mat));
    });
    return group;
  }, []);

  return (
    <group position={[0, -1.82, 0]}>
      {/* Concentric Holographic Ground Rings */}
      <primitive object={baseRingsGroup} />

      {/* Vertical Holographic Light Emitter Cone */}
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.9, 0.25, 0.95, 32, 1, true]} />
        <meshBasicMaterial
          color="#FF9500"
          transparent
          opacity={0.16}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Central Base Glow Core */}
      <pointLight position={[0, 0.2, 0]} color="#FF9500" intensity={2.2} distance={2.8} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// 7. GLOWING 3D SKILL SURFACE NODES
// ---------------------------------------------------------------------------
function GlobeSkillNodes({
  activeSkillId,
  onNodeHover,
  radius = 1.62,
}: {
  activeSkillId: string | null;
  onNodeHover: (id: string | null) => void;
  radius?: number;
}) {
  return (
    <group>
      {SKILL_NODES.map((skill) => {
        const pos = latLonToVector3(skill.lat, skill.lon, radius);
        const isActive = activeSkillId === skill.id;

        return (
          <group
            key={skill.id}
            position={pos}
            onPointerOver={(e) => {
              e.stopPropagation();
              onNodeHover(skill.id);
            }}
            onPointerOut={() => onNodeHover(null)}
          >
            {/* Outer Pulsing Halo */}
            <mesh>
              <sphereGeometry args={[isActive ? 0.095 : 0.065, 16, 16]} />
              <meshBasicMaterial
                color={isActive ? '#FFFFFF' : skill.color}
                transparent
                opacity={isActive ? 0.95 : 0.65}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>

            {/* Inner Core Bead */}
            <mesh>
              <sphereGeometry args={[isActive ? 0.05 : 0.035, 16, 16]} />
              <meshBasicMaterial color={isActive ? '#FFFFFF' : skill.color} />
            </mesh>

            {/* Point Light on active node */}
            {isActive && <pointLight color={skill.color} intensity={2.5} distance={1.2} />}
          </group>
        );
      })}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 8. 3D SCENE ROOT & SCREEN PROJECTOR CONTROLLER
// ---------------------------------------------------------------------------
function GlobeScene({
  rotationState,
  activeSkillId,
  setActiveSkillId,
  onProjectCoordinates,
}: {
  rotationState: React.MutableRefObject<{ x: number; y: number }>;
  activeSkillId: string | null;
  setActiveSkillId: (id: string | null) => void;
  onProjectCoordinates: (coords: Record<string, { x: number; y: number; z: number }>) => void;
}) {
  const globeGroupRef = useRef<THREE.Group>(null);
  const { camera, size } = useThree();

  const tempVec = useMemo(() => new THREE.Vector3(), []);
  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);

  useFrame(() => {
    if (globeGroupRef.current) {
      globeGroupRef.current.rotation.x = rotationState.current.x;
      globeGroupRef.current.rotation.y = rotationState.current.y;

      globeGroupRef.current.updateMatrixWorld();
      tempMatrix.copy(globeGroupRef.current.matrixWorld);

      const projected: Record<string, { x: number; y: number; z: number }> = {};

      SKILL_NODES.forEach((skill) => {
        const localPos = latLonToVector3(skill.lat, skill.lon, 1.62);
        tempVec.copy(localPos).applyMatrix4(tempMatrix);

        const depthZ = tempVec.z;

        tempVec.project(camera);

        const screenX = ((tempVec.x + 1) / 2) * size.width;
        const screenY = ((-tempVec.y + 1) / 2) * size.height;

        projected[skill.id] = {
          x: screenX,
          y: screenY,
          z: depthZ,
        };
      });

      onProjectCoordinates(projected);
    }
  });

  return (
    <group position={[0, 0.15, 0]}>
      {/* 3D Rotating Globe Body */}
      <group ref={globeGroupRef}>
        {/* Core Dark Glass Sphere */}
        <mesh>
          <sphereGeometry args={[1.6, 48, 48]} />
          <meshStandardMaterial
            color="#050812"
            roughness={0.75}
            metalness={0.3}
            transparent
            opacity={0.92}
          />
        </mesh>

        {/* Outer Atmospheric Translucent Rim Shell */}
        <mesh>
          <sphereGeometry args={[1.63, 32, 32]} />
          <meshBasicMaterial
            color="#00F0FF"
            transparent
            opacity={0.06}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Fibonacci Landmass Point Cloud */}
        <GlobePointCloud radius={1.62} />

        {/* Latitude and Longitude Graticule Lines */}
        <GlobeGraticule radius={1.62} />

        {/* Great Circle Flight Arcs */}
        <GlobeFlightArcs radius={1.62} />

        {/* Glowing Skill Surface Nodes */}
        <GlobeSkillNodes
          activeSkillId={activeSkillId}
          onNodeHover={setActiveSkillId}
          radius={1.62}
        />
      </group>

      {/* Dynamic Inclined Orbital Rings */}
      <OrbitalRings />

      {/* Holographic Projector Pedestal Base at Bottom */}
      <HolographicPedestal />
    </group>
  );
}

// ---------------------------------------------------------------------------
// 9. BRANDED SKILL BADGE ICONS (PURE INLINE SVG & CRISP GLYPHS)
// ---------------------------------------------------------------------------
function SkillIcon({ type, color }: { type: string; color: string }) {
  switch (type) {
    case 'coffee': // Java
      return (
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
          <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
          <line x1="6" x2="6" y1="2" y2="4" />
          <line x1="10" x2="10" y1="2" y2="4" />
          <line x1="14" x2="14" y1="2" y2="4" />
        </svg>
      );
    case 'js': // JavaScript
      return (
        <div
          className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[3px] flex items-center justify-center font-bold text-[8px] sm:text-[9px] leading-none"
          style={{ backgroundColor: color, color: '#000000' }}
        >
          JS
        </div>
      );
    case 'react': // React Atom
      return (
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(0 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="2" fill={color} />
        </svg>
      );
    case 'node': // Node.js
      return (
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" />
          <path d="M12 12l8-4.5" />
          <path d="M12 12v8" />
          <path d="M12 12L4 7.5" />
        </svg>
      );
    case 'html': // HTML5
      return (
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 3h16l-1.5 16-6.5 2-6.5-2L4 3z" />
          <path d="M8 8h8l-.5 4.5H9" />
          <path d="M9 15.5l3 .8 3-.8.2-2" />
        </svg>
      );
    case 'css': // CSS3
      return (
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 3h16l-1.5 16-6.5 2-6.5-2L4 3z" />
          <path d="M16 8H8l.4 4H15l-.5 4.5-2.5.7-2.5-.7-.2-2" />
        </svg>
      );
    case 'python': // Python
      return (
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a6 6 0 0 0-6 6v2h6v2H5a5 5 0 0 0-5 5 5 5 0 0 0 5 5h2v-3a3 3 0 0 1 3-3h4a3 3 0 0 0 3-3V8a6 6 0 0 0-6-6z" />
          <circle cx="9" cy="5" r="1" fill={color} />
          <circle cx="15" cy="19" r="1" fill={color} />
        </svg>
      );
    case 'database': // SQL
      return (
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
          <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
        </svg>
      );
    case 'git': // Git & GitHub
      return (
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="18" r="3" />
          <circle cx="6" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <path d="M18 9a9 9 0 0 1-9 9" />
          <line x1="6" x2="6" y1="9" y2="15" />
        </svg>
      );
    case 'brackets': // Data Structures & Algorithms
      return (
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case 'chart': // Machine Learning
      return (
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" x2="18" y1="20" y2="10" />
          <line x1="12" x2="12" y1="20" y2="4" />
          <line x1="6" x2="6" y1="20" y2="14" />
        </svg>
      );
    case 'brain': // AI Development
    default:
      return (
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1-4 4 4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z" />
          <path d="M6 13a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4" />
          <line x1="12" x2="12" y1="17" y2="22" />
        </svg>
      );
  }
}

// ---------------------------------------------------------------------------
// 10. MAIN EXPORT: INTERACTIVE 3D SKILL GLOBE COMPONENT
// ---------------------------------------------------------------------------
export default function SkillGlobe3D({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Rotation & Momentum Physics state
  const rotationState = useRef({ x: 0.15, y: -0.4 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const lastInteractionTimeRef = useRef(performance.now());

  // Interactive node projection state
  const [projectedCoords, setProjectedCoords] = useState<Record<string, { x: number; y: number; z: number }>>({});
  const [activeSkillId, setActiveSkillId] = useState<string | null>(null);

  // Container dimensions for responsive SVG lines
  const [containerSize, setContainerSize] = useState({ width: 600, height: 600 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Frame Loop for physics momentum & auto-rotation
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (!isDraggingRef.current) {
        // Apply friction to user drag momentum
        rotationState.current.x += velocityRef.current.x;
        rotationState.current.y += velocityRef.current.y;
        velocityRef.current.x *= 0.92;
        velocityRef.current.y *= 0.92;

        // Resume gradual auto-rotation after 1.2s of inactivity
        const timeSinceInteraction = (now - lastInteractionTimeRef.current) / 1000;
        if (timeSinceInteraction > 1.2) {
          const autoSpeed = 0.28; // Radians per second
          rotationState.current.y += autoSpeed * dt;

          // Smoothly restore pleasant resting pitch angle
          rotationState.current.x = THREE.MathUtils.lerp(rotationState.current.x, 0.15, 0.03);
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Pointer drag event handlers for mouse & touch
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

    const sensitivity = 0.0055;
    rotationState.current.y += dx * sensitivity;
    rotationState.current.x += dy * sensitivity;

    // Clamp vertical tilt to avoid polar flipping
    rotationState.current.x = Math.max(-0.85, Math.min(0.85, rotationState.current.x));

    velocityRef.current = {
      x: dy * 0.003,
      y: dx * 0.003,
    };

    lastInteractionTimeRef.current = performance.now();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  // Helper to compute badge anchor coordinates
  const getBadgeAnchor = useCallback(
    (skill: SkillNodeData) => {
      const isMobile = containerSize.width < 560;
      const xInset = isMobile ? (skill.side === 'left' ? 6 : containerSize.width - 6) : (skill.side === 'left' ? 12 : containerSize.width - 12);
      const y = (skill.badgeYPercent / 100) * containerSize.height;
      return { x: xInset, y };
    },
    [containerSize]
  );

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full select-none overflow-hidden touch-none ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      role="region"
      aria-label="Interactive 3D Skill Globe"
    >
      {/* 3D WebGL Canvas Layer */}
      <Canvas
        camera={{ position: [0, 0.15, 4.4], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.65} color="#94A3B8" />
        <directionalLight position={[6, 8, 4]} intensity={2.0} color="#FF9500" />
        <directionalLight position={[-6, -4, -4]} intensity={1.8} color="#00F0FF" />
        <pointLight position={[0, -2, 1]} intensity={1.5} color="#FF9500" />

        <GlobeScene
          rotationState={rotationState}
          activeSkillId={activeSkillId}
          setActiveSkillId={setActiveSkillId}
          onProjectCoordinates={setProjectedCoords}
        />
      </Canvas>

      {/* Dynamic SVG Leader Lines connecting 3D Globe Nodes to Floating Badges */}
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full z-10 overflow-visible"
        style={{ width: containerSize.width, height: containerSize.height }}
      >
        <defs>
          <linearGradient id="lineGradCyan" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="lineGradAmber" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF9500" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {SKILL_NODES.map((skill) => {
          const nodeCoord = projectedCoords[skill.id];
          if (!nodeCoord) return null;

          const badge = getBadgeAnchor(skill);
          const isFront = nodeCoord.z > -0.2;
          const isActive = activeSkillId === skill.id;

          // Depth-aware opacity (front nodes bright, back nodes subtle)
          const baseOpacity = isFront ? 0.75 : 0.22;
          const opacity = isActive ? 1.0 : baseOpacity;

          // Inflection elbow point for crisp angled callout line (as in reference image)
          const elbowX = skill.side === 'left' ? badge.x + 55 : badge.x - 55;
          const elbowY = badge.y;

          // Path: Node -> Elbow -> Badge
          const pathD = `M ${nodeCoord.x} ${nodeCoord.y} L ${elbowX} ${elbowY} L ${badge.x} ${badge.y}`;

          return (
            <g key={skill.id} className="transition-opacity duration-300">
              {/* Leader Line */}
              <path
                d={pathD}
                fill="none"
                stroke={isActive ? '#FFFFFF' : skill.color}
                strokeWidth={isActive ? 2 : 1}
                strokeOpacity={opacity}
                strokeDasharray={isActive ? '4 2' : 'none'}
              />

              {/* Glowing anchor dot at node position on globe */}
              <circle
                cx={nodeCoord.x}
                cy={nodeCoord.y}
                r={isActive ? 5.5 : 3.5}
                fill={isActive ? '#FFFFFF' : skill.color}
                fillOpacity={opacity}
              />
              {isActive && (
                <circle
                  cx={nodeCoord.x}
                  cy={nodeCoord.y}
                  r={9}
                  fill="none"
                  stroke={skill.color}
                  strokeWidth="1.5"
                  className="animate-ping"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Floating Interactive Skill Badges (HTML Overlay matching Reference Design) */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {SKILL_NODES.map((skill) => {
          const isActive = activeSkillId === skill.id;
          const isLeft = skill.side === 'left';

          return (
            <div
              key={skill.id}
              className={`absolute pointer-events-auto transition-all duration-300 transform -translate-y-1/2 ${
                isLeft ? 'left-2 sm:left-4' : 'right-2 sm:right-4'
              }`}
              style={{ top: `${skill.badgeYPercent}%` }}
              onMouseEnter={() => setActiveSkillId(skill.id)}
              onMouseLeave={() => setActiveSkillId(null)}
              onClick={() => setActiveSkillId(activeSkillId === skill.id ? null : skill.id)}
            >
              <div
                className={`group flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border backdrop-blur-md transition-all duration-200 cursor-pointer shadow-lg ${
                  isActive
                    ? 'scale-105 bg-slate-900/95 border-cyan-400 text-white shadow-[0_0_20px_rgba(0,240,255,0.35)]'
                    : 'bg-slate-950/80 hover:bg-slate-900/90 border-white/[0.12] hover:border-white/30 text-slate-200'
                }`}
                style={{
                  boxShadow: isActive ? `0 0 22px ${skill.color}55` : undefined,
                  borderColor: isActive ? skill.color : undefined,
                }}
              >
                {/* Skill Icon */}
                <div
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-md sm:rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: skill.accentBg }}
                >
                  <SkillIcon type={skill.iconType} color={skill.color} />
                </div>

                {/* Skill Title */}
                <span className="font-sans font-medium text-[10px] sm:text-xs tracking-tight whitespace-nowrap">
                  {skill.name}
                </span>

                {/* Subtle Active Indicator Dot */}
                {isActive && (
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse ml-0.5"
                    style={{ backgroundColor: skill.color }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating HUD status badges */}
      <div className="absolute bottom-3 left-4 z-20 pointer-events-none flex items-center gap-2">
        <div className="px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 text-cyan-300 font-mono text-[10px] sm:text-[11px] flex items-center gap-2 shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>Interactive 3D Skill Globe</span>
        </div>
      </div>

      <div className="absolute top-3 right-4 z-20 pointer-events-none">
        <div className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/10 text-slate-400 font-mono text-[10px] flex items-center gap-1.5">
          <span className="text-cyan-400">❖</span>
          <span>Drag to Rotate</span>
        </div>
      </div>
    </div>
  );
}

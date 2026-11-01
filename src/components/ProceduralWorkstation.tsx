import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Create a realistic dynamic canvas texture representing a futuristic developer IDE & Terminal
function createScreenTexture(): { texture: THREE.CanvasTexture; update: (time: number) => void } {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 576; // 16:9 aspect ratio
  const ctx = canvas.getContext('2d')!;

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  let lastBlink = 0;
  let cursorVisible = true;

  const update = (time: number) => {
    if (time - lastBlink > 0.45) {
      cursorVisible = !cursorVisible;
      lastBlink = time;
    }

    // Background - Dark Cyber IDE surface
    ctx.fillStyle = '#050811';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Top Title Bar
    ctx.fillStyle = '#0A101D';
    ctx.fillRect(0, 0, canvas.width, 48);

    // Window Dots
    ctx.beginPath();
    ctx.arc(28, 24, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#EF4444';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(52, 24, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#F59E0B';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(76, 24, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#10B981';
    ctx.fill();

    // Tab Title
    ctx.font = '600 16px "JetBrains Mono", monospace';
    ctx.fillStyle = '#00F0FF';
    ctx.fillText('PranavM.tsx — AI Workstation', 115, 30);

    ctx.font = '14px "JetBrains Mono", monospace';
    ctx.fillStyle = '#64748B';
    ctx.fillText('Git: main* (verified)', 480, 30);

    ctx.fillStyle = '#10B981';
    ctx.fillText('● SYSTEM ONLINE [60 FPS]', 810, 30);

    // Left Sidebar
    ctx.fillStyle = '#070C16';
    ctx.fillRect(0, 48, 160, canvas.height - 48);

    ctx.font = '700 13px "JetBrains Mono", monospace';
    ctx.fillStyle = '#475569';
    ctx.fillText('EXPLORER', 20, 78);

    const files = [
      { name: '▾ src', color: '#94A3B8' },
      { name: '  ▾ components', color: '#94A3B8' },
      { name: '    Workstation.tsx', color: '#00F0FF' },
      { name: '    SpaceEnv.tsx', color: '#38BDF8' },
      { name: '  ▾ ai-models', color: '#94A3B8' },
      { name: '    SkillTwin.py', color: '#A855F7' },
      { name: '    DisasterML.py', color: '#38BDF8' },
      { name: '  ▾ portfolio', color: '#94A3B8' },
      { name: '    App.tsx', color: '#E2E8F0' },
    ];

    files.forEach((file, idx) => {
      ctx.font = '13px "JetBrains Mono", monospace';
      ctx.fillStyle = file.color;
      ctx.fillText(file.name, 20, 110 + idx * 24);
    });

    // Main Code Editor Area
    ctx.font = '500 15px "JetBrains Mono", monospace';
    const codeLines = [
      { text: 'import { Developer, AI_Practitioner } from "@core/profile";', color: '#8B5CF6' },
      { text: 'import { SpaceEnvironment, Workstation } from "@space/runtime";', color: '#8B5CF6' },
      { text: '', color: '#fff' },
      { text: 'export async function initWorkstation(): Promise<Portfolio> {', color: '#00F0FF' },
      { text: '  const developer = new Developer({', color: '#F1F5F9' },
      { text: '    name: "Pranav M.",', color: '#38BDF8' },
      { text: '    role: "Frontend Developer & AI/ML Practitioner",', color: '#38BDF8' },
      { text: '    education: "SNS College of Engineering (CGPA 8.00)",', color: '#10B981' },
      { text: '    verifiedWork: ["AI Skill Twin", "Disaster Management"],', color: '#FCD34D' },
      { text: '  });', color: '#F1F5F9' },
      { text: '', color: '#fff' },
      { text: '  await developer.synthesizeInterface({ spaceTheme: true, fps: 60 });', color: '#38BDF8' },
      { text: '  return developer.deploy();', color: '#A855F7' },
      { text: '}', color: '#00F0FF' },
    ];

    codeLines.forEach((line, idx) => {
      ctx.fillStyle = line.color;
      ctx.fillText(line.text, 185, 90 + idx * 22);
    });

    // Bottom Embedded Terminal Panel
    ctx.fillStyle = '#03050B';
    ctx.fillRect(160, 420, canvas.width - 160, 156);
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(160, 420, canvas.width - 160, 2);

    ctx.font = '700 12px "JetBrains Mono", monospace';
    ctx.fillStyle = '#64748B';
    ctx.fillText('TERMINAL // zsh', 185, 442);

    ctx.font = '13px "JetBrains Mono", monospace';
    ctx.fillStyle = '#10B981';
    ctx.fillText('➜ pranav@space-station:~$ npm run deploy:production', 185, 470);

    ctx.fillStyle = '#94A3B8';
    ctx.fillText('✔ Compiled 6 sections: Home, About, Skills, Projects, Honors, Contact', 185, 494);
    ctx.fillStyle = '#00F0FF';
    ctx.fillText('✔ 3D Space & Workstation engine initialized. 0 errors detected.', 185, 516);

    ctx.fillStyle = '#F1F5F9';
    ctx.fillText(`➜ pranav@space-station:~$ ${cursorVisible ? '█' : ' '}`, 185, 542);

    texture.needsUpdate = true;
  };

  return { texture, update };
}

export default function ProceduralWorkstation() {
  const rootGroupRef = useRef<THREE.Group>(null);
  const monitorGroupRef = useRef<THREE.Group>(null);
  const orbitalRingRef = useRef<THREE.Group>(null);
  const screenLightRef = useRef<THREE.PointLight>(null);
  const holoLeftRef = useRef<THREE.Group>(null);
  const holoRightRef = useRef<THREE.Group>(null);
  const energyParticlesRef = useRef<THREE.Points>(null);

  const [leftHoloHovered, setLeftHoloHovered] = useState(false);
  const [rightHoloHovered, setRightHoloHovered] = useState(false);

  const { texture: screenTexture, update: updateScreen } = useMemo(() => createScreenTexture(), []);

  // Standard PBR Materials
  const darkChassis = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#080D18',
        roughness: 0.25,
        metalness: 0.85,
      }),
    []
  );

  const darkDeskMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#050912',
        roughness: 0.35,
        metalness: 0.8,
      }),
    []
  );

  const chromeMetal = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#475569',
        roughness: 0.15,
        metalness: 0.95,
      }),
    []
  );

  const cyanEmissive = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#00F0FF',
        emissive: '#00F0FF',
        emissiveIntensity: 2.2,
      }),
    []
  );

  const violetEmissive = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#8B5CF6',
        emissive: '#8B5CF6',
        emissiveIntensity: 1.8,
      }),
    []
  );

  const screenMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: screenTexture,
        roughness: 0.2,
        metalness: 0.1,
        emissive: '#00F0FF',
        emissiveIntensity: 0.28,
      }),
    [screenTexture]
  );

  const holoGlassMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#00F0FF',
        transparent: true,
        opacity: 0.28,
        roughness: 0.1,
        metalness: 0.9,
        side: THREE.DoubleSide,
      }),
    []
  );

  // Smooth scroll handler on holographic panel click
  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 80;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navOffset;

      if ((window as any).__lenis) {
        (window as any).__lenis.scrollTo(offsetPosition, { duration: 1.2 });
      } else {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const pointer = state.pointer;

    // 1. Dynamic screen terminal animation
    updateScreen(t);

    // 2. Cursor distance calculation
    const pointerDist = Math.sqrt(pointer.x * pointer.x + pointer.y * pointer.y);
    const proximity = Math.max(0, 1 - pointerDist * 0.7);

    // 3. Root gentle floating bob and mouse sway
    if (rootGroupRef.current) {
      rootGroupRef.current.position.y = Math.sin(t * 1.5) * 0.08 - 0.15;
      rootGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        rootGroupRef.current.rotation.y,
        pointer.x * 0.28,
        0.05
      );
      rootGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        rootGroupRef.current.rotation.x,
        -pointer.y * 0.18 + 0.14,
        0.05
      );
    }

    // 4. Monitor subtle independent responsive tilt
    if (monitorGroupRef.current) {
      monitorGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        monitorGroupRef.current.rotation.y,
        pointer.x * 0.14,
        0.06
      );
    }

    // 5. Dynamic screen lighting reacting to cursor proximity
    if (screenLightRef.current) {
      screenLightRef.current.intensity = 1.5 + proximity * 0.8 + Math.sin(t * 2.5) * 0.2;
    }

    // 6. Orbital tech ring rotation
    if (orbitalRingRef.current) {
      orbitalRingRef.current.rotation.z = t * 0.25;
      orbitalRingRef.current.rotation.x = 1.1 + Math.sin(t * 0.4) * 0.08;
    }

    // 7. Floating holographic panels gentle drift & hover response
    if (holoLeftRef.current) {
      const hoverScale = leftHoloHovered ? 1.12 : 1.0;
      holoLeftRef.current.scale.lerp(new THREE.Vector3(hoverScale, hoverScale, hoverScale), 0.1);
      holoLeftRef.current.position.y = 1.1 + Math.sin(t * 2.0) * 0.05;
      holoLeftRef.current.rotation.y = 0.35 + Math.cos(t * 1.2) * 0.05;
    }
    if (holoRightRef.current) {
      const hoverScale = rightHoloHovered ? 1.12 : 1.0;
      holoRightRef.current.scale.lerp(new THREE.Vector3(hoverScale, hoverScale, hoverScale), 0.1);
      holoRightRef.current.position.y = 0.9 + Math.cos(t * 1.8) * 0.05;
      holoRightRef.current.rotation.y = -0.38 + Math.sin(t * 1.4) * 0.05;
    }

    // 8. Energy particles rotation
    if (energyParticlesRef.current) {
      energyParticlesRef.current.rotation.y = t * 0.2;
    }
  });

  return (
    <group ref={rootGroupRef} position={[0, -0.2, 0]}>
      {/* -------------------- FLOATING DESK PLATFORM -------------------- */}
      <group position={[0, -0.8, 0]}>
        {/* Main Carbon Desk Surface */}
        <mesh material={darkDeskMat} receiveShadow castShadow>
          <boxGeometry args={[3.2, 0.08, 1.8]} />
        </mesh>

        {/* Chamfered Edge Trim */}
        <mesh position={[0, 0.045, 0.9]} material={cyanEmissive}>
          <boxGeometry args={[3.18, 0.015, 0.02]} />
        </mesh>
        <mesh position={[0, 0.045, -0.9]} material={violetEmissive}>
          <boxGeometry args={[3.18, 0.015, 0.02]} />
        </mesh>

        {/* Minimalist Desk Mat / Extended Mousepad */}
        <mesh position={[0, 0.045, 0.1]} material={darkChassis}>
          <boxGeometry args={[2.4, 0.012, 1.1]} />
        </mesh>
      </group>

      {/* -------------------- MONITOR & STAND -------------------- */}
      <group ref={monitorGroupRef} position={[0, 0.35, -0.2]}>
        {/* Curved Ultrawide Display Frame */}
        <mesh material={darkChassis} castShadow>
          <boxGeometry args={[2.5, 1.42, 0.1]} />
        </mesh>

        {/* Top/Back Accent RGB Strip */}
        <mesh position={[0, 0.72, -0.05]} material={cyanEmissive}>
          <boxGeometry args={[2.46, 0.02, 0.02]} />
        </mesh>

        {/* The Detailed Developer Screen */}
        <mesh position={[0, 0, 0.052]} material={screenMaterial}>
          <planeGeometry args={[2.42, 1.35]} />
        </mesh>

        {/* Screen Ambient Light projecting onto desk & keyboard */}
        <pointLight
          ref={screenLightRef}
          color="#00F0FF"
          intensity={1.8}
          distance={3.4}
          position={[0, 0, 0.6]}
        />

        {/* Monitor Articulated Stand */}
        <group position={[0, -0.7, -0.2]}>
          <mesh position={[0, 0.28, 0.05]} rotation={[-0.15, 0, 0]} material={chromeMetal}>
            <cylinderGeometry args={[0.07, 0.09, 0.7, 16]} />
          </mesh>
          <mesh position={[0, -0.08, 0.15]} material={darkChassis}>
            <boxGeometry args={[0.65, 0.03, 0.45]} />
          </mesh>
          <mesh position={[0, -0.065, 0.15]} material={cyanEmissive}>
            <boxGeometry args={[0.45, 0.008, 0.015]} />
          </mesh>
        </group>
      </group>

      {/* -------------------- MECHANICAL KEYBOARD -------------------- */}
      <group position={[0, -0.73, 0.32]}>
        <mesh rotation={[-0.08, 0, 0]} material={darkChassis} castShadow>
          <boxGeometry args={[1.3, 0.045, 0.48]} />
        </mesh>

        {/* Keycap Rows */}
        {[-0.15, -0.08, -0.01, 0.06, 0.13].map((zRow, rIdx) => (
          <group key={rIdx} position={[0, 0.03, zRow]}>
            {rIdx === 4 ? (
              <mesh position={[0, 0, 0]} material={chromeMetal}>
                <boxGeometry args={[0.55, 0.025, 0.06]} />
              </mesh>
            ) : (
              <mesh position={[0, 0, 0]} material={rIdx === 0 ? violetEmissive : chromeMetal}>
                <boxGeometry args={[1.2, 0.022, 0.05]} />
              </mesh>
            )}
          </group>
        ))}

        {/* Keyboard RGB Underglow */}
        <mesh position={[0, -0.015, 0.24]} material={cyanEmissive}>
          <boxGeometry args={[1.28, 0.01, 0.015]} />
        </mesh>
      </group>

      {/* -------------------- ERGONOMIC PRECISION MOUSE -------------------- */}
      <group position={[0.92, -0.74, 0.35]}>
        <mesh rotation={[0, -0.1, 0]} material={darkChassis}>
          <capsuleGeometry args={[0.07, 0.14, 8, 16]} />
        </mesh>
        <mesh position={[0, 0.05, -0.04]} material={cyanEmissive}>
          <boxGeometry args={[0.02, 0.025, 0.05]} />
        </mesh>
      </group>

      {/* -------------------- HOLOGRAPHIC INTERACTIVE PANELS -------------------- */}
      {/* Left Hologram Panel: Clickable to explore Skills */}
      <group
        ref={holoLeftRef}
        position={[-1.65, 0.85, 0.1]}
        onPointerOver={() => {
          setLeftHoloHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setLeftHoloHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={() => handleScrollTo('skills')}
      >
        <mesh material={holoGlassMaterial}>
          <planeGeometry args={[0.75, 0.9]} />
        </mesh>
        <mesh material={leftHoloHovered ? cyanEmissive : violetEmissive}>
          <ringGeometry args={[0.38, 0.395, 4]} />
        </mesh>
        <mesh position={[-0.2, 0.25, 0.01]} material={cyanEmissive}>
          <boxGeometry args={[0.25, 0.02, 0.01]} />
        </mesh>
        <mesh position={[-0.1, 0.1, 0.01]} material={cyanEmissive}>
          <boxGeometry args={[0.45, 0.02, 0.01]} />
        </mesh>
        <mesh position={[-0.15, -0.05, 0.01]} material={violetEmissive}>
          <boxGeometry args={[0.35, 0.02, 0.01]} />
        </mesh>
        <mesh position={[0, -0.2, 0.01]} material={cyanEmissive}>
          <boxGeometry args={[0.5, 0.02, 0.01]} />
        </mesh>
      </group>

      {/* Right Hologram Panel: Clickable to explore Projects */}
      <group
        ref={holoRightRef}
        position={[1.65, 0.75, 0.1]}
        onPointerOver={() => {
          setRightHoloHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setRightHoloHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={() => handleScrollTo('projects')}
      >
        <mesh material={holoGlassMaterial}>
          <planeGeometry args={[0.75, 0.85]} />
        </mesh>
        <mesh position={[0.1, 0.22, 0.01]} material={rightHoloHovered ? cyanEmissive : violetEmissive}>
          <boxGeometry args={[0.45, 0.02, 0.01]} />
        </mesh>
        <mesh position={[0, 0.06, 0.01]} material={cyanEmissive}>
          <boxGeometry args={[0.55, 0.02, 0.01]} />
        </mesh>
        <mesh position={[0.15, -0.1, 0.01]} material={cyanEmissive}>
          <boxGeometry args={[0.35, 0.02, 0.01]} />
        </mesh>
        <mesh position={[0, -0.22, 0.02]} material={rightHoloHovered ? cyanEmissive : violetEmissive}>
          <ringGeometry args={[0.12, 0.135, 24]} />
        </mesh>
      </group>

      {/* -------------------- ORBITAL DATA TECH RING -------------------- */}
      <group ref={orbitalRingRef} position={[0, 0.2, 0]}>
        <mesh material={cyanEmissive}>
          <torusGeometry args={[2.4, 0.012, 16, 90]} />
        </mesh>
        <mesh position={[2.4, 0, 0]} material={cyanEmissive}>
          <boxGeometry args={[0.08, 0.08, 0.08]} />
        </mesh>
        <mesh position={[-2.4, 0, 0]} material={violetEmissive}>
          <boxGeometry args={[0.08, 0.08, 0.08]} />
        </mesh>
      </group>

      {/* -------------------- FLOATING ENERGY PARTICLES -------------------- */}
      <points ref={energyParticlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={60}
            array={
              new Float32Array(
                Array.from({ length: 180 }, () => (Math.random() - 0.5) * 4.5)
              )
            }
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#00F0FF"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* -------------------- FLOATING CODE GLYPHS -------------------- */}
      {[
        { pos: [1.4, 1.4, 0.2], col: cyanEmissive, size: 0.05 },
        { pos: [-1.4, 1.3, -0.1], col: violetEmissive, size: 0.06 },
        { pos: [1.8, -0.4, 0.4], col: cyanEmissive, size: 0.04 },
        { pos: [-1.8, -0.3, 0.3], col: violetEmissive, size: 0.05 },
      ].map((glyph, gIdx) => (
        <mesh key={gIdx} position={glyph.pos as [number, number, number]} material={glyph.col}>
          <octahedronGeometry args={[glyph.size]} />
        </mesh>
      ))}
    </group>
  );
}

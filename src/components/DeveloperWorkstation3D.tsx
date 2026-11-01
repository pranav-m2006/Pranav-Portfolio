import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------------------
// HYPER-OPTIMIZED 2D CANVAS TEXTURE: ACTIVE DEVELOPER IDE & TERMINAL
// Redraws only on cursor blink / hover state changes (zero GPU memory thrashing)
// ---------------------------------------------------------------------------
function createScreenTexture(): {
  texture: THREE.CanvasTexture;
  update: (time: number, isHovered: boolean) => void;
} {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 576; // Exact 16:9 ratio
  const ctx = canvas.getContext('2d')!;

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  let lastBlink = 0;
  let cursorVisible = true;
  let prevHovered: boolean | null = null;
  let isInitialized = false;

  const renderFullIDE = (isHovered: boolean) => {
    // 1. Dark IDE Editor Surface
    ctx.fillStyle = '#050811';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Title Bar
    ctx.fillStyle = '#090F1E';
    ctx.fillRect(0, 0, canvas.width, 42);

    // Window Dots
    ctx.beginPath();
    ctx.arc(24, 21, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#EF4444';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(46, 21, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#F59E0B';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(68, 21, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#10B981';
    ctx.fill();

    // Editor Tab Header
    ctx.font = '600 15px "JetBrains Mono", monospace';
    ctx.fillStyle = '#00F0FF';
    ctx.fillText('PranavM.tsx — AI Workstation', 98, 27);

    ctx.font = '13px "JetBrains Mono", monospace';
    ctx.fillStyle = '#64748B';
    ctx.fillText('Git: main* (verified)', 480, 27);

    ctx.fillStyle = isHovered ? '#00F0FF' : '#10B981';
    ctx.fillText(isHovered ? '● LIVE COMPILING [60 FPS]' : '● SYSTEM ONLINE', 760, 27);

    // 3. File Tree Sidebar
    ctx.fillStyle = '#060B14';
    ctx.fillRect(0, 42, 145, canvas.height - 42);

    ctx.font = '700 12px "JetBrains Mono", monospace';
    ctx.fillStyle = '#475569';
    ctx.fillText('EXPLORER', 18, 68);

    const files = [
      { name: '▾ src', color: '#94A3B8' },
      { name: '  ▾ components', color: '#94A3B8' },
      { name: '    Developer.tsx', color: '#00F0FF' },
      { name: '    SpaceEnv.tsx', color: '#38BDF8' },
      { name: '  ▾ ai-models', color: '#94A3B8' },
      { name: '    SkillTwin.py', color: '#C084FC' },
      { name: '    DisasterML.py', color: '#38BDF8' },
      { name: '  ▾ portfolio', color: '#94A3B8' },
      { name: '    App.tsx', color: '#E2E8F0' },
    ];

    files.forEach((file, idx) => {
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillStyle = file.color;
      ctx.fillText(file.name, 18, 96 + idx * 22);
    });

    // 4. Main Code Editor Lines
    ctx.font = '500 14px "JetBrains Mono", monospace';
    const codeLines = [
      { text: 'import { Developer, AIPractitioner } from "@core/profile";', color: '#818CF8' },
      { text: 'import { SpaceEnvironment, Workstation } from "@space/runtime";', color: '#818CF8' },
      { text: '', color: '#fff' },
      { text: 'export async function runWorkstation(): Promise<Portfolio> {', color: '#00F0FF' },
      { text: '  const developer = new Developer({', color: '#F1F5F9' },
      { text: '    name: "Pranav M.",', color: '#38BDF8' },
      { text: '    role: "Frontend Developer | AI/ML Practitioner",', color: '#38BDF8' },
      { text: '    education: "SNS College of Engineering (CGPA 8.00)",', color: '#10B981' },
      { text: '    internships: ["Thrivels", "CodSoft", "InternPe"],', color: '#FCD34D' },
      { text: '    projects: ["AI Skill Twin", "Disaster Management"],', color: '#C084FC' },
      { text: '  });', color: '#F1F5F9' },
      { text: '', color: '#fff' },
      { text: '  await developer.synthesizeInterface({ spaceTheme: true, fps: 60 });', color: '#38BDF8' },
      { text: '  return developer.deploy();', color: '#00F0FF' },
      { text: '}', color: '#00F0FF' },
    ];

    codeLines.forEach((line, idx) => {
      ctx.fillStyle = line.color;
      ctx.fillText(line.text, 168, 76 + idx * 21);
    });

    // 5. Embedded Terminal Panel
    ctx.fillStyle = '#030509';
    ctx.fillRect(145, 420, canvas.width - 145, 156);
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(145, 420, canvas.width - 145, 2);

    ctx.font = '700 12px "JetBrains Mono", monospace';
    ctx.fillStyle = '#64748B';
    ctx.fillText('TERMINAL // zsh (active compiler)', 168, 442);

    const termLines = [
      '[INFO] Vite HMR synchronized — 0 errors detected.',
      '[ML-PIPELINE] Loading Skill Twin feature weights... [100% DONE]',
      '[SYSTEM] Space reactive starfield online (2,400 particles).',
    ];

    termLines.forEach((tLine, idx) => {
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillStyle = idx === 1 ? '#38BDF8' : idx === 2 ? '#10B981' : '#94A3B8';
      ctx.fillText(tLine, 168, 466 + idx * 20);
    });

    // Prompt line with flashing cursor
    ctx.fillStyle = '#00F0FF';
    ctx.fillText('pranav@portfolio:~$ ', 168, 532);
    ctx.fillStyle = '#E2E8F0';
    ctx.fillText(isHovered ? 'npm run test:interactive-models' : 'npm run start:workstation', 338, 532);

    if (cursorVisible) {
      ctx.fillStyle = '#00F0FF';
      ctx.fillRect(isHovered ? 600 : 538, 520, 9, 15);
    }

    texture.needsUpdate = true;
  };

  const update = (time: number, isHovered: boolean) => {
    const blinkRate = isHovered ? 0.25 : 0.45;
    const timeToBlink = time - lastBlink > blinkRate;
    const hoverChanged = prevHovered !== isHovered;

    if (!isInitialized || timeToBlink || hoverChanged) {
      if (timeToBlink) {
        cursorVisible = !cursorVisible;
        lastBlink = time;
      }
      prevHovered = isHovered;
      isInitialized = true;
      renderFullIDE(isHovered);
    }
  };

  return { texture, update };
}

// ---------------------------------------------------------------------------
// 3D DEVELOPER WORKSTATION SCENE: NEAT, CLEAN & INTERACTIVE
// Seated working developer with smooth cursor actions & GSAP scroll dynamics
// ---------------------------------------------------------------------------
export default function DeveloperWorkstation3D({
  isSceneHovered = false,
}: {
  isSceneHovered?: boolean;
}) {
  const rootGroupRef = useRef<THREE.Group>(null);

  // Character Kinematics References
  const developerBodyRef = useRef<THREE.Group>(null);
  const headGroupRef = useRef<THREE.Group>(null);
  const chestRef = useRef<THREE.Group>(null);
  const nearHandRef = useRef<THREE.Group>(null);
  const farHandRef = useRef<THREE.Group>(null);

  // Monitor & Lighting References
  const screenLightRef = useRef<THREE.PointLight>(null);
  const holoLeftRef = useRef<THREE.Group>(null);
  const holoRightRef = useRef<THREE.Group>(null);

  const [leftHoloHovered, setLeftHoloHovered] = useState(false);
  const [rightHoloHovered, setRightHoloHovered] = useState(false);

  // Track GSAP Scroll Progress for dynamic 3D scroll movement
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: '#home',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2,
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  // Dynamic Screen Texture (hyper-optimized)
  const { texture: screenTexture, update: updateScreen } = useMemo(createScreenTexture, []);

  // Clean Material Library
  const materials = useMemo(() => {
    return {
      // Tech Hoodie & Pants
      hoodieMat: new THREE.MeshStandardMaterial({
        color: '#151D2A',
        roughness: 0.75,
        metalness: 0.15,
      }),
      hoodTrimMat: new THREE.MeshStandardMaterial({
        color: '#1E293B',
        roughness: 0.7,
      }),
      skinMat: new THREE.MeshStandardMaterial({
        color: '#E2AF79', // Warm natural skin tone
        roughness: 0.55,
        metalness: 0.05,
      }),
      hairMat: new THREE.MeshStandardMaterial({
        color: '#0F172A', // Dark stylized hair
        roughness: 0.8,
      }),
      pantsMat: new THREE.MeshStandardMaterial({
        color: '#0B1120', // Dark tailored trousers
        roughness: 0.85,
      }),
      shoesMat: new THREE.MeshStandardMaterial({
        color: '#090D16',
        roughness: 0.65,
      }),
      shoeSoleMat: new THREE.MeshStandardMaterial({
        color: '#F8FAFC',
        roughness: 0.35,
      }),
      headphoneMat: new THREE.MeshStandardMaterial({
        color: '#080E1A',
        roughness: 0.25,
        metalness: 0.9,
      }),

      // Ergonomic Chair Materials
      chairMesh: new THREE.MeshStandardMaterial({
        color: '#0B1220',
        roughness: 0.65,
        metalness: 0.25,
      }),
      chairChrome: new THREE.MeshStandardMaterial({
        color: '#CBD5E1',
        roughness: 0.15,
        metalness: 0.95,
      }),

      // Desk & Hardware Materials
      deskSurface: new THREE.MeshStandardMaterial({
        color: '#080D18',
        roughness: 0.3,
        metalness: 0.7,
      }),
      darkChassis: new THREE.MeshStandardMaterial({
        color: '#060A12',
        roughness: 0.35,
        metalness: 0.85,
      }),
      chromeMetal: new THREE.MeshStandardMaterial({
        color: '#E2E8F0',
        roughness: 0.15,
        metalness: 0.95,
      }),
      deskPad: new THREE.MeshStandardMaterial({
        color: '#03060C',
        roughness: 0.85,
      }),

      // Emissive Lights
      cyanEmissive: new THREE.MeshStandardMaterial({
        color: '#00F0FF',
        emissive: '#00F0FF',
        emissiveIntensity: 1.6,
        toneMapped: false,
      }),
      violetEmissive: new THREE.MeshStandardMaterial({
        color: '#8B5CF6',
        emissive: '#8B5CF6',
        emissiveIntensity: 1.5,
        toneMapped: false,
      }),
      screenEmissive: new THREE.MeshBasicMaterial({
        map: screenTexture,
        side: THREE.DoubleSide,
      }),

      // Holographic Panels
      holoGlass: new THREE.MeshStandardMaterial({
        color: '#00F0FF',
        transparent: true,
        opacity: 0.25,
        roughness: 0.1,
        metalness: 0.9,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      }),
    };
  }, [screenTexture]);

  // Frame Loop for Smooth Kinematics, Cursor Reaction & GSAP Scroll Dynamics
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const ptr = state.pointer; // Normalized [-1, 1]

    // 1. Update Monitor Screen Canvas (only when needed)
    updateScreen(t, isSceneHovered);

    // 2. GSAP Scroll Dynamics + Cursor Reaction on the Root Scene
    const scrollP = scrollProgressRef.current; // 0 to 1 as hero scrolls
    const scrollOrbitY = scrollP * 0.42; // Smooth 3D orbit rotation when scrolling content
    const scrollShiftX = scrollP * 0.2;
    const scrollShiftY = -scrollP * 0.1;

    if (rootGroupRef.current) {
      // Dynamic cursor responsive tilt: stronger when hovered for clear feedback!
      const cursorTiltX = isSceneHovered ? -ptr.y * 0.12 : -ptr.y * 0.05;
      const cursorTiltY = isSceneHovered ? ptr.x * 0.16 : ptr.x * 0.07;

      const targetRotY = cursorTiltY + scrollOrbitY;
      const targetRotX = cursorTiltX;

      rootGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        rootGroupRef.current.rotation.y,
        targetRotY,
        0.06
      );
      rootGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        rootGroupRef.current.rotation.x,
        targetRotX,
        0.06
      );

      // Subtle resting float + scroll translation
      const floatY = Math.sin(t * 1.6) * 0.02 + scrollShiftY;
      rootGroupRef.current.position.y = THREE.MathUtils.lerp(
        rootGroupRef.current.position.y,
        floatY,
        0.06
      );
      rootGroupRef.current.position.x = THREE.MathUtils.lerp(
        rootGroupRef.current.position.x,
        scrollShiftX,
        0.06
      );
    }

    // 3. Character Head Reaction:
    // When hovered: head turns noticeably toward the pointer to acknowledge cursor!
    // When idle: gently tracks screen and code lines.
    if (headGroupRef.current) {
      const headTurnMultiplier = isSceneHovered ? 0.35 : 0.18;
      const cursorHeadYaw = Math.max(-0.28, Math.min(0.28, ptr.x * headTurnMultiplier));
      const cursorHeadPitch = Math.max(-0.16, Math.min(0.16, -ptr.y * 0.18));

      // Active scanning across code lines
      const scanPitch = Math.sin(t * 1.5) * 0.03;
      const scanYaw = Math.cos(t * 1.1) * 0.035;

      headGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        headGroupRef.current.rotation.y,
        cursorHeadYaw + scanYaw,
        0.08
      );
      headGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        headGroupRef.current.rotation.x,
        cursorHeadPitch + scanPitch,
        0.08
      );
    }

    // 4. Natural Upper-Body Focused Breathing
    if (chestRef.current) {
      const breathe = Math.sin(t * 2.2);
      chestRef.current.scale.y = 1.0 + breathe * 0.012;
      chestRef.current.rotation.z = Math.sin(t * 1.1) * 0.008;
    }

    // 5. Active Organic Typing Animations:
    // When cursor is placed in it, typing becomes noticeably faster and more energetic!
    const typeSpeed = isSceneHovered ? 24 : 13;
    const typeAmp = isSceneHovered ? 0.022 : 0.012;

    // Near Hand (Right hand, facing camera)
    if (nearHandRef.current) {
      const isMousing = Math.sin(t * 0.45) > 0.35;
      const targetZ = isMousing ? 0.22 : 0.04;
      const targetX = isMousing ? 0.38 : 0.22;

      nearHandRef.current.position.x = THREE.MathUtils.lerp(
        nearHandRef.current.position.x,
        targetX,
        0.08
      );
      nearHandRef.current.position.z = THREE.MathUtils.lerp(
        nearHandRef.current.position.z,
        targetZ,
        0.08
      );
      nearHandRef.current.position.y = -0.16 + Math.sin(t * typeSpeed) * typeAmp;
    }

    // Far Hand (Left hand typing on keyboard)
    if (farHandRef.current) {
      const tapFar = Math.sin(t * typeSpeed + 1.2) * typeAmp;
      farHandRef.current.position.y = -0.16 + tapFar;
      farHandRef.current.position.x = 0.06 + Math.cos(t * (typeSpeed * 0.5)) * 0.01;
    }

    // 6. Monitor Screen Glow on Developer's Face and Hands (Intensifies on hover)
    if (screenLightRef.current) {
      const baseIntensity = isSceneHovered ? 2.5 : 1.4;
      screenLightRef.current.intensity = baseIntensity + Math.sin(t * 8) * 0.15;
    }

    // 7. Holographic Panels Gentle Float
    if (holoLeftRef.current) {
      holoLeftRef.current.position.y = 0.82 + Math.sin(t * 1.7) * 0.03;
    }
    if (holoRightRef.current) {
      holoRightRef.current.position.y = 0.78 + Math.cos(t * 1.5) * 0.03;
    }
  });

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 85;
      const pos = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
      if ((window as any).__lenis) {
        (window as any).__lenis.scrollTo(pos, { duration: 1.2 });
      } else {
        window.scrollTo({ top: pos, behavior: 'smooth' });
      }
    }
  };

  return (
    <group ref={rootGroupRef} position={[0, -0.05, 0]}>
      {/* ----------------------------------------------------------------- */}
      {/* 1. SEATED DEVELOPER CHARACTER (LEFT SIDE, FACING RIGHT TOWARD DESK)*/}
      {/* ----------------------------------------------------------------- */}
      {/* Developer positioned at left and rotated -68° (-1.18 rad) */}
      {/* Clear three-quarter side profile showcasing developer at work */}
      <group ref={developerBodyRef} position={[-0.48, -0.25, 0.1]} rotation={[0, -1.18, 0]}>
        
        {/* ---- LOWER BODY (SEATED HIPS, LEGS & SNEAKERS) ---- */}
        {/* Hips resting squarely on chair cushion */}
        <mesh position={[0, 0.14, 0]} material={materials.pantsMat}>
          <boxGeometry args={[0.44, 0.2, 0.42]} />
        </mesh>

        {/* Near Thigh (Right side facing camera) extending forward to desk */}
        <mesh position={[0.14, 0.16, -0.22]} rotation={[0.08, 0, 0]} material={materials.pantsMat}>
          <boxGeometry args={[0.16, 0.16, 0.42]} />
        </mesh>
        {/* Far Thigh (Left side) extending forward to desk */}
        <mesh position={[-0.14, 0.16, -0.22]} rotation={[0.08, 0, 0]} material={materials.pantsMat}>
          <boxGeometry args={[0.16, 0.16, 0.42]} />
        </mesh>

        {/* Near Lower Leg (Right) descending vertically to floor */}
        <mesh position={[0.14, -0.26, -0.42]} material={materials.pantsMat}>
          <boxGeometry args={[0.14, 0.52, 0.14]} />
        </mesh>
        {/* Far Lower Leg (Left) descending vertically to floor */}
        <mesh position={[-0.14, -0.26, -0.42]} material={materials.pantsMat}>
          <boxGeometry args={[0.14, 0.52, 0.14]} />
        </mesh>

        {/* Near Sneaker on Floor (Right) */}
        <group position={[0.14, -0.5, -0.48]}>
          <mesh material={materials.shoesMat} position={[0, 0.04, 0]}>
            <boxGeometry args={[0.13, 0.08, 0.27]} />
          </mesh>
          <mesh material={materials.shoeSoleMat} position={[0, 0.01, 0]}>
            <boxGeometry args={[0.14, 0.025, 0.28]} />
          </mesh>
        </group>

        {/* Far Sneaker on Floor (Left) */}
        <group position={[-0.14, -0.5, -0.48]}>
          <mesh material={materials.shoesMat} position={[0, 0.04, 0]}>
            <boxGeometry args={[0.13, 0.08, 0.27]} />
          </mesh>
          <mesh material={materials.shoeSoleMat} position={[0, 0.01, 0]}>
            <boxGeometry args={[0.14, 0.025, 0.28]} />
          </mesh>
        </group>

        {/* ---- UPPER BODY (TORSO, CHEST & ARMS IN TECH HOODIE) ---- */}
        <group ref={chestRef} position={[0, 0.3, 0]}>
          {/* Main Torso in Tech Hoodie */}
          <mesh position={[0, 0.22, 0]} material={materials.hoodieMat}>
            <boxGeometry args={[0.5, 0.46, 0.32]} />
          </mesh>
          {/* Draped Hoodie Collar */}
          <mesh position={[0, 0.44, 0.04]} material={materials.hoodTrimMat}>
            <cylinderGeometry args={[0.2, 0.25, 0.12, 16]} />
          </mesh>

          {/* ---- NEAR ARM (RIGHT ARM - FACING CAMERA IN SIDE PROFILE) ---- */}
          <group position={[0.28, 0.26, -0.04]}>
            {/* Shoulder Deltoid */}
            <mesh material={materials.hoodieMat}>
              <sphereGeometry args={[0.1, 16, 16]} />
            </mesh>
            {/* Upper Arm angled down & forward */}
            <mesh position={[0, -0.16, -0.08]} rotation={[0.45, 0, -0.08]} material={materials.hoodieMat}>
              <capsuleGeometry args={[0.08, 0.28, 8, 16]} />
            </mesh>
            {/* Forearm angled toward keyboard */}
            <mesh position={[-0.06, -0.32, -0.24]} rotation={[-0.2, -0.32, 0]} material={materials.hoodieMat}>
              <capsuleGeometry args={[0.07, 0.3, 8, 16]} />
            </mesh>
          </group>

          {/* Near Hand & Fingers over Keyboard/Mouse (Right) */}
          <group ref={nearHandRef} position={[0.22, -0.04, -0.38]}>
            <mesh material={materials.skinMat} position={[0, 0, 0]}>
              <boxGeometry args={[0.1, 0.036, 0.12]} />
            </mesh>
            {/* Shaped Fingers */}
            {[-0.03, -0.008, 0.014, 0.036].map((fX, fIdx) => (
              <mesh key={fIdx} position={[fX, -0.01, -0.065]} rotation={[0.25, 0, 0]} material={materials.skinMat}>
                <boxGeometry args={[0.018, 0.02, 0.05]} />
              </mesh>
            ))}
          </group>

          {/* ---- FAR ARM (LEFT ARM - EXTENDING TO KEYBOARD) ---- */}
          <group position={[-0.28, 0.26, -0.04]}>
            <mesh material={materials.hoodieMat}>
              <sphereGeometry args={[0.1, 16, 16]} />
            </mesh>
            <mesh position={[0, -0.16, -0.08]} rotation={[0.45, 0, 0.08]} material={materials.hoodieMat}>
              <capsuleGeometry args={[0.08, 0.28, 8, 16]} />
            </mesh>
            <mesh position={[0.06, -0.32, -0.24]} rotation={[-0.2, 0.32, 0]} material={materials.hoodieMat}>
              <capsuleGeometry args={[0.07, 0.3, 8, 16]} />
            </mesh>
          </group>

          {/* Far Hand & Fingers Typing over Keyboard (Left) */}
          <group ref={farHandRef} position={[-0.12, -0.04, -0.38]}>
            <mesh material={materials.skinMat} position={[0, 0, 0]}>
              <boxGeometry args={[0.1, 0.036, 0.12]} />
            </mesh>
            {/* Shaped Fingers */}
            {[-0.03, -0.008, 0.014, 0.036].map((fX, fIdx) => (
              <mesh key={fIdx} position={[fX, -0.01, -0.065]} rotation={[0.25, 0, 0]} material={materials.skinMat}>
                <boxGeometry args={[0.018, 0.02, 0.05]} />
              </mesh>
            ))}
          </group>

          {/* ---- HEAD WITH NEAT & CLEAN RECOGNIZABLE PROFILE ---- */}
          <group ref={headGroupRef} position={[0, 0.58, 0.02]}>
            {/* Neck */}
            <mesh position={[0, -0.08, 0]} material={materials.skinMat}>
              <cylinderGeometry args={[0.08, 0.095, 0.14, 16]} />
            </mesh>
            {/* Head Structure */}
            <mesh position={[0, 0.1, 0.02]} material={materials.skinMat}>
              <boxGeometry args={[0.22, 0.26, 0.24]} />
            </mesh>

            {/* Nose Bridge & Tip (Protruding visibly in side profile toward desk) */}
            <mesh position={[0, 0.1, -0.155]} material={materials.skinMat}>
              <boxGeometry args={[0.04, 0.08, 0.07]} />
            </mesh>
            {/* Defined Jawline & Chin */}
            <mesh position={[0, 0.01, -0.095]} rotation={[0.25, 0, 0]} material={materials.skinMat}>
              <boxGeometry args={[0.17, 0.09, 0.13]} />
            </mesh>
            {/* Brow Ridge Profile */}
            <mesh position={[0, 0.17, -0.13]} material={materials.skinMat}>
              <boxGeometry args={[0.18, 0.04, 0.05]} />
            </mesh>

            {/* Modern Layered Hair Contour */}
            <mesh position={[0, 0.23, 0.01]} material={materials.hairMat}>
              <boxGeometry args={[0.24, 0.13, 0.26]} />
            </mesh>
            <mesh position={[0, 0.21, -0.1]} rotation={[-0.2, 0, 0]} material={materials.hairMat}>
              <boxGeometry args={[0.23, 0.09, 0.08]} />
            </mesh>
            <mesh position={[0, 0.12, 0.12]} material={materials.hairMat}>
              <boxGeometry args={[0.22, 0.21, 0.06]} />
            </mesh>

            {/* Studio Headphones with Cyan LED Indicator Ring */}
            <group position={[0, 0.1, 0.02]}>
              <mesh position={[0, 0.145, 0]} material={materials.headphoneMat}>
                <torusGeometry args={[0.14, 0.02, 8, 24, Math.PI]} />
              </mesh>
              {/* Near Earcup (Right - directly facing camera in side profile) */}
              <mesh position={[0.135, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.headphoneMat}>
                <cylinderGeometry args={[0.062, 0.062, 0.045, 16]} />
              </mesh>
              <mesh position={[0.16, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.cyanEmissive}>
                <ringGeometry args={[0.032, 0.048, 16]} />
              </mesh>

              {/* Far Earcup (Left) */}
              <mesh position={[-0.135, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.headphoneMat}>
                <cylinderGeometry args={[0.062, 0.062, 0.045, 16]} />
              </mesh>
              <mesh position={[-0.16, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.cyanEmissive}>
                <ringGeometry args={[0.032, 0.048, 16]} />
              </mesh>
            </group>
          </group>
        </group>

        {/* ---- ERGONOMIC OFFICE CHAIR (SUPPORTING DEVELOPER) ---- */}
        <group position={[0, -0.06, 0.06]}>
          {/* Starbase Caster Wheels on Floor */}
          <group position={[0, -0.46, 0]}>
            {[0, 1, 2, 3, 4].map((i) => {
              const angle = (i * Math.PI * 2) / 5;
              return (
                <group key={i} rotation={[0, angle, 0]}>
                  <mesh position={[0.25, 0, 0]} material={materials.chairChrome}>
                    <boxGeometry args={[0.5, 0.03, 0.05]} />
                  </mesh>
                  <mesh position={[0.48, -0.02, 0]} material={materials.darkChassis}>
                    <sphereGeometry args={[0.035, 12, 12]} />
                  </mesh>
                </group>
              );
            })}
          </group>

          {/* Chrome Pneumatic Cylinder */}
          <mesh position={[0, -0.22, 0]} material={materials.chairChrome}>
            <cylinderGeometry args={[0.04, 0.04, 0.44, 16]} />
          </mesh>

          {/* Contoured Seat Cushion */}
          <mesh position={[0, 0.06, 0]} material={materials.chairMesh}>
            <boxGeometry args={[0.56, 0.09, 0.52]} />
          </mesh>

          {/* High-Back Lumbar Mesh Spine */}
          <group position={[0, 0.46, 0.25]} rotation={[0.08, 0, 0]}>
            <mesh material={materials.chairMesh}>
              <boxGeometry args={[0.5, 0.7, 0.06]} />
            </mesh>
            {/* Chrome Support Spine */}
            <mesh position={[0, -0.04, 0.05]} material={materials.chairChrome}>
              <boxGeometry args={[0.07, 0.65, 0.04]} />
            </mesh>
            {/* Headrest */}
            <mesh position={[0, 0.45, -0.02]} material={materials.chairMesh}>
              <boxGeometry args={[0.3, 0.14, 0.08]} />
            </mesh>
          </group>

          {/* Armrests */}
          <mesh position={[0.3, 0.24, 0.06]} material={materials.chairChrome}>
            <boxGeometry args={[0.04, 0.26, 0.04]} />
          </mesh>
          <mesh position={[0.3, 0.37, 0.06]} material={materials.darkChassis}>
            <boxGeometry args={[0.09, 0.03, 0.28]} />
          </mesh>
          <mesh position={[-0.3, 0.24, 0.06]} material={materials.chairChrome}>
            <boxGeometry args={[0.04, 0.26, 0.04]} />
          </mesh>
          <mesh position={[-0.3, 0.37, 0.06]} material={materials.darkChassis}>
            <boxGeometry args={[0.09, 0.03, 0.28]} />
          </mesh>
        </group>
      </group>

      {/* ----------------------------------------------------------------- */}
      {/* 2. CANTILEVER DESK & MONITOR WORKSTATION (RIGHT SIDE OF FRAME)     */}
      {/* ----------------------------------------------------------------- */}
      <group position={[0.42, -0.32, -0.08]} rotation={[0, -0.28, 0]}>
        
        {/* Obsidian Desk Top */}
        <mesh position={[0, 0, 0]} material={materials.deskSurface} castShadow receiveShadow>
          <boxGeometry args={[2.3, 0.07, 1.2]} />
        </mesh>

        {/* Cyber Cyan Front LED Edge Strip */}
        <mesh position={[0, -0.01, 0.605]} material={materials.cyanEmissive}>
          <boxGeometry args={[2.28, 0.015, 0.015]} />
        </mesh>

        {/* Sleek Cantilever Legs */}
        <mesh position={[-1.0, -0.52, 0]} material={materials.chairChrome}>
          <boxGeometry args={[0.07, 1.0, 0.8]} />
        </mesh>
        <mesh position={[1.0, -0.52, 0]} material={materials.chairChrome}>
          <boxGeometry args={[0.07, 1.0, 0.8]} />
        </mesh>
        {/* Foot Floor Stabilizers */}
        <mesh position={[-1.0, -1.04, 0]} material={materials.darkChassis}>
          <boxGeometry args={[0.13, 0.05, 1.0]} />
        </mesh>
        <mesh position={[1.0, -1.04, 0]} material={materials.darkChassis}>
          <boxGeometry args={[0.13, 0.05, 1.0]} />
        </mesh>

        {/* Gaming Desk Pad */}
        <mesh position={[-0.1, 0.038, 0.06]} material={materials.deskPad}>
          <boxGeometry args={[1.6, 0.01, 0.74]} />
        </mesh>
        <mesh position={[-0.1, 0.039, 0.06]} material={materials.cyanEmissive}>
          <ringGeometry args={[0.78, 0.795, 4]} />
        </mesh>

        {/* Mechanical 75% Keyboard */}
        <group position={[-0.2, 0.04, 0.14]} rotation={[0, 0.1, 0]}>
          <mesh material={materials.darkChassis} position={[0, 0.015, 0]}>
            <boxGeometry args={[0.98, 0.035, 0.34]} />
          </mesh>
          {/* Keycaps Grid Rows */}
          {[-0.1, -0.04, 0.02, 0.08, 0.14].map((zRow, idx) => (
            <mesh key={idx} position={[0, 0.035, zRow]} material={materials.chromeMetal}>
              <boxGeometry args={[0.92, 0.018, 0.042]} />
            </mesh>
          ))}
          {/* Cyber Cyan Underglow */}
          <mesh position={[0, 0.005, 0.175]} material={materials.cyanEmissive}>
            <boxGeometry args={[0.96, 0.01, 0.01]} />
          </mesh>
        </group>

        {/* Precision Wireless Mouse */}
        <group position={[0.45, 0.04, 0.18]}>
          <mesh material={materials.darkChassis}>
            <capsuleGeometry args={[0.048, 0.095, 8, 16]} />
          </mesh>
          <mesh position={[0, 0.035, -0.03]} material={materials.cyanEmissive}>
            <boxGeometry args={[0.015, 0.02, 0.03]} />
          </mesh>
        </group>

        {/* Widescreen Monitor (Angled toward developer AND viewer, zero clipping) */}
        <group position={[0.05, 0.65, -0.28]} rotation={[0, 0.22, 0]}>
          {/* Monitor Armor Back Chassis */}
          <mesh material={materials.darkChassis} position={[0, 0, 0]}>
            <boxGeometry args={[1.86, 1.0, 0.05]} />
          </mesh>

          {/* Active Screen Display Plane with Dynamic Canvas Texture */}
          <mesh material={materials.screenEmissive} position={[0, 0, 0.028]}>
            <planeGeometry args={[1.8, 0.94]} />
          </mesh>

          {/* Back Ambient RGB Glow Strip */}
          <mesh position={[0, 0, -0.03]} material={materials.cyanEmissive}>
            <boxGeometry args={[1.75, 0.02, 0.015]} />
          </mesh>

          {/* Heavy Articulated Stand Arm */}
          <group position={[0, -0.45, -0.08]}>
            <mesh material={materials.chromeMetal}>
              <cylinderGeometry args={[0.04, 0.04, 0.6, 16]} />
            </mesh>
            <mesh position={[0, -0.3, 0.06]} material={materials.darkChassis}>
              <boxGeometry args={[0.24, 0.04, 0.28]} />
            </mesh>
          </group>

          {/* Dynamic Light Cast From Code onto Developer's Face Profile & Hands */}
          <pointLight
            ref={screenLightRef}
            position={[-0.4, 0.05, 0.45]}
            intensity={1.4}
            color="#38BDF8"
            distance={2.8}
          />
        </group>
      </group>

      {/* ----------------------------------------------------------------- */}
      {/* 3. RESTRAINED HOLOGRAPHIC PANELS (CLICKABLE NAVIGATION)           */}
      {/* ----------------------------------------------------------------- */}
      {/* Left Hologram Panel */}
      <group
        ref={holoLeftRef}
        position={[-1.75, 0.82, -0.2]}
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
        <mesh material={materials.holoGlass}>
          <planeGeometry args={[0.78, 0.9]} />
        </mesh>
        <mesh material={leftHoloHovered ? materials.cyanEmissive : materials.violetEmissive}>
          <ringGeometry args={[0.38, 0.395, 4]} />
        </mesh>
        <mesh position={[-0.2, 0.24, 0.01]} material={materials.cyanEmissive}>
          <boxGeometry args={[0.28, 0.02, 0.01]} />
        </mesh>
        <mesh position={[-0.1, 0.08, 0.01]} material={materials.cyanEmissive}>
          <boxGeometry args={[0.46, 0.02, 0.01]} />
        </mesh>
        <mesh position={[-0.15, -0.08, 0.01]} material={materials.violetEmissive}>
          <boxGeometry args={[0.34, 0.02, 0.01]} />
        </mesh>
        <mesh position={[0, -0.22, 0.01]} material={materials.cyanEmissive}>
          <boxGeometry args={[0.5, 0.02, 0.01]} />
        </mesh>
      </group>

      {/* Right Hologram Panel */}
      <group
        ref={holoRightRef}
        position={[1.85, 0.78, -0.2]}
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
        <mesh material={materials.holoGlass}>
          <planeGeometry args={[0.78, 0.86]} />
        </mesh>
        <mesh position={[0.1, 0.22, 0.01]} material={rightHoloHovered ? materials.cyanEmissive : materials.violetEmissive}>
          <boxGeometry args={[0.44, 0.02, 0.01]} />
        </mesh>
        <mesh position={[0, 0.06, 0.01]} material={materials.cyanEmissive}>
          <boxGeometry args={[0.54, 0.02, 0.01]} />
        </mesh>
        <mesh position={[0.15, -0.08, 0.01]} material={materials.cyanEmissive}>
          <boxGeometry args={[0.34, 0.02, 0.01]} />
        </mesh>
        <mesh position={[0, -0.24, 0.02]} material={rightHoloHovered ? materials.cyanEmissive : materials.violetEmissive}>
          <boxGeometry args={[0.48, 0.02, 0.01]} />
        </mesh>
      </group>
    </group>
  );
}

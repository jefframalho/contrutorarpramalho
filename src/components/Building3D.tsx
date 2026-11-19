import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls, ContactShadows, Float } from "@react-three/drei";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";

const FLOORS = 7;
const RISE_SPEED = 1.6;

function concreteTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = "#b9b4ab";
  g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 2600; i++) {
    const v = 150 + Math.random() * 70;
    g.fillStyle = `rgba(${v},${v - 4},${v - 10},0.35)`;
    g.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function Floor({ index, progress }: { index: number; progress: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.Group>(null);
  const tex = useMemo(concreteTexture, []);
  const glass = index % 2 === 0;
  useFrame(() => {
    const local = THREE.MathUtils.clamp(progress.current - index, 0, 1);
    const e = 1 - Math.pow(1 - local, 3);
    if (ref.current) {
      ref.current.position.y = index * 1 + (1 - e) * 6;
      ref.current.scale.setScalar(Math.max(e, 0.001));
    }
  });
  return (
    <group ref={ref}>
      <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.12, 2.6]} />
        <meshStandardMaterial map={tex} roughness={0.9} />
      </mesh>
      {([[-1.6, -1.2], [1.6, -1.2], [-1.6, 1.2], [1.6, 1.2], [0, -1.2], [0, 1.2]] as [number, number][]).map(([x, z], i) => (
        <mesh key={i} position={[x, 0.55, z]} castShadow>
          <boxGeometry args={[0.14, 0.9, 0.14]} />
          <meshStandardMaterial map={tex} roughness={0.85} />
        </mesh>
      ))}
      {glass && (
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[3.1, 0.82, 2.3]} />
          <meshPhysicalMaterial color="#9fb6c4" transmission={0.6} roughness={0.15} metalness={0.1} transparent opacity={0.55} />
        </mesh>
      )}
    </group>
  );
}

function Crane() {
  const arm = useRef<THREE.Group>(null);
  const hook = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (arm.current) arm.current.rotation.y = Math.sin(t * 0.3) * 0.9;
    if (hook.current) hook.current.position.y = -1.4 + Math.sin(t * 0.8) * 0.5;
  });
  const steel = <meshStandardMaterial color="#e8a33d" metalness={0.4} roughness={0.45} />;
  return (
    <group position={[3.2, 0, -1.4]}>
      <mesh position={[0, 4.5, 0]} castShadow>
        <boxGeometry args={[0.22, 9, 0.22]} />
        {steel}
      </mesh>
      <group ref={arm} position={[0, 9, 0]}>
        <mesh position={[-2.2, 0, 0]} castShadow>
          <boxGeometry args={[6.4, 0.18, 0.18]} />
          {steel}
        </mesh>
        <mesh position={[0.9, -0.2, 0]}>
          <boxGeometry args={[0.6, 0.5, 0.5]} />
          <meshStandardMaterial color="#3a3a3a" />
        </mesh>
        <group position={[-4.4, 0, 0]}>
          <mesh position={[0, -0.7, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 1.4]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          <mesh ref={hook} castShadow>
            <boxGeometry args={[0.7, 0.18, 0.4]} />
            <meshStandardMaterial color="#8a8279" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function Scene({ onReady }: { onReady: () => void }) {
  const progress = useRef(0);
  const group = useRef<THREE.Group>(null);
  const ready = useRef(false);
  useFrame(({ pointer }, delta) => {
    const dt = Math.min(delta, 0.05);
    progress.current = Math.min(progress.current + dt * RISE_SPEED, FLOORS);
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.x * 0.35, 0.05);
    }
    if (!ready.current) { ready.current = true; onReady(); }
  });
  return (
    <group ref={group} position={[0, -3.2, 0]}>
      {Array.from({ length: FLOORS }).map((_, i) => (
        <Floor key={i} index={i} progress={progress} />
      ))}
      <Crane />
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[6.5, 48]} />
        <meshStandardMaterial color="#2a2724" roughness={1} />
      </mesh>
      <Float speed={2} floatIntensity={0.6}>
        <mesh position={[-3, 1, 1.6]} castShadow>
          <boxGeometry args={[0.9, 0.5, 0.6]} />
          <meshStandardMaterial color="#c98a2c" roughness={0.6} />
        </mesh>
      </Float>
      <ContactShadows position={[0, 0.01, 0]} opacity={0.5} scale={14} blur={2.4} far={8} />
    </group>
  );
}

export default function Building3D() {
  const [ready, setReady] = useState(false);
  const [interacting, setInteracting] = useState(false);
  useEffect(() => () => setReady(false), []);
  return (
    <div data-scene-ready={ready ? "" : undefined} className="relative h-full w-full cursor-grab active:cursor-grabbing">
      <Canvas shadows dpr={[1, 1.75]} camera={{ position: [12, 6, 15], fov: 40 }}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[6, 12, 6]} intensity={2.2} color="#ffd9a8" castShadow shadow-mapSize={[1024, 1024]} />
        <Environment resolution={128}>
          <Lightformer intensity={2} position={[0, 5, 0]} scale={[10, 10, 1]} />
          <Lightformer intensity={1.2} color="#f2b56b" position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
          <Lightformer intensity={0.8} color="#7f97a8" position={[5, 1, 1]} rotation-y={-Math.PI / 2} scale={[20, 1, 1]} />
        </Environment>
        <Scene onReady={() => setReady(true)} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.1}
          autoRotate={!interacting}
          autoRotateSpeed={0.6}
          onStart={() => setInteracting(true)}
          onEnd={() => setInteracting(false)}
        />
      </Canvas>
    </div>
  );
}

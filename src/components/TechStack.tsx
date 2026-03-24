import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";

function createTechTexture(name: string, bgColor: string, textColor: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.beginPath();
  ctx.arc(128, 128, 126, 0, Math.PI * 2);
  ctx.fillStyle = bgColor;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(128, 128, 116, 0, Math.PI * 2);
  ctx.fillStyle = "#f8f8f8";
  ctx.fill();
  ctx.fillStyle = textColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const words = name.split(" ");
  let fontSize = words.length === 1 ? 36 : words.length === 2 ? 30 : 24;
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  const longest = words.reduce((a, b) => (a.length > b.length ? a : b));
  while (ctx.measureText(longest).width > 210 && fontSize > 12) {
    fontSize -= 1;
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  }
  const lh = fontSize * 1.3;
  const startY = 128 - ((words.length - 1) * lh) / 2;
  words.forEach((word, i) => ctx.fillText(word, 128, startY + i * lh));
  return new THREE.CanvasTexture(canvas);
}

const techList = [
  { name: "Python", bg: "#3776AB", text: "#1a5276" },
  { name: "Java", bg: "#ED8B00", text: "#7a4500" },
  { name: "C", bg: "#A8B9CC", text: "#445566" },
  { name: "C++", bg: "#00599C", text: "#003d6b" },
  { name: "JavaScript", bg: "#F7DF1E", text: "#333300" },
  { name: "TypeScript", bg: "#3178C6", text: "#1a4a8a" },
  { name: "R", bg: "#276DC3", text: "#1a4a8a" },
  { name: "Apex", bg: "#1B96FF", text: "#004c99" },
  { name: "SQL", bg: "#CC2927", text: "#8b1a19" },
  { name: "React", bg: "#61DAFB", text: "#20232A" },
  { name: "React Native", bg: "#61DAFB", text: "#20232A" },
  { name: "Angular.js", bg: "#DD0031", text: "#8b0020" },
  { name: "HTML", bg: "#E34F26", text: "#7a2010" },
  { name: "CSS", bg: "#1572B6", text: "#0e4f80" },
  { name: "Node.js", bg: "#339933", text: "#1a5c1a" },
  { name: "Express.js", bg: "#888888", text: "#333333" },
  { name: "Spring Boot", bg: "#6DB33F", text: "#3d6e1e" },
  { name: ".NET", bg: "#512BD4", text: "#3a1e95" },
  { name: "Flask", bg: "#555555", text: "#222222" },
  { name: "GraphQL", bg: "#E10098", text: "#9a0068" },
  { name: "TensorFlow", bg: "#FF6F00", text: "#7a3500" },
  { name: "PyTorch", bg: "#EE4C2C", text: "#8b2210" },
  { name: "Hugging Face", bg: "#FFD21E", text: "#6b5500" },
  { name: "LangChain", bg: "#3CB371", text: "#1a6e3f" },
  { name: "OpenCV", bg: "#5C3EE8", text: "#3a22b0" },
  { name: "Pandas", bg: "#150458", text: "#f0f0f0" },
  { name: "PySpark", bg: "#E25A1C", text: "#7a2a0a" },
  { name: "Hive", bg: "#FDEE21", text: "#6b5500" },
  { name: "Databricks", bg: "#FF3621", text: "#7a1000" },
  { name: "AWS", bg: "#FF9900", text: "#7a4900" },
  { name: "Docker", bg: "#2496ED", text: "#1565a3" },
  { name: "Kubernetes", bg: "#326CE5", text: "#1e4bab" },
  { name: "OpenShift", bg: "#EE0000", text: "#8b0000" },
  { name: "Jenkins", bg: "#D33833", text: "#8a1e1a" },
  { name: "GitHub Actions", bg: "#2088FF", text: "#1155bb" },
  { name: "MySQL", bg: "#4479A1", text: "#1a3d6b" },
  { name: "MongoDB", bg: "#47A248", text: "#1a6e1a" },
  { name: "SQLite", bg: "#003B57", text: "#f0f0f0" },
  { name: "Hadoop", bg: "#66CCFF", text: "#0066aa" },
  { name: "Apache Spark", bg: "#E25A1C", text: "#7a2a0a" },
  { name: "Git", bg: "#F05032", text: "#7a1500" },
  { name: "Tableau", bg: "#E97627", text: "#7a3a10" },
  { name: "Streamlit", bg: "#FF4B4B", text: "#8b1a1a" },
  { name: "Salesforce", bg: "#00A1E0", text: "#006b95" },
  { name: "Jest", bg: "#C21325", text: "#7a0d19" },
  { name: "Selenium", bg: "#43B02A", text: "#2a6e1a" },
  { name: "Maven", bg: "#C71A36", text: "#7a0010" },
  { name: "Gradle", bg: "#02303A", text: "#e0f0f5" },
  { name: "JUnit", bg: "#25A162", text: "#0d6e40" },
];

const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);
const spheres = [...Array(techList.length)].map(() => ({
  scale: [0.7, 1, 0.8, 1, 1][Math.floor(Math.random() * 5)],
}));

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);
  useFrame((_state, delta) => {
    if (!isActive) return;
    delta = Math.min(0.1, delta);
    const impulse = vec
      .copy(api.current!.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -50 * delta * scale,
          -150 * delta * scale,
          -50 * delta * scale
        )
      );
    api.current?.applyImpulse(impulse, true);
  });
  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
    </RigidBody>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({ vec = new THREE.Vector3(), isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);
  useFrame(({ pointer, viewport }) => {
    if (!isActive) return;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current?.setNextKinematicTranslation(targetVec);
  });
  return (
    <RigidBody position={[100, 100, 100]} type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

const TechStack = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const threshold = document
        .getElementById("work")!
        .getBoundingClientRect().top;
      setIsActive(scrollY > threshold);
    };
    document.querySelectorAll(".header a").forEach((elem) => {
      const element = elem as HTMLAnchorElement;
      element.addEventListener("click", () => {
        const interval = setInterval(() => {
          handleScroll();
        }, 10);
        setTimeout(() => {
          clearInterval(interval);
        }, 1000);
      });
    });
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const materials = useMemo(() => {
    return techList.map((tech) => {
      const texture = createTechTexture(tech.name, tech.bg, tech.text);
      return new THREE.MeshPhysicalMaterial({
        map: texture,
        emissive: "#ffffff",
        emissiveMap: texture,
        emissiveIntensity: 0.3,
        metalness: 0.5,
        roughness: 1,
        clearcoat: 0.1,
      });
    });
  }, []);

  return (
    <div className="techstack">
      <h2> My Techstack</h2>
      <Canvas
        shadows
        gl={{ alpha: true, stencil: false, depth: false, antialias: false }}
        camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
        onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
        className="tech-canvas"
      >
        <ambientLight intensity={1} />
        <spotLight
          position={[20, 20, 25]}
          penumbra={1}
          angle={0.2}
          color="white"
          castShadow
          shadow-mapSize={[512, 512]}
        />
        <directionalLight position={[0, 5, -4]} intensity={2} />
        <Physics gravity={[0, 0, 0]}>
          <Pointer isActive={isActive} />
          {spheres.map((props, i) => (
            <SphereGeo
              key={i}
              {...props}
              material={materials[i % materials.length]}
              isActive={isActive}
            />
          ))}
        </Physics>
        <Environment
          files="/models/char_enviorment.hdr"
          environmentIntensity={0.5}
          environmentRotation={[0, 4, 2]}
        />
        <EffectComposer enableNormalPass={false}>
          <N8AO color="#0f002c" aoRadius={2} intensity={1.15} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default TechStack;

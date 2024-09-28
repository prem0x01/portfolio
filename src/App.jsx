import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import './App.css';
import MobileMenu from './MobileMenu';
import Blogs from './Blogs';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { OrbitControls, Text, Sphere, Line, Stars, Html, Billboard } from '@react-three/drei';
import * as THREE from 'three';

function useTypewriter(text, speed = 50) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, speed);

    return () => clearInterval(typingInterval);
  }, [text, speed]);

  return displayText;
}

function SkillPlanet({ skill, initialPosition, orbitalPeriod, axialTilt, radius }) {
  const groupRef = useRef();
  const planetRef = useRef();
  const moon1Ref = useRef();
  const moon2Ref = useRef();
  const [hovered, setHovered] = useState(false);
  const texture = useLoader(TextureLoader, skill.image);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() / orbitalPeriod;
    const angle = t * Math.PI * 2;
    groupRef.current.position.x = Math.cos(angle) * radius;
    groupRef.current.position.z = Math.sin(angle) * radius;
    groupRef.current.position.y = Math.sin(t * 2) * 0.2;
    planetRef.current.rotation.y += 0.01;

    if (isPython) {
      moon1Ref.current.rotation.y += 0.02;
      moon2Ref.current.rotation.y -= 0.015;
    }
  });

  const isPython = skill.name.toLowerCase() === 'python';
  const isGo = skill.name.toLowerCase() === 'go';

  return (
    <group ref={groupRef} position={initialPosition}>
      <pointLight intensity={0.5} distance={2} color="#ffffff" />
      <Sphere ref={planetRef} args={[0.3, 32, 32]} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <meshStandardMaterial
          map={texture}
          metalness={0.4}
          roughness={0.7}
          emissive={hovered ? new THREE.Color(0x8b5cf6) : new THREE.Color(0x000000)}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </Sphere>
      {isPython && (
        <>
          <group rotation={[Math.PI / 2, 0, 0]}>
            <mesh>
              <ringGeometry args={[0.4, 0.5, 64]} />
              <meshStandardMaterial color="#4B8BBE" side={THREE.DoubleSide} transparent opacity={0.7} />
            </mesh>
            <mesh>
              <ringGeometry args={[0.6, 0.7, 64]} />
              <meshStandardMaterial color="#FFD43B" side={THREE.DoubleSide} transparent opacity={0.7} />
            </mesh>
          </group>
          <group ref={moon1Ref}>
            <Sphere args={[0.05, 16, 16]} position={[0.5, 0, 0]}>
              <meshStandardMaterial color="#4B8BBE" />
            </Sphere>
          </group>
          <group ref={moon2Ref}>
            <Sphere args={[0.04, 16, 16]} position={[-0.4, 0.2, 0]}>
              <meshStandardMaterial color="#FFD43B" />
            </Sphere>
          </group>
        </>
      )}
      {isGo && (
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <ringGeometry args={[0.4, 0.5, 64]} />
            <meshStandardMaterial color="#00ADD8" side={THREE.DoubleSide} transparent opacity={0.7} />
          </mesh>
          <mesh>
            <ringGeometry args={[0.6, 0.7, 64]} />
            <meshStandardMaterial color="#5DC9E2" side={THREE.DoubleSide} transparent opacity={0.7} />
          </mesh>
        </group>
      )}
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.15}
          color="#e9d5ff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#4c1d95"
        >
          {skill.name}
        </Text>
      </Billboard>
      <Line
        points={new Array(64).fill().map((_, i) => {
          const a = (i / 64) * Math.PI * 2;
          return [Math.cos(a) * radius, 0, Math.sin(a) * radius];
        })}
        color="#8b5cf6"
        lineWidth={1}
        opacity={0.2}
        transparent
      />
      <mesh>
        <sphereGeometry args={[0.31, 32, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}


function SkillSun() {
  const sunRef = useRef();
  const coronaRef = useRef();

  useFrame(({ clock }) => {
    sunRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    coronaRef.current.rotation.z = clock.getElapsedTime() * 0.02;
  });

  return (
    <group>
      <Sphere ref={sunRef} args={[0.8, 64, 64]}>
        <shaderMaterial
          fragmentShader={`
            uniform float time;
            varying vec2 vUv;
            
            // Improved noise function for more realistic sun surface
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
            vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
            float snoise(vec3 v) {
              const vec2 C = vec2(1.0/6.0, 1.0/3.0);
              const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
              vec3 i  = floor(v + dot(v, C.yyy));
              vec3 x0 = v - i + dot(i, C.xxx);
              vec3 g = step(x0.yzx, x0.xyz);
              vec3 l = 1.0 - g;
              vec3 i1 = min(g.xyz, l.zxy);
              vec3 i2 = max(g.xyz, l.zxy);
              vec3 x1 = x0 - i1 + C.xxx;
              vec3 x2 = x0 - i2 + C.yyy;
              vec3 x3 = x0 - D.yyy;
              i = mod289(i);
              vec4 p = permute(permute(permute(
                        i.z + vec4(0.0, i1.z, i2.z, 1.0))
                      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
              float n_ = 0.142857142857;
              vec3 ns = n_ * D.wyz - D.xzx;
              vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
              vec4 x_ = floor(j * ns.z);
              vec4 y_ = floor(j - 7.0 * x_);
              vec4 x = x_ *ns.x + ns.yyyy;
              vec4 y = y_ *ns.x + ns.yyyy;
              vec4 h = 1.0 - abs(x) - abs(y);
              vec4 b0 = vec4(x.xy, y.xy);
              vec4 b1 = vec4(x.zw, y.zw);
              vec4 s0 = floor(b0)*2.0 + 1.0;
              vec4 s1 = floor(b1)*2.0 + 1.0;
              vec4 sh = -step(h, vec4(0.0));
              vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
              vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
              vec3 p0 = vec3(a0.xy, h.x);
              vec3 p1 = vec3(a0.zw, h.y);
              vec3 p2 = vec3(a1.xy, h.z);
              vec3 p3 = vec3(a1.zw, h.w);
              vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
              p0 *= norm.x;
              p1 *= norm.y;
              p2 *= norm.z;
              p3 *= norm.w;
              vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
              m = m * m;
              return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
            }
            
            void main() {
              vec2 uv = vUv;
              float n = snoise(vec3(uv * 20.0, time * 0.1)) * 0.5 + 0.5;
              
              // Create sun spots
              float spots = smoothstep(0.4, 0.5, snoise(vec3(uv * 8.0, time * 0.05)));
              
              // Create solar flares
              float flares = pow(snoise(vec3(uv * 15.0, time * 0.2)), 3.0) * 0.3;
              
              // Mix colors for a more realistic sun appearance
              vec3 baseColor = mix(vec3(1.0, 0.6, 0.1), vec3(1.0, 0.4, 0.0), n);
              baseColor = mix(baseColor, vec3(0.8, 0.2, 0.0), spots);
              baseColor += vec3(1.0, 0.6, 0.3) * flares;
              
              // Add glow
              float glow = 1.0 - length(uv - 0.5) * 2.0;
              baseColor += vec3(1.0, 0.8, 0.6) * pow(glow, 3.0) * 0.3;
              
              gl_FragColor = vec4(baseColor, 1.0);
            }
          `}
          vertexShader={`
            varying vec2 vUv;
            
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          uniforms={{
            time: { value: 0 }
          }}
        />
      </Sphere>
      <Sphere ref={coronaRef} args={[1.2, 64, 64]}>
        <shaderMaterial
          fragmentShader={`
            uniform float time;
            varying vec2 vUv;
            
            // Use the same improved noise function as in the sun shader
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
            vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
            float snoise(vec3 v) {
              const vec2 C = vec2(1.0/6.0, 1.0/3.0);
              const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
              vec3 i  = floor(v + dot(v, C.yyy));
              vec3 x0 = v - i + dot(i, C.xxx);
              vec3 g = step(x0.yzx, x0.xyz);
              vec3 l = 1.0 - g;
              vec3 i1 = min(g.xyz, l.zxy);
              vec3 i2 = max(g.xyz, l.zxy);
              vec3 x1 = x0 - i1 + C.xxx;
              vec3 x2 = x0 - i2 + C.yyy;
              vec3 x3 = x0 - D.yyy;
              i = mod289(i);
              vec4 p = permute(permute(permute(
                        i.z + vec4(0.0, i1.z, i2.z, 1.0))
                      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
              float n_ = 0.142857142857;
              vec3 ns = n_ * D.wyz - D.xzx;
              vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
              vec4 x_ = floor(j * ns.z);
              vec4 y_ = floor(j - 7.0 * x_);
              vec4 x = x_ *ns.x + ns.yyyy;
              vec4 y = y_ *ns.x + ns.yyyy;
              vec4 h = 1.0 - abs(x) - abs(y);
              vec4 b0 = vec4(x.xy, y.xy);
              vec4 b1 = vec4(x.zw, y.zw);
              vec4 s0 = floor(b0)*2.0 + 1.0;
              vec4 s1 = floor(b1)*2.0 + 1.0;
              vec4 sh = -step(h, vec4(0.0));
              vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
              vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
              vec3 p0 = vec3(a0.xy, h.x);
              vec3 p1 = vec3(a0.zw, h.y);
              vec3 p2 = vec3(a1.xy, h.z);
              vec3 p3 = vec3(a1.zw, h.w);
              vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
              p0 *= norm.x;
              p1 *= norm.y;
              p2 *= norm.z;
              p3 *= norm.w;
              vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
              m = m * m;
              return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
            }
            
            void main() {
              vec2 uv = vUv;
              float dist = length(uv - 0.5) * 2.0;
              
              // Create more dynamic flame-like effect
              float flameNoise = snoise(vec3(uv * 8.0, time * 0.5)) * 0.5 + 0.5;
              float flameShape = pow(1.0 - dist, 2.0) * flameNoise;
              
              // Add flickering effect
              float flicker = sin(time * 10.0) * 0.1 + 0.9;
              
              // Create color gradient for flames
              vec3 innerColor = vec3(1.0, 0.7, 0.3);
              vec3 outerColor = vec3(1.0, 0.3, 0.1);
              vec3 flameColor = mix(innerColor, outerColor, flameShape);
              
              // Add some "licks" to the flames
              float licks = pow(max(0.0, sin(atan(uv.y - 0.5, uv.x - 0.5) * 20.0 + flameNoise * 10.0)), 10.0) * 0.15;
              flameColor += vec3(1.0, 0.6, 0.3) * licks;
              
              float alpha = smoothstep(1.0, 0.1, dist) * flameShape * flicker;
              
              gl_FragColor = vec4(flameColor, alpha);
            }
          `}
          vertexShader={`
            varying vec2 vUv;
            
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          uniforms={{
            time: { value: 0 }
          }}
          transparent={true}
        />
      </Sphere>
    </group>
  );
}

function SkillsSystem({ skills, containerSize }) {
  const skillPlanets = useMemo(() => {
    const totalSkills = skills.length;
    const aspectRatio = containerSize.width / containerSize.height;
    const baseRadius = aspectRatio > 1 ? 5 : 6;
    
    return skills.map((skill, index) => {
      const angle = (index / totalSkills) * Math.PI * 2;
      const radius = baseRadius + (index * 0.8); // Increase spacing between orbits
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const orbitalPeriod = 20 + (index * 5);
      const axialTilt = Math.random() * Math.PI / 6;
      return { skill, position: [x, 0, z], orbitalPeriod, axialTilt, radius };
    });
  }, [skills, containerSize]);

  return (
    <group>
      <SkillSun />
      {skillPlanets.map(({ skill, position, orbitalPeriod, axialTilt, radius }) => (
        <SkillPlanet
          key={skill.name}
          skill={skill}
          initialPosition={position}
          orbitalPeriod={orbitalPeriod}
          axialTilt={axialTilt}
          radius={radius}
        />
      ))}
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={2} distance={50} decay={2} />
      <Stars
        radius={100} 
        depth={50}   
        count={5000} 
        factor={2}   
        saturation={0}
        fade
        speed={0.2}  
        color="#8b5cf6"
      />
      <fog attach="fog" args={['#2d1b69', 20, 40]} />
    </group>
  );
}

function LoadingScreen() {
  return (
    <Html center>
      <div className="loading">
        <div className="loading-text">
          Loading Skills Universe...
        </div>
        <div className="loading-progress"></div>
      </div>
    </Html>
  );
}

function SkillsSection({ skills }) {
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <section id="skills" className="mb-20">
      <h2 className="text-3xl font-bold mb-8 text-purple-400">My Skills</h2>
      <div ref={containerRef} className="bg-black bg-opacity-90 backdrop-filter backdrop-blur-sm rounded-lg shadow-lg p-4 border border-purple-500 w-full h-[60vh] mb-8">
        <Canvas camera={{ position: [0, 0, 20], fov: 50 }}>
          <color attach="background" args={['#000000']} />
          <Suspense fallback={<LoadingScreen />}>
            <SkillsSystem skills={skills} containerSize={containerSize} />
          </Suspense>
          <OrbitControls enablePan={false} enableZoom={true} maxDistance={30} minDistance={10} />
        </Canvas>
      </div>
      
      <div className="text-center mb-8">
        <button 
          onClick={() => setShowAllSkills(!showAllSkills)}
          className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          {showAllSkills ? "Hide All Skills" : "View All Skills"}
        </button>
      </div>

      {showAllSkills && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {skills.map((skill, index) => (
            <div 
              key={index} 
              className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-sm rounded-lg p-4 flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-purple-500"
            >
              <img 
                src={skill.image} 
                alt={skill.name} 
                className="w-16 h-16 object-contain mb-2"
              />
              <p className="text-purple-300 text-center">{skill.name}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function App() {
  const canvasRef = useRef(null);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [currentSkill, setCurrentSkill] = useState(0);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentPage, setCurrentPage] = useState('home');
  const [isFullScreenBlog, setIsFullScreenBlog] = useState(false);
  const [blogMetadata, setBlogMetadata] = useState([]);
  const [blogContent, setBlogContent] = useState({});

  const skills = [
    { name: 'React', image: '/images/react.png' },
    { name: 'JavaScript', image: '/images/js.png' },
    { name: 'Node.js', image: '/images/nodejs.png' },
    { name: 'Python', image: '/images/python.png' },
    { name: 'Go', image: '/images/golang.png' },
    { name: 'Java', image: '/images/java.png' },
    { name: 'Git', image: '/images/git.png' },
    { name: 'SQL', image: '/images/database.png' },
    { name: 'C', image: '/images/c.png' },
    { name: 'php', image: '/images/php.png' },
    { name: 'Kubernetes', image: '/images/kubernetes.1024x996.png' },
    { name: 'Docker', image: '/images/social.png' },
  ];

  const projects = [
    { name: 'DeepressionGuru', description: 'The DepressionGuru Web Application is a responsive, secure platform for sharing and receiving support for depression. Built with a Python backend, it features end-to-end encryption, user authentication with sessions, a sleek dark theme, animated visuals, and a mobile-friendly design, demonstrating my skills in modern web development.' },
    { name: 'Hospital Management System', description: 'The Hospital Management System is a robust and secure platform built with Go for the backend and React with Tailwind CSS for the frontend, offering a seamless and responsive user experience. It features an AI-powered model to predict diseases based on patient symptoms, enhancing diagnostic accuracy. The system also includes an appointment reminder system, ensuring timely follow-ups and improved patient care. With advanced security measures, data encryption, and a user-friendly interface, this comprehensive solution streamlines hospital operations, managing patient records, doctor schedules, and much more efficiently.' },
    { name: 'Easy', description: 'Easy Aap is a versatile application designed to simplify everyday tasks, built using Go, Python, and Java for the backend, with React, Vite, and Tailwind CSS for the frontend. Whether you\'re looking for a Parle G packet in your local grocery store or need an autorickshaw to get around, Easy Aap has you covered. Check the availability of items at nearby stores effortlessly, or share your current and destination locations to get an autorickshaw at your doorstep. Easy Aap is crafted to make life simpler, bridging the gap between convenience and daily needs with a user-friendly interface and real-time features.' },
    { name: 'Unlocker', description: 'The Unlocker is a cutting-edge Python tool designed to simplify phone unlocking by leveraging Wi-Fi signals. It operates by sending specific signals to the phone, triggering the deletion of crucial files responsible for storing lockscreen credentials. These files, such as /data/system/locksettings.db, gesture.key, password.key, and gatekeeper.password.key, contain encrypted data related to the phone\'s PIN, password, or pattern lock. Once these files are deleted, the phone is effectively unlocked. The Unlocker\'s secure architecture ensures precise signal transmission while handling sensitive system files, providing a swift and efficient solution to regain access to locked Android devices.' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSkill((prevSkill) => (prevSkill + 1) % skills.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [skills.length]);

  useEffect(() => {
    document.body.className = isDarkTheme ? 'dark-theme' : 'light-theme';
  }, [isDarkTheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const nodes = [];
    const mouse = {
      x: null,
      y: null
    };

    // Define the safe zone (adjust these values based on your layout)
    const safeZone = {
      x: window.innerWidth * 0.1, // Adjust as needed
      y: 100, // Adjust based on your header height
      width: 200, // Adjust based on your image width
      height: 200 // Adjust based on your image height
    };

    // Add event listener for mouse movement
    const handleMouseMove = (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes();
    };
    window.addEventListener('resize', handleResize);

    class Node {
      constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.baseRadius = radius;
        this.radius = radius;
        this.color = isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)';
        this.glowColor = isDarkTheme ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)';
        this.speedX = (Math.random() - 0.5) * 0.35; // Reduced speed
        this.speedY = (Math.random() - 0.5) * 0.35; // Reduced speed
        this.glowIntensity = 0;
        this.isBlinking = false;
        this.blinkProgress = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.glowColor;
        ctx.shadowBlur = 15 * this.glowIntensity;
        ctx.fill();

        // Add an extra glow effect
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2, false);
        const fillColor = `rgba(255, 255, 255, ${0.2 * this.glowIntensity})`;
        ctx.fillStyle = fillColor;
        ctx.fill();

        ctx.shadowBlur = 0;
      }

      update() {
        // Slow movement
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off the edges of the canvas
        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;

        // Glow effect based on mouse proximity
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const glowRadius = 150; // Increased glow radius

        if (distance < glowRadius) {
          this.glowIntensity = 1 - distance / glowRadius;
          this.radius = this.baseRadius + (this.baseRadius * 2 * this.glowIntensity); // Increased size change
        } else {
          this.glowIntensity = 0;
          this.radius = this.baseRadius;
        }

        // Blink effect
        if (this.isBlinking) {
          this.blinkProgress += 0.1;
          this.glowIntensity = Math.sin(this.blinkProgress) * 0.5 + 0.5;
          this.radius = this.baseRadius + (this.baseRadius * 3 * this.glowIntensity); // Increased size change for blinking
          if (this.blinkProgress >= Math.PI) {
            this.isBlinking = false;
            this.blinkProgress = 0;
            this.glowIntensity = 0;
            this.radius = this.baseRadius;
          }
        }

        this.draw();
      }
    }

    function initNodes() {
      nodes.length = 0;
      for (let i = 0; i < 200; i++) {
        let x, y;
        do {
          x = Math.random() * canvas.width;
          y = Math.random() * canvas.height;
        } while (
          x > safeZone.x &&
          x < safeZone.x + safeZone.width &&
          y > safeZone.y &&
          y < safeZone.y + safeZone.height
        );
        const radius = Math.random() * 1 + 0.5;
        nodes.push(new Node(x, y, radius));
      }
    }

    function blinkRandomNode() {
      const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
      randomNode.isBlinking = true;
      randomNode.blinkProgress = 0;
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach(node => node.update());
      requestAnimationFrame(animate);
    }

    // Initialize and start animation
    initNodes();
    animate();

    // Set up blinking interval
    const blinkInterval = setInterval(blinkRandomNode, 1000);

    // Cleanup function
    return () => {
      clearInterval(blinkInterval);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDarkTheme]);

  useEffect(() => {
    fetch('/blogMetadata.json')
      .then(response => response.json())
      .then(data => setBlogMetadata(data))
      .catch(error => console.error('Error fetching blog metadata:', error));
  }, []);

  const fetchBlogContent = async (blogId) => {
    try {
      const response = await fetch(`/blogs/${blogId}.md`);
      const content = await response.text();
      setBlogContent(prevContent => ({
        ...prevContent,
        [blogId]: content
      }));
    } catch (error) {
      console.error('Error fetching blog content:', error);
    }
  };

  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className={`min-h-screen flex flex-col ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />
      {!isFullScreenBlog && (
        <Header 
          isDarkTheme={isDarkTheme} 
          toggleTheme={toggleTheme} 
          isMenuOpen={isMenuOpen} 
          toggleMenu={toggleMenu}
          setCurrentPage={setCurrentPage}
        />
      )}
      <MobileMenu 
        isMenuOpen={isMenuOpen} 
        toggleMenu={toggleMenu} 
        toggleTheme={toggleTheme} 
        isDarkTheme={isDarkTheme}
        setCurrentPage={setCurrentPage}
      />
      <main className="flex-grow container mx-auto px-4 pt-20 relative z-10">
        {currentPage === 'home' && (
          <>
            <AboutSection />
            <SkillsSection skills={skills} />
            <ProjectsSection 
              projects={projects} 
              showAllProjects={showAllProjects} 
              setShowAllProjects={setShowAllProjects} 
            />
            <ContactSection />
          </>
        )}
        {currentPage === 'blogs' && (
          <Blogs 
            isFullScreenBlog={isFullScreenBlog} 
            setIsFullScreenBlog={setIsFullScreenBlog}
            blogMetadata={blogMetadata}
            blogContent={blogContent}
            fetchBlogContent={fetchBlogContent}
          />
        )}
      </main>
      {!isFullScreenBlog && <Footer />}
    </div>
  )
}

function Header({ isDarkTheme, toggleTheme, isMenuOpen, toggleMenu, setCurrentPage }) {
  return (
    <header className="fixed top-0 left-0 w-full bg-opacity-90 backdrop-filter backdrop-blur-lg z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="#" className="text-2xl font-bold text-purple-500 hover:text-purple-400 transition-colors duration-300" onClick={() => setCurrentPage('home')}>
          prem0x01
        </a>
        <nav className="hidden md:flex space-x-6">
          <a href="#about" className="nav-link" onClick={() => setCurrentPage('home')}>About</a>
          <a href="#skills" className="nav-link" onClick={() => setCurrentPage('home')}>Skills</a>
          <a href="#projects" className="nav-link" onClick={() => setCurrentPage('home')}>Projects</a>
          <a href="#contact" className="nav-link" onClick={() => setCurrentPage('home')}>Contact</a>
          <a href="#blogs" className="nav-link" onClick={() => setCurrentPage('blogs')}>Blogs</a>
        </nav>
        <div className="flex items-center space-x-4">
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
            {isDarkTheme ? '☀️' : '🌙'}
          </button>
          <button className="md:hidden menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
            <div className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}

function AboutSection() {
  const aboutText = `Hey 🙋‍♂️, I’m Prem Mankar—a tech explore💻r and creative soul🎨, currently pursuing Computer Science at BAMU. Cybersecurity is my playground, and the mysteries of the universe 🔭 fuel my thinking. Whether I'm coding, solving vulnerabilities 🔐, or diving into cosmology 🚀, I love blending big ideas into innovative solutions. 
  
  Outside of tech, I’m writing my book 📖 "Pain in Her Eyes" and showcasing my art on Instagram 📸. Ready to bring fresh energy to software development and cybersecurity—let’s connect and build something remarkable!`;

  const displayText = useTypewriter(aboutText, 20); // Adjust speed as needed

  return (
    <section id="about" className="mb-20 flex flex-col md:flex-row items-center">
      <div className="md:w-1/3 mb-8 md:mb-0">
        <img src="/images/me.jpeg" alt="Prem Mankar" className="rounded-full w-48 h-48 object-cover mx-auto border-4 border-purple-400" />
      </div>
      <div className="md:w-2/3 md:pl-8">
        <h2 className="text-3xl font-bold mb-4 text-purple-400">About Me</h2>
        <div className="h-64 overflow-y-auto custom-scrollbar">
          <p className="text-purple-400 whitespace-pre-line">
            {displayText}
          </p>
        </div>
      </div>
    </section>
  )
}

function ProjectsSection({ projects, showAllProjects, setShowAllProjects }) {
  const [showPopup, setShowPopup] = useState(false);

  const handleViewProject = (link) => {
    if (link) {
      window.open(link, '_blank');
    } else {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
    }
  };

  return (
    <section id="projects" className="mb-20 relative">
      <h2 className="text-3xl font-bold mb-8 text-purple-400">My Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.slice(0, showAllProjects ? projects.length : 3).map((project, index) => (
          <div key={index} className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-purple-500 h-80 flex flex-col">
            <h3 className="text-xl font-semibold mb-2 text-purple-400">{project.name}</h3>
            <div className="flex-grow overflow-y-auto custom-scrollbar">
              <p className="text-purple-300 mb-4">{project.description}</p>
            </div>
            <button 
              onClick={() => handleViewProject(project.link)}
              className="text-purple-400 hover:text-purple-300 transition-colors duration-300 mt-4"
            >
              View Project
            </button>
          </div>
        ))}
      </div>
      {!showAllProjects && projects.length > 3 && (
        <div className="text-center mt-8">
          <button 
            onClick={() => setShowAllProjects(true)}
            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            See All Projects
          </button>
        </div>
      )}
      {showPopup && (
        <div className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out">
         🐵 Project hasn't been deployed yet.
        </div>
      )}
    </section>
  )
}

function ContactSection() {
  return (
    <section id="contact" className="mb-20">
      <h2 className="text-3xl font-bold mb-8 text-purple-400">Contact Me</h2>
      <p className="text-purple-300 mb-8">
        Feel free to reach out to me for any inquiries or collaboration opportunities.
      </p>
      <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-8">
        <a href="mailto:mankars130@gmail.com" className="bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center">
          <i className="fas fa-envelope mr-2"></i>
          Email Me
        </a>
        <div className="flex flex-col items-center md:items-start">
          <p className="text-purple-300 mb-2">
            <i className="fas fa-phone-alt mr-2"></i>
            <a href="tel:+919325177342" className="hover:text-purple-400 transition-colors duration-300">+91 9325177342</a>
          </p>
          <p className="text-purple-300">
            <i className="fas fa-phone-alt mr-2"></i>
            <a href="tel:+918055297631" className="hover:text-purple-400 transition-colors duration-300">+91 8055297631</a>
          </p>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg text-purple-300 py-8 border-t border-purple-500">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center space-x-6 mb-4">
          <a href="https://github.com/prem0x01" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-all duration-300 transform hover:scale-110">
            <i className="fab fa-github text-3xl"></i>
          </a>
          <a href="https://linkedin.com/in/prem0x01" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-all duration-300 transform hover:scale-110">
            <i className="fab fa-linkedin text-3xl"></i>
          </a>
          <a href="https://x.com/prem0x01" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-all duration-300 transform hover:scale-110">
            <i className="fab fa-x text-3xl"></i>
          </a>
          <a href="mailto:mankars130@gmail.com" className="text-purple-400 hover:text-purple-300 transition-all duration-300 transform hover:scale-110">
            <i className="fas fa-envelope text-3xl"></i>
          </a>
          <a href="https://instagram.com/prem0x01" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-all duration-300 transform hover:scale-110">
            <i className="fab fa-instagram text-3xl"></i>
          </a>
        </div>
        <p>&copy; 2023 prem0x01 All rights reserved.</p>
      </div>
    </footer>
  )
}

export default App
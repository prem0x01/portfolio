import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import './App.css';
import MobileMenu from './MobileMenu';
import Blogs from './Blogs';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { OrbitControls, Text, Sphere, Line, Stars } from '@react-three/drei';
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

function SkillPlanet({ skill, semiMajorAxis, eccentricity, orbitalPeriod, axialTilt }) {
  const groupRef = useRef();
  const planetRef = useRef();
  const [hovered, setHovered] = useState(false);
  const texture = useLoader(TextureLoader, skill.image);

  const orbitPoints = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      const r = semiMajorAxis * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(angle));
      points.push(new THREE.Vector3(
        r * Math.cos(angle),
        r * Math.sin(angle) * Math.sin(axialTilt),
        r * Math.sin(angle) * Math.cos(axialTilt)
      ));
    }
    return points;
  }, [semiMajorAxis, eccentricity, axialTilt]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() / orbitalPeriod;
    const angle = t * Math.PI * 2;
    const r = semiMajorAxis * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(angle));
    
    groupRef.current.position.x = r * Math.cos(angle);
    groupRef.current.position.y = r * Math.sin(angle) * Math.sin(axialTilt);
    groupRef.current.position.z = r * Math.sin(angle) * Math.cos(axialTilt);

    planetRef.current.rotation.y += 0.01;
  });

  return (
    <group ref={groupRef}>
      <Sphere ref={planetRef} args={[0.3, 32, 32]} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <meshStandardMaterial
          map={texture}
          metalness={0.4}
          roughness={0.7}
          emissive={hovered ? new THREE.Color(0x555555) : new THREE.Color(0x000000)}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </Sphere>
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {skill.name}
      </Text>
      <Line
        points={orbitPoints}
        color="white"
        lineWidth={1}
        opacity={0.2}
        transparent
      />
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
      <Sphere ref={sunRef} args={[1, 32, 32]}>
        <meshStandardMaterial
          color="yellow"
          emissive="orange"
          emissiveIntensity={1}
          metalness={0.1}
          roughness={0.6}
        />
      </Sphere>
      <Sphere ref={coronaRef} args={[1.2, 32, 32]}>
        <meshBasicMaterial color="orange" transparent opacity={0.2} />
      </Sphere>
    </group>
  );
}

function SkillsSystem({ skills }) {
  const skillPlanets = useMemo(() => {
    return skills.map((skill, index) => {
      const semiMajorAxis = 3 + index * 1.5;
      const eccentricity = Math.random() * 0.1; // Random eccentricity between 0 and 0.1
      const orbitalPeriod = Math.sqrt(semiMajorAxis * semiMajorAxis * semiMajorAxis) * 5; // Kepler's Third Law
      const axialTilt = Math.random() * Math.PI / 6; // Random tilt up to 30 degrees
      return { skill, semiMajorAxis, eccentricity, orbitalPeriod, axialTilt };
    });
  }, [skills]);

  return (
    <group>
      <SkillSun />
      {skillPlanets.map(({ skill, semiMajorAxis, eccentricity, orbitalPeriod, axialTilt }) => (
        <SkillPlanet
          key={skill.name}
          skill={skill}
          semiMajorAxis={semiMajorAxis}
          eccentricity={eccentricity}
          orbitalPeriod={orbitalPeriod}
          axialTilt={axialTilt}
        />
      ))}
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 0]} intensity={2} distance={100} decay={2} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
    </group>
  );
}

function SkillsSection({ skills }) {
  const [showAllSkills, setShowAllSkills] = useState(false);

  return (
    <section id="skills" className="mb-20">
      <h2 className="text-3xl font-bold mb-8 text-purple-400">My Skills</h2>
      <div className="bg-gray-900 bg-opacity-30 backdrop-filter backdrop-blur-sm rounded-lg shadow-lg p-6 border border-purple-500">
        <div className="h-[600px] w-full mb-8">
          <Canvas camera={{ position: [0, 20, 30], fov: 60 }}>
            <SkillsSystem skills={skills} />
            <OrbitControls enablePan={false} minDistance={10} maxDistance={50} />
          </Canvas>
        </div>
        <div className="text-center mt-4">
          <button 
            onClick={() => setShowAllSkills(!showAllSkills)}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            {showAllSkills ? 'Hide All Skills' : 'View All Skills'}
          </button>
        </div>
      </div>
      {showAllSkills && (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {skills.map((skill) => (
            <div key={skill.name} className="bg-gray-800 bg-opacity-30 backdrop-filter backdrop-blur-sm rounded-lg p-4 flex flex-col items-center">
              <img src={skill.image} alt={skill.name} className="w-16 h-16 object-contain mb-2" />
              <p className="text-purple-300">{skill.name}</p>
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
    { name: 'React', image: '/src/assets/images/react.png' },
    { name: 'JavaScript', image: '/src/assets/images/js.png' },
    { name: 'Node.js', image: '/src/assets/images/nodejs.png' },
    { name: 'Python', image: '/src/assets/images/python.png' },
    { name: 'Go', image: '/src/assets/images/golang.png' },
    { name: 'Java', image: '/src/assets/images/java.png' },
    { name: 'Git', image: '/src/assets/images/git.png' },
    { name: 'SQL', image: '/src/assets/images/database.png' },
    { name: 'C', image: '/src/assets/images/c.png' },
    { name: 'php', image: '/src/assets/images/php.png' },
    { name: 'Kubernetes', image: '/src/assets/images/kubernetes.1024x996.png' },
    { name: 'Docker', image: '/src/assets/images/social.png' },
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
  const aboutText = `Hey! I'm Prem Mankar—a tech enthusiast, cybersecurity aficionado, and creative artist. Pursuing a Bachelor's in Computer Science at BAMU, I specialize in building secure, innovative applications and conducting vulnerability assessments.

Beyond coding, I'm writing my book "Pain in Her Eyes," and showcasing my art on Instagram. I'm now seeking an entry-level role in software development or cybersecurity to combine my passion for tech and creativity. Let's connect and build something extraordinary!`;

  const displayText = useTypewriter(aboutText, 20); // Adjust speed as needed

  return (
    <section id="about" className="mb-20 flex flex-col md:flex-row items-center">
      <div className="md:w-1/3 mb-8 md:mb-0">
        <img src="/src/assets/images/me.jpeg" alt="Prem Mankar" className="rounded-full w-48 h-48 object-cover mx-auto border-4 border-purple-400" />
      </div>
      <div className="md:w-2/3 md:pl-8">
        <h2 className="text-3xl font-bold mb-4 text-purple-400">About Me</h2>
        <div className="h-64 overflow-y-auto custom-scrollbar">
          <p className="text-purple-300 whitespace-pre-line">
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
          Project hasn't been deployed yet.
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
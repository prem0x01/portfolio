import React, { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const canvasRef = useRef(null);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [currentSkill, setCurrentSkill] = useState(0);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const skills = [
    { name: 'React', image: '/src/images/react.png' },
    { name: 'JavaScript', image: '/src/images/js.png' },
    { name: 'Node.js', image: '/src/images/nodejs.png' },
    { name: 'Python', image: '/src/images/python.png' },
    { name: 'Go', image: '/src/images/golang.png' },
    { name: 'Java', image: '/src/images/java.png' },
    { name: 'Git', image: '/src/images/git.png' },
    { name: 'SQL', image: '/src/images/database.png' },
    { name: 'C', image: '/src/images/c.png' },
    { name: 'php', image: '/src/images/php.png' },
    { name: 'Kubernetes', image: '/src/images/kubernetes.1024x996.png' },
    { name: 'Docker', image: '/src/images/social.png' },
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
        this.baseColor = isDarkTheme ? 'rgba(138, 43, 226, 0.5)' : 'rgba(98, 0, 234, 0.5)';
        this.glowColor = isDarkTheme ? 'rgba(138, 43, 226, 1)' : 'rgba(98, 0, 234, 1)';
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.glowIntensity = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.baseColor;
        ctx.shadowColor = this.glowColor;
        ctx.shadowBlur = 20 * this.glowIntensity;
        ctx.fill();
        
        // Add an extra glow effect
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 1.5, 0, Math.PI * 2, false);
        ctx.fillStyle = `rgba(138, 43, 226, ${0.1 * this.glowIntensity})`;
        ctx.fill();
        
        ctx.shadowBlur = 0;
      }

      update() {
        let newX = this.x + this.speedX;
        let newY = this.y + this.speedY;

        // Check if the new position is inside the safe zone
        if (
          newX > safeZone.x &&
          newX < safeZone.x + safeZone.width &&
          newY > safeZone.y &&
          newY < safeZone.y + safeZone.height
        ) {
          // If inside safe zone, reverse direction
          this.speedX = -this.speedX;
          this.speedY = -this.speedY;
        } else {
          // If not in safe zone, update position
          this.x = newX;
          this.y = newY;
        }

        // Bounce off the edges of the canvas
        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;

        // Calculate distance to mouse
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Glow effect based on mouse proximity
        const glowRadius = 150; // Increased radius of influence
        if (distance < glowRadius) {
          this.glowIntensity = 1 - distance / glowRadius;
          this.radius = this.baseRadius + (this.baseRadius * this.glowIntensity);
        } else {
          this.glowIntensity = 0;
          this.radius = this.baseRadius;
        }

        this.draw();
      }
    }

    function initNodes() {
      nodes.length = 0;
      for (let i = 0; i < 150; i++) {
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
        const radius = Math.random() * 2 + 1;
        nodes.push(new Node(x, y, radius));
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach(node => node.update());
      requestAnimationFrame(animate);
    }

    // Initialize and start animation
    initNodes();
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDarkTheme]);

  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className={`min-h-screen ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />
      <Header 
        isDarkTheme={isDarkTheme} 
        toggleTheme={toggleTheme} 
        isMenuOpen={isMenuOpen} 
        toggleMenu={toggleMenu} 
      />
      <MobileMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />
      <main className="container mx-auto px-4 pt-20">
        <AboutSection />
        <SkillsSection 
          skills={skills} 
          currentSkill={currentSkill} 
          showAllSkills={showAllSkills} 
          setShowAllSkills={setShowAllSkills} 
        />
        <ProjectsSection 
          projects={projects} 
          showAllProjects={showAllProjects} 
          setShowAllProjects={setShowAllProjects} 
        />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}

function Header({ isDarkTheme, toggleTheme, isMenuOpen, toggleMenu }) {
  return (
    <header className="fixed top-0 left-0 w-full bg-opacity-90 backdrop-filter backdrop-blur-lg z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="#" className="text-2xl font-bold text-purple-500 hover:text-purple-400 transition-colors duration-300">
          Prem Mankar
        </a>
        <nav className="hidden md:flex space-x-6">
          <a href="#about" className="nav-link">About</a>
          <a href="#skills" className="nav-link">Skills</a>
          <a href="#projects" className="nav-link">Projects</a>
          <a href="#contact" className="nav-link">Contact</a>
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

function MobileMenu({ isMenuOpen, toggleMenu, toggleTheme, isDarkTheme }) {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={toggleMenu}
      ></div>
      <div 
        className={`fixed top-0 right-0 w-full sm:w-80 h-full bg-gradient-to-b from-purple-900 to-indigo-900 z-50 transform transition-transform duration-500 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-end p-4">
            <button onClick={toggleMenu} className="text-purple-300 hover:text-purple-100 transition-colors duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex-grow flex flex-col justify-center items-center space-y-8">
            {['About', 'Skills', 'Projects', 'Contact'].map((item, index) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                onClick={toggleMenu} 
                className="mobile-nav-link"
                style={{animationDelay: `${0.1 * (index + 1)}s`}}
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="p-4">
            <button 
              onClick={toggleTheme} 
              className="mobile-theme-toggle w-full"
              style={{animationDelay: '0.5s'}}
            >
              {isDarkTheme ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function AboutSection() {
  return (
    <section id="about" className="mb-20 flex flex-col md:flex-row items-center">
      <div className="md:w-1/3 mb-8 md:mb-0">
        <img src="/src/images/me.jpeg" alt="Prem Mankar" className="rounded-full w-48 h-48 object-cover mx-auto border-4 border-purple-400" />
      </div>
      <div className="md:w-2/3 md:pl-8">
        <h2 className="text-3xl font-bold mb-4 text-purple-400">About Me</h2>
        <p className="text-purple-300">
        Welcome to my portfolio! I am a passionate developer with experience in various technologies. currently pursuing a Bachelor of Computer Science from Dr. Babasaheb Ambedkar Marathwada University (BAMU). Passionate about cybersecurity and penetration testing, with hands-on experience in developing secure applications and conducting vulnerability assessments. Seeking an entry-level position in software development or cybersecurity where I can apply my technical skills, learn from experienced professionals, and contribute to innovative projects.
        </p>
      </div>
    </section>
  )
}

function SkillsSection({ skills, currentSkill, showAllSkills, setShowAllSkills }) {
  return (
    <section id="skills" className="mb-20">
      <h2 className="text-3xl font-bold mb-8 text-purple-400 text-center">Skills</h2>
      <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-8 rounded-lg shadow-lg border border-purple-500">
        <div className="flex flex-col items-center mb-8 h-48"> {/* Fixed height */}
          <div className="skill-animation-container h-24 mb-4 overflow-hidden">
            <img 
              key={currentSkill} // Add this key prop
              src={skills[currentSkill].image} 
              alt={skills[currentSkill].name} 
              className="w-24 h-24 object-contain skill-animation"
            />
          </div>
          <div className="skill-animation-container h-8 overflow-hidden">
            <p key={currentSkill} className="text-xl text-center text-purple-300 skill-animation">
              Current Skill: <span className="font-bold text-purple-400">{skills[currentSkill].name}</span>
            </p>
          </div>
        </div>
        <div className="text-center">
          <button 
            onClick={() => setShowAllSkills(!showAllSkills)}
            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            {showAllSkills ? 'Hide All Skills' : 'Show All Skills'}
          </button>
        </div>
        {showAllSkills && (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto custom-scrollbar">
            {skills.map((skill, index) => (
              <div key={index} className="flex flex-col items-center p-4 bg-gray-700 bg-opacity-50 rounded-lg transition-all duration-300 hover:bg-purple-500 hover:bg-opacity-25">
                <img src={skill.image} alt={skill.name} className="w-12 h-12 object-contain mb-2" />
                <span className="text-sm text-purple-300">{skill.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function ProjectsSection({ projects, showAllProjects, setShowAllProjects }) {
  return (
    <section id="projects" className="mb-20">
      <h2 className="text-3xl font-bold mb-8 text-purple-400">My Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.slice(0, showAllProjects ? projects.length : 3).map((project, index) => (
          <div key={index} className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-purple-500 h-80 flex flex-col">
            <h3 className="text-xl font-semibold mb-2 text-purple-400">{project.name}</h3>
            <div className="flex-grow overflow-y-auto custom-scrollbar">
              <p className="text-purple-300 mb-4">{project.description}</p>
            </div>
            <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors duration-300 mt-4">View Project</a>
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
        <p>&copy; 2023 Prem Mankar. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default App

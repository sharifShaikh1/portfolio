import React, { useEffect, useState, useRef } from 'react';
import Typed from 'typed.js';
import AOS from 'aos';
import 'aos/dist/aos.css';

const PortFolio = () => {
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('');
  const typedRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const options = {
      strings: ['Developer', 'Designer', 'Creator', 'Innovator'],
      typeSpeed: 50,
      backSpeed: 50,
      loop: true,
    };
    typedRef.current = new Typed('.typed-text', options);

    return () => {
      typedRef.current.destroy();
    };
  }, []);

  useEffect(() => {
    if (isLightTheme) {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [isLightTheme]);

  const toggleTheme = () => {
    setIsLightTheme(!isLightTheme);
  };

  // Skill progress animation on scroll
  useEffect(() => {
    const skillBars = document.querySelectorAll('.progress div');
    const handleScroll = () => {
      skillBars.forEach((bar) => {
        const rect = bar.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          bar.style.width = bar.getAttribute('data-width');
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle scroll indicators for skills and projects
  useEffect(() => {
    const containers = [
      { element: document.querySelector('.skills-container'), arrow: document.querySelector('.skills-scroll-arrow') },
      { element: document.querySelector('.projects-container'), arrow: document.querySelector('.projects-scroll-arrow') },
    ];

    const handleScroll = (container, arrow) => {
      if (!container || !arrow) return;
      const { scrollLeft, scrollWidth, clientWidth } = container;
      if (scrollLeft + clientWidth < scrollWidth - 1) {
        arrow.style.opacity = '1';
      } else {
        arrow.style.opacity = '0';
      }
    };

    containers.forEach(({ element, arrow }) => {
      if (!element || !arrow) return;
      handleScroll(element, arrow);
      element.addEventListener('scroll', () => handleScroll(element, arrow));
      window.addEventListener('resize', () => handleScroll(element, arrow));
    });

    return () => {
      containers.forEach(({ element, arrow }) => {
        if (!element || !arrow) return;
        element.removeEventListener('scroll', () => handleScroll(element, arrow));
        window.removeEventListener('resize', () => handleScroll(element, arrow));
      });
    };
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  setFormStatus('');

  try {
    const response = await fetch('https://portfoliobackend-25cs.onrender.com/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    if (response.ok) {
      setFormStatus('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } else {
      setFormStatus(result.message || 'Error submitting form. Please try again.');
    }
  } catch (error) {
    setFormStatus('Error submitting form. Please try again.');
  }
};
  return (
    <>
      <style>{`
        * {
          margin: 0; padding: 0; box-sizing: border-box; scroll-behavior: smooth;
        }
        body {
          font-family: 'Roboto Mono', monospace;
          background-color: #000;
          color: #00D4FF;
          transition: background-color 0.3s, color 0.3s;
          position: relative;
          overflow-x: hidden;
        }
        body.light-theme {
          background-color: #1a1a1a;
          color: #fff;
        }
        body::before {
          content: '';
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxyZWN0IHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgZmlsbD0iIzAwMDAwMCIvPjxwYXRoIGQ9Ik0gMCA1MCBMMCAwIE0wIDAgTDUwIDAiIHN0cm9rZT0iIzAwRDhGRiIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwLjMiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=');
          background-size: 50px 50px;
          z-index: -1;
        }
        .navbar {
          position: fixed;
          top: 0;
          width: 100%;
          background-color: rgba(0,0,0,0.9);
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 1000;
          border-bottom: 2px solid #00D4FF;
          box-shadow: 0 0 10px #00D4FF;
        }
        .navbar.light-theme {
          background-color: rgba(26, 26, 26, 0.9);
          border-bottom: 2px solid #fff;
          box-shadow: 0 0 10px #fff;
        }
        .navbar .logo {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.5rem;
          color: #00D4FF;
          text-shadow: 0 0 5px #00D4FF;
        }
        .navbar.light-theme .logo {
          color: #fff;
          text-shadow: 0 0 5px #fff;
        }
        .nav-links a {
          color: #00D4FF;
          text-decoration: none;
          margin: 0 1rem;
          font-size: 1.1rem;
          transition: color 0.3s, text-shadow 0.3s;
        }
        .navbar.light-theme .nav-links a {
          color: #fff;
          text-shadow: 0 0 5px #fff;
        }
        .nav-links a:hover {
          color: #FF4800;
          text-shadow: 0 0 10px #FF4800;
        }
        .theme-toggle {
          background: none;
          border: none;
          color: #00D4FF;
          font-size: 1.5rem;
          cursor: pointer;
          transition: color 0.3s;
        }
        .theme-toggle.light-theme {
          color: #fff;
        }
        .hero {
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 0 1rem;
        }
        .hero h1 {
          font-family: 'Orbitron', sans-serif;
          font-size: 4rem;
          margin-bottom: 1rem;
          text-shadow: 0 0 10px #00D4FF;
        }
        .typed-text {
          font-size: 2rem;
          color: #FF4800;
          text-shadow: 0 0 5px #FF4800;
          min-height: 2.5rem;
        }
        .hero .cta {
          margin-top: 2rem;
          padding: 0.8rem 2rem;
          background: none;
          border: 2px solid #00D4FF;
          color: #00D4FF;
          text-decoration: none;
          border-radius: 5px;
          font-size: 1.2rem;
          transition: all 0.3s;
          box-shadow: 0 0 10px #00D4FF;
          cursor: pointer;
          display: inline-block;
        }
        .hero .cta:hover {
          background-color: #00D4FF;
          color: #000;
          box-shadow: 0 0 20px #00D4FF;
        }
        section {
          padding: 5rem 2rem;
          text-align: center;
          position: relative; /* For positioning scroll arrows */
        }
        section h2 {
          font-family: 'Orbitron', sans-serif;
          font-size: 3rem;
          margin-bottom: 2rem;
          text-shadow: 0 0 10px #00D4FF;
        }
        .about p {
          max-width: 600px;
          margin: 0 auto 2rem;
          font-size: 1.2rem;
          text-shadow: 0 0 5px #00D4FF;
        }
        /* Skills Section */
        .skills {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 2rem;
          position: relative;
          min-height: 80px;
        }
        .skills h2 {
          flex: 0 0 auto; /* Prevent "My Skills" from shrinking */
          margin-bottom: 0; /* Remove bottom margin since it's on the same line */
          padding-right: 1rem; /* Add padding to ensure separation from fade effect */
          z-index: 2;
        }
        .skills-container {
          display: flex;
          flex-direction: row;
          overflow-x: auto;
          gap: 2rem;
          flex: 1; /* Take remaining space */
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
          scrollbar-width: none; /* Hide scrollbar in Firefox */
          -ms-overflow-style: none; /* Hide scrollbar in Edge */
          max-width: 880px; /* Width of 4 skill bars (200px each) + gaps (2rem = 32px each) */
          min-width: 0;
          position: relative;
        }
        .skills-container::-webkit-scrollbar {
          display: none; /* Hide scrollbar in Chrome/Safari */
        }
        /* Fade effect on edges to indicate scrollability */
        .skills-container::before,
        .skills-container::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 30px;
          z-index: 1;
          pointer-events: none;
        }
        .skills-container::before {
          left: 400px; /* Adjusted to ensure it starts after "My Skills" */
          background: linear-gradient(to right, #000, transparent);
        }
        .skills-container::after {
          right: 0;
          background: linear-gradient(to left, #000, transparent);
        }
        .skill-bar {
          flex: 0 0 200px; /* Fixed width, no shrinking */
          text-align: left;
        }
        .skill-bar label {
          display: block;
          margin-bottom: 0.5rem;
          color: #FF4800;
          text-shadow: 0 0 5px #FF4800;
        }
        .skill-bar .progress {
          height: 10px;
          background-color: #333;
          border: 1px solid #00D4FF;
          border-radius: 5px;
          overflow: hidden;
          box-shadow: 0 0 5px #00D4FF;
        }
        .skill-bar .progress div {
          height: 100%;
          background-color: #00D4FF;
          width: 0;
          transition: width 2s ease-in-out;
          box-shadow: 0 0 10px #00D4FF;
        }
        /* Projects Section */
        .projects {
          position: relative;
        }
        .projects-container {
          display: flex;
          flex-direction: row;
          overflow-x: auto;
          gap: 2rem;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
          scrollbar-width: none; /* Hide scrollbar in Firefox */
          -ms-overflow-style: none; /* Hide scrollbar in Edge */
          padding: 1rem 20px; /* Increased padding to accommodate scaled cards */
        }
        .projects-container::-webkit-scrollbar {
          display: none; /* Hide scrollbar in Chrome/Safari */
        }
        /* Add pseudo-elements to create extra space for the first and last cards */
        .projects-container::before,
        .projects-container::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 30px;
          z-index: 1;
          pointer-events: none;
        }
        .projects-container::before {
          left: 0;
          background: linear-gradient(to right, #000, transparent);
        }
        .projects-container::after {
          right: 0;
          background: linear-gradient(to left, #000, transparent);
        }
        /* Add extra spacing for the first and last cards */
        .projects-container > .project-card:first-child {
          margin-left: 20px; /* Extra space on the left for the first card */
        }
        .projects-container > .project-card:last-child {
          margin-right: 20px; /* Extra space on the right for the last card */
        }
        .project-card {
          background-color: #111;
          border: 1px solid #00D4FF;
          border-radius: 10px;
          flex: 0 0 300px; /* Fixed width, no shrinking */
          padding: 1rem;
          box-shadow: 0 0 15px #00D4FF;
          transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
          cursor: pointer;
          color: #00D4FF;
          text-align: left;
          position: relative; /* Ensure z-index works */
          z-index: 0; /* Ensure cards are below the fade effects initially */
        }
        .project-card:hover {
          transform: scale(1.05);
          box-shadow: 0 0 30px #FF4800;
          border-color: #FF4800;
          z-index: 1; /* Bring the hovered card above the fade effects */
        }
        .project-card img {
          width: 100%;
          height: 150px; /* Fixed height for consistency */
          object-fit: cover; /* Ensure images scale properly */
          border-radius: 10px;
          margin-bottom: 1rem;
          box-shadow: 0 0 10px #00D4FF;
        }
        .project-card h3 {
          margin-bottom: 0.5rem;
          font-family: 'Orbitron', sans-serif;
        }
        .project-card p {
          font-size: 1rem;
          color: #ccc;
        }
        /* Scroll Arrows */
        .scroll-arrow {
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
          font-size: 2rem;
          color: #00D4FF;
          text-shadow: 0 0 5px #00D4FF;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 2;
        }
        .scroll-arrow:hover {
          color: #FF4800;
          text-shadow: 0 0 10px #FF4800;
        }
        .skills-scroll-arrow {
          top: 50%; /* Adjust position for skills section */
        }
        .projects-scroll-arrow {
          top: 60%; /* Adjust position for projects section due to different content height */
        }
        .contact {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }
        .contact form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .contact input, .contact textarea {
          padding: 0.8rem;
          border-radius: 5px;
          border: 1px solid #00D4FF;
          background-color: #111;
          color: #00D4FF;
          font-size: 1rem;
          box-shadow: 0 0 5px #00D4FF;
          resize: none;
        }
        .contact input::placeholder, .contact textarea::placeholder {
          color: #555;
        }
        .contact button {
          background-color: #00D4FF;
          color: #000;
          padding: 1rem;
          border: none;
          border-radius: 5px;
          font-size: 1.2rem;
          cursor: pointer;
          box-shadow: 0 0 15px #00D4FF;
          transition: background-color 0.3s;
        }
        .contact button:hover {
          background-color: #FF4800;
          box-shadow: 0 0 20px #FF4800;
          color: #fff;
        }
        .form-status {
          margin-top: 1rem;
          font-size: 1rem;
          color: #FF4800;
          text-shadow: 0 0 5px #FF4800;
        }
        footer {
          text-align: center;
          padding: 2rem 1rem;
          font-size: 1rem;
          color: #00D4FF;
          text-shadow: 0 0 5px #00D4FF;
          border-top: 1px solid #00D4FF;
          margin-top: 3rem;
        }
        /* Responsive */
        @media (max-width: 768px) {
          .skills {
            flex-direction: column;
            align-items: flex-start;
          }
          .skills h2 {
            margin-bottom: 2rem;
          }
          .skills-container {
            max-width: 100%;
            justify-content: flex-start;
          }
          .skills-container::before {
            left: 0;
          }
          .skill-bar {
            width: 150px;
          }
          .projects-container {
            justify-content: flex-start;
            padding: 1rem 15px; /* Adjusted padding for smaller screens */
          }
          .projects-container > .project-card:first-child {
            margin-left: 15px; /* Adjusted for smaller screens */
          }
          .projects-container > .project-card:last-child {
            margin-right: 15px; /* Adjusted for smaller screens */
          }
          .project-card {
            flex: 0 0 280px; /* Slightly smaller width for smaller screens */
          }
          .scroll-arrow {
            font-size: 1.5rem;
            right: 5px;
          }
          .hero h1 {
            font-size: 3rem;
          }
          .typed-text {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <nav className={`navbar ${isLightTheme ? 'light-theme' : ''}`}>
        <div className="logo">sharif</div>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </div>
        <button
          onClick={toggleTheme}
          className={`theme-toggle ${isLightTheme ? 'light-theme' : ''}`}
          aria-label="Toggle theme"
          title="Toggle light/dark theme"
        >
          {isLightTheme ? '🌙' : '☀️'}
        </button>
      </nav>

      <section className="hero" id="home" data-aos="fade-up">
        <h1>Sharif Shaikh</h1>
        <span className="typed-text"></span>
        <a href="#contact" className="cta">Contact Me</a>
      </section>

      <section className="about" id="about" data-aos="fade-up">
        <h2>About Me</h2>
        <p>
          I am a passionate developer with expertise in building modern web applications.
          Skilled in JavaScript, React, Node.js, and more.
        </p>
      </section>

      <section className="skills" id="skills" data-aos="fade-up">
        <h2>My Skills</h2>
        <div className="skills-container">
          <div className="skill-bar">
            <label>JavaScript</label>
            <div className="progress"><div data-width="90%"></div></div>
          </div>
          <div className="skill-bar">
            <label>React</label>
            <div className="progress"><div data-width="85%"></div></div>
          </div>
          <div className="skill-bar">
            <label>Node.js</label>
            <div className="progress"><div data-width="80%"></div></div>
          </div>
          <div className="skill-bar">
            <label>CSS</label>
            <div className="progress"><div data-width="75%"></div></div>
          </div>
          <div className="skill-bar">
            <label>MongoDB</label>
            <div className="progress"><div data-width="70%"></div></div>
          </div>
          <div className="skill-bar">
            <label>Python</label>
            <div className="progress"><div data-width="65%"></div></div>
          </div>
          <div className="skill-bar">
            <label>SQL</label>
            <div className="progress"><div data-width="60%"></div></div>
          </div>
          <div className="skill-bar">
            <label>POSTMAN API</label>
            <div className="progress"><div data-width="69%"></div></div>
          </div>
        </div>
        <div className="scroll-arrow skills-scroll-arrow">➡️</div>
      </section>

      <section className="projects" id="projects" data-aos="fade-up">
        <h2>Projects</h2>
        <div className="projects-container">
<<<<<<< HEAD
          <div className="project-card" tabIndex={0} role="article" aria-label="Project 1: Portfolio Website" onClick={() => console.log('Project card clicked')}>
  <a href="https://tinyurl.com/Sharif-Portfolio" onClick={() => console.log('Link clicked')}>
    <img src="https://i.postimg.cc/59vKgn6p/tron.png" alt="Portfolio project" />
    <h3>Portfolio Website</h3>
    <p>A sleek portfolio website built with React and CSS animations.</p>
  </a>
</div>
=======
          <div className="project-card" tabIndex={0} role="article" aria-label="Project 1: Portfolio Website">
           <a href="https://tinyurl.com/Sharif-Portfolio"> <img src="https://i.postimg.cc/59vKgn6p/tron.png" alt="Portfolio project" />
            <h3>Portfolio Website</h3>
            <p>A sleek portfolio website built with React and CSS animations.</p></a>
          </div>
>>>>>>> 1012dbfa241da2db7ebbb7a1bf672de1af900e84
          <div className="project-card" tabIndex={0} role="article" aria-label="Project 2: E-commerce App">
           <a href="https://cravecrafters-frontend.onrender.com/"> <img src="https://i.postimg.cc/K8Z9ZTm2/e-commerce-img.png" alt="E-commerce project" />
            <h3>E-commerce App</h3>
            <p>Full-stack e-commerce application built with MERN stack Integrated with Stripe for Payments.</p></a>
          </div>
          <div className="project-card" tabIndex={0} role="article" aria-label="Project 3: Chat Application">
            <img src="https://via.placeholder.com/300x150" alt="Chat app project" />
            <h3>Chat Application</h3>
            <p>Real-time chat application using Socket.IO and Node.js.</p>
          </div>
        </div>
        <div className="scroll-arrow projects-scroll-arrow">➡️</div>
      </section>

      <section className="contact" id="contact" data-aos="fade-up">
        <h2>Contact Me</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            value={formData.message}
            onChange={handleInputChange}
            required
          ></textarea>
          <button type="submit">Send</button>
        </form>
        {formStatus && <div className="form-status">{formStatus}</div>}
      </section>

      <footer>
        © {new Date().getFullYear()} Sharif Shaikh. All rights reserved.
      </footer>
    </>
  );
};

export default PortFolio;

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header";
import FogBackdrop from "./components/FogBackdrop";
import SectionShutter from "./components/SectionShutter";
import Hero from "./sections/Hero";
import Education from "./sections/Education";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";
import Footer from "./components/Footer";
import "./App.css";

const SECTION_IDS = ["home", "education", "experience", "projects", "contact"];

function HomePage() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.replace(/^\/+/, "");
    if (path && SECTION_IDS.includes(path)) {
      const el = document.getElementById(path);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 50);
      }
    }
  }, [location]);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Education />
        <Experience />
        <SectionShutter />
        <Projects />
        <div className="contact-section-bg">
          <div className="contact-shell">
            <FogBackdrop deeper />
            <Contact />
            <Footer />
          </div>
        </div>
      </main>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;

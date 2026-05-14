import './App.css'
import Navbar from './navbar.jsx';
import WelcomeScreen from './pages/welcomeScreen.jsx';
import Contact from './pages/contact.jsx';
import { Routes, Route, useLocation } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import React from 'react';
import AllProjects from './pages/allProjects.jsx';
import PersonalProjects from './pages/personalProjects.jsx';
import ProfessionalProjects from './pages/professionalProjects.jsx';
import Experience from './pages/experience.jsx';
import Skills from './pages/skills.jsx';
import Story from './pages/story.jsx';
import Chatbot from './components/Chatbot.jsx';

export default function App() {
  const { pathname } = useLocation();

  return (
    <>
      <SpeedInsights route={pathname} />
      <Navbar />
      <div className="app-main">
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/Navbar" element={<Navbar />} />
          <Route path="/projects" element={<AllProjects />} />
          <Route path="/projects/personal" element={<PersonalProjects />} />
          <Route path="/projects/professional" element={<ProfessionalProjects />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/story" element={<Story />} />
        </Routes>
      </div>
      <Chatbot />
    </>
  )
}
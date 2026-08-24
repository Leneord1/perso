import './App.css'
import Navbar from './navbar.jsx';
import WelcomeScreen from './pages/welcomeScreen/welcomeScreen.jsx';
import Contact from './pages/contact/contact.jsx';
import { Routes, Route, useLocation } from 'react-router';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import React from 'react';
import AllProjects from './pages/allProjects/allProjects.jsx';
import PersonalProjects from './pages/personalProjects/personalProjects.jsx';
import ProfessionalProjects from './pages/professionalProjects/professionalProjects.jsx';
import Experience from './pages/experience/experience.jsx';
import Skills from './pages/skills/skills.jsx';
import Story from './pages/story/story.jsx';
import Resume from './pages/resume/resume.jsx';
import Chatbot from './components/Chatbot.jsx';
import Photography from './pages/photography/Photography.jsx';
import ChessPage from './pages/chess/chess.jsx';
import Game2048Page from './pages/game2048/game2048.jsx';
import Help from './pages/help/help.jsx';
import Utilities from './pages/utilities/utilities.jsx';
import Calendar from './pages/calendar/calendar.jsx';
import Calculator from './pages/calculator/calculator.jsx';
import ResumeParser from './pages/resumeParser/resumeParser.jsx';

export default function App() {
  const { pathname } = useLocation();

  return (
    <>
      <SpeedInsights route={pathname} />
      <Analytics route={pathname} path={pathname} />
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
          <Route path="/resume" element={<Resume />} />
          <Route path="/photography" element={<Photography />} />
          <Route path="/projects/chess" element={<ChessPage />} />
          <Route path="/projects/2048" element={<Game2048Page />} />
          <Route path="/utilities" element={<Utilities />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/resume-parser" element={<ResumeParser />} />
          <Route path="/help" element={<Help />} />
        </Routes>
      </div>
      <Chatbot />
    </>
  )
}
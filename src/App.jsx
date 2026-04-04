import './App.css'
import Navbar from './navbar.jsx';
import WelcomeScreen from './pages/welcomeScreen.jsx';
import Contact from './pages/contact.jsx';
import { Routes, Route } from 'react-router-dom';
import React from 'react';
import AllProjects from './pages/allProjects.jsx';
import PersonalProjects from './pages/personalProjects.jsx';
import ProfessionalProjects from './pages/professionalProjects.jsx';
import Experience from './pages/experience.jsx';
import Skills from './pages/skills.jsx';
import Story from './pages/story.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<WelcomeScreen />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/Navbar" element={<Navbar />}></Route>
        <Route path="/projects" element={<AllProjects />}></Route>
        <Route path="/projects/personal" element={<PersonalProjects />}></Route>
        <Route path="/projects/professional" element={<ProfessionalProjects />}></Route>
        <Route path="/experience" element={<Experience />}></Route>
        <Route path="/skills" element={<Skills />}></Route>
        <Route path="/story" element={<Story />}></Route>
      </Routes>
    </>
  )
}
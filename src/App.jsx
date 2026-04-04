import './App.css'
import Navbar from './navbar.jsx';
import WelcomeScreen from './pages/welcomeScreen.jsx';
import Contact from './pages/contact.jsx';
import { Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<WelcomeScreen />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/Navbar" element={<Navbar />}></Route>
      </Routes>
    </>
  )
}
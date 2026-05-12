import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../global.css';
import logo from '../assets/2Logo.jpg';

function WelcomeScreen() {
    const navigate = useNavigate();

    return (
        <main className="welcome-screen">
            <div className="welcome-screen__inner">
                <p className="welcome-screen__eyebrow">Portfolio</p>
                <h1>Welcome</h1>
                <p className="welcome-screen__lead">
                    Projects, experience, skills, and background—explore below or jump in where you like.
                </p>
                <div className="welcome-screen__portrait">
                    <img src={logo} alt="Sankalp Amaravadi" width={288} height={288} />
                </div>
                <div className="welcome-screen__actions">
                    <button
                        type="button"
                        className="button-primary"
                        onClick={() => navigate('/projects')}
                    >
                        View projects
                    </button>
                    <button
                        type="button"
                        className="button-outline"
                        onClick={() => navigate('/contact')}
                    >
                        Contact
                    </button>
                    <button
                        type="button"
                        className="button-ghost"
                        onClick={() => navigate('/story')}
                    >
                        My story
                    </button>
                </div>
            </div>
        </main>
    );
}

export default WelcomeScreen;

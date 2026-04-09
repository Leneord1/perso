import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../global.css'


function WelcomeScreen() {
    const navigate = useNavigate();

    return (
        <div className="welcome-screen">
            <h1>Welcome to My Portfolio</h1>
            <p>Explore my projects, experience, skills, and story.</p>

            <button className="button-primary"
                    onClick={() => navigate('/projects')}>
                Get Started
            </button>
            <button className="button-primary"
                    onClick={() => navigate('/about')}>
                About Me
            </button>
            <button className="button-primary"
                    onClick={() => navigate('/contact')}>
                Contact Me
            </button>
            <button className="button-primary"
                    onClick={() => console.log('View projects clicked')}>
                View Projects
            </button>
            <button className="button-primary"
                    onClick={() => navigate('/projects')}>
                View All Projects
            </button>
        </div>
    );
}

export default WelcomeScreen;

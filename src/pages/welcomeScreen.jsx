import React from 'react';
import '../global.css'


function WelcomeScreen() {
    return (
        <div className="welcome-screen">
            <h1>Welcome to My Portfolio</h1>
            <p>Explore my projects, experience, skills, and story.</p>
            <button className="button-primary" onClick={() => console.log('Button clicked')}>Get Started</button>
        </div>
    );
}

export default WelcomeScreen;

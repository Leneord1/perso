import React from 'react';
import '../global.css';

function Contact() {
    return (
        <div className="contact-container">
            <h1>Contact Me</h1>
            <p className="contact-intro">Feel free to reach out to me through any of the platforms below. I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.</p>
            
            <div className="contact-links">
                <div className="contact-item">
                    <span className="contact-label">Email:</span>
                    <a href="mailto:Sankalp.Amaravadi33@gmail.com" className="contact-value link">Sankalp.Amaravadi33@gmail.com</a>
                </div>
                
                <div className="contact-item">
                    <span className="contact-label">LinkedIn:</span>
                    <a href="https://linkedin.com/in/sankalp-amaravadi-147202291" target="_blank" rel="noopener noreferrer" className="contact-value link">linkedin.com/in/SankalpAmaravadi</a>
                </div>
                
                <div className="contact-item">
                    <span className="contact-label">GitHub:</span>
                    <a href="https://github.com/Leneord1" target="_blank" rel="noopener noreferrer" className="contact-value link">github.com/Leneord1</a>
                </div>
                
                <div className="contact-item">
                    <span className="contact-label">Location:</span>
                    <span className="contact-value">Remote / City, Country</span>
                </div>
            </div>
        </div>
    );
}

export default Contact;

import React from "react";
import { Link } from "react-router-dom";
import "../global.css";

function Resume() {
    return (
        <main className="page resume-page">
            <header className="resume-page__intro">
                <h1>Resume</h1>
                <p className="resume-page__tagline">
                    Software engineering student and developer focused on reliable web applications.
                </p>
                <div className="resume-page__contact" aria-label="Contact links">
                    <a href="mailto:Sankalp.Amaravadi33@gmail.com" className="link">
                        Sankalp.Amaravadi33@gmail.com
                    </a>
                    <span className="resume-page__contact-sep" aria-hidden>
                        ·
                    </span>
                    <a
                        href="https://linkedin.com/in/sankalp-amaravadi-147202291"
                        className="link"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        LinkedIn
                    </a>
                    <span className="resume-page__contact-sep" aria-hidden>
                        ·
                    </span>
                    <a
                        href="https://github.com/Leneord1"
                        className="link"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GitHub
                    </a>
                </div>
                <button
                    type="button"
                    className="button-outline resume-page__print resume-print-hide"
                    onClick={() => window.print()}
                >
                    Print or save as PDF
                </button>
            </header>

            <section className="page-section" aria-labelledby="resume-summary-heading">
                <h2 id="resume-summary-heading">Summary</h2>
                <p>
                    Prospective bachelor&apos;s software engineering student with experience shipping
                    React-based features, API-driven workflows, and tests in a nonprofit product
                    environment. Background in structured diagnostics and quality from automotive
                    technical work; applies the same rigor to debugging, delivery, and collaboration.
                </p>
            </section>

            <section className="page-section" aria-labelledby="resume-skills-heading">
                <h2 id="resume-skills-heading">Technical skills</h2>
                <p>
                    <strong>Languages &amp; stacks:</strong> Java, JavaScript, Python, React, Node.js,
                    HTML, CSS, SQL, Docker.
                </p>
                <p>
                    <strong>Tools &amp; practices:</strong> Git and GitHub, JetBrains IDEs, CI/CD
                    pipelines, Bash, Agile coordination. Full depth tables live on the{" "}
                    <Link to="/skills" className="link">
                        Skills
                    </Link>{" "}
                    page.
                </p>
            </section>

            <section className="page-section" aria-labelledby="resume-exp-heading">
                <h2 id="resume-exp-heading">Experience</h2>

                <article className="resume-page__role">
                    <div className="resume-page__role-head">
                        <h3>Website Development Intern</h3>
                        <p className="resume-page__role-meta">Georgia Watch</p>
                    </div>
                    <ul className="resume-page__bullets">
                        <li>
                            Shipped React-based features and API-driven workflows in a live product
                            environment.
                        </li>
                        <li>Participated in testing, debugging, and deployment alongside the team.</li>
                    </ul>
                </article>

                <article className="resume-page__role">
                    <div className="resume-page__role-head">
                        <h3>Express Technician &amp; Intern</h3>
                        <p className="resume-page__role-meta">Automotive service (incl. Tesla internship)</p>
                    </div>
                    <ul className="resume-page__bullets">
                        <li>
                            High-volume repair and diagnostics with emphasis on quality, safety, and
                            clear handoffs to technical teams.
                        </li>
                    </ul>
                </article>

                <p>
                    Longer narrative context is on{" "}
                    <Link to="/story" className="link">
                        My story
                    </Link>
                    .
                </p>
            </section>

            <section className="page-section" aria-labelledby="resume-edu-heading">
                <h2 id="resume-edu-heading">Education</h2>
                <p>
                    Pursuing a bachelor&apos;s in software engineering; coursework and projects include
                    full-stack development (Node.js, PostgreSQL/Supabase), data-driven React
                    applications, and GitHub Actions for CI/CD.
                </p>
            </section>
        </main>
    );
}

export default Resume;

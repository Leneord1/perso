import React from 'react';
import { Link } from 'react-router';
import '../global.css';

function Experience() {
    return (
        <main className="page">
            <h1>Experience</h1>
            <p>
                Roles, impact, and technologies—from shipping React features in production to
                structured diagnostics in high-volume service environments. Outcomes and lessons sit
                here; the printable bullet list lives on the{' '}
                <Link to="/resume" className="link">
                    Resume
                </Link>
                .
            </p>

            <section className="page-section" aria-labelledby="exp-georgia-watch">
                <h2 id="exp-georgia-watch">Website Development Intern</h2>
                <p>
                    <strong>Georgia Watch</strong> · Atlanta, GA · August 2025 – Present
                </p>
                <p>
                    Delivered production-ready web work supporting healthcare data access and user
                    interaction. Collaborated with stakeholders and developers to turn requirements
                    into scalable React and JavaScript features, then helped wire and test API-driven
                    workflows for structured data.
                </p>
                <p>
                    Day to day that meant maintainable frontend components, debugging and issue
                    resolution, deployment support, and Git-based collaboration. The biggest lesson:
                    reliability comes from clear requirements, careful testing, and owning handoffs
                    through release—not just landing the happy path in the browser.
                </p>
            </section>

            <section className="page-section" aria-labelledby="exp-nalley">
                <h2 id="exp-nalley">Express Technician</h2>
                <p>
                    <strong>Nalley Lexus</strong> · Roswell, GA · October 2022 – January 2025
                </p>
                <p>
                    Supported high-volume dealership service with consistent quality and throughput.
                    Worked in a fast team environment where accuracy, documentation, and customer-facing
                    workflows all had to hold under time pressure.
                </p>
                <p>
                    That rhythm maps cleanly to software delivery: prioritize, verify, communicate
                    status, and leave the next person a clean handoff.
                </p>
            </section>

            <section className="page-section" aria-labelledby="exp-tesla">
                <h2 id="exp-tesla">Service Technician (intern)</h2>
                <p>
                    <strong>Tesla</strong> · Kennesaw, GA · February 2022 – August 2022
                </p>
                <p>
                    Supported diagnostic and service operations on vehicle systems—mechanical and
                    electronic—using manufacturer tools and structured troubleshooting. Interpreted
                    diagnostic outputs and worked with technical teams to resolve complex faults.
                </p>
                <p>
                    The transferable skill is methodical debugging: isolate the signal, test hypotheses,
                    and document what you find so the team can move forward.
                </p>
            </section>

            <section className="page-section" aria-labelledby="exp-earlier">
                <h2 id="exp-earlier">Earlier service &amp; retail roles</h2>
                <p>
                    Before Tesla and Lexus, I worked flat-rate express production at{' '}
                    <strong>Jim Shorkey Nissan</strong> (Gainesville, GA), bay technician work at{' '}
                    <strong>Jiffy Lube</strong> (Johns Creek, GA), parts and POS support at{' '}
                    <strong>AutoZone</strong> (Bloomington, IL), and courtesy clerk shifts at{' '}
                    <strong>Jewel-Osco</strong> (Bloomington, IL). Those years built habits around
                    throughput, quality checks, and clear customer communication that still show up in
                    how I ship software.
                </p>
            </section>

            <section className="page-section" aria-labelledby="exp-next">
                <h2 id="exp-next">What I am looking for</h2>
                <p>
                    Software engineering internships and early-career roles—frontend, full-stack, or
                    generalist—where I can keep growing while helping deliver reliable systems. For
                    stack depth, see{' '}
                    <Link to="/skills" className="link">
                        Skills
                    </Link>
                    ; for the longer path into engineering, see{' '}
                    <Link to="/story" className="link">
                        My story
                    </Link>
                    .
                </p>
            </section>
        </main>
    );
}

export default Experience;

import React from 'react';
import { Link } from 'react-router';
import '../../global.css';

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

            <section className="page-section" aria-labelledby="exp-capstone">
                <h2 id="exp-capstone">Senior Capstone / Website Development Intern</h2>
                <p>
                    <strong>Kennesaw State University / Georgia Watch</strong> · Atlanta, GA · August
                    2025 – June 2026
                </p>
                <p>
                    Developed the Georgia Hospital Accountability Scorecard System for Georgia Watch as a
                    Senior Capstone team member and Website Development Intern. Delivered production-ready
                    web work supporting healthcare data access and user interaction. Collaborated with
                    stakeholders and developers to turn requirements into scalable React and JavaScript
                    features, then helped wire and test API-driven workflows for structured data.
                </p>
                <p>
                    Day to day that meant maintainable frontend components, debugging and issue
                    resolution, deployment support, and Git-based collaboration. The biggest lesson:
                    reliability comes from clear requirements, careful testing, and owning handoffs
                    through release—not just landing the happy path in the browser.
                </p>
            </section>

            <section className="page-section" aria-labelledby="exp-hamsini">
                <h2 id="exp-hamsini">Operations Lead</h2>
                <p>
                    <strong>Hamsini Decorations</strong> · Cumming, GA · February 2025 – Present
                </p>
                <p>
                    Supported business growth by assisting in project planning and implementation across
                    decoration and event operations. Coordinated schedules, resources, and stakeholder
                    communication so client work stayed on track.
                </p>
                <p>
                    The transferable habit is operational ownership: plan the work, clear blockers early,
                    and keep handoffs clean when multiple people touch the same deliverable.
                </p>
            </section>

            <section className="page-section" aria-labelledby="exp-nalley">
                <h2 id="exp-nalley">Express Technician</h2>
                <p>
                    <strong>Nalley Lexus</strong> · Roswell, GA · October 2022 – January 2025
                </p>
                <p>
                    Supported high-volume dealership service on the Lexus product line with consistent
                    quality and throughput. Worked in a fast team environment where accuracy,
                    documentation, and customer-facing workflows all had to hold under time pressure.
                </p>
                <p>
                    That rhythm maps cleanly to software delivery: prioritize, verify, communicate
                    status, and leave the next person a clean handoff.
                </p>
            </section>

            <section className="page-section" aria-labelledby="exp-tesla">
                <h2 id="exp-tesla">Tesla Technician</h2>
                <p>
                    <strong>Tesla</strong> · Kennesaw, GA · February 2022 – August 2022
                </p>
                <p>
                    Troubleshot and fixed faults on Tesla vehicles—mechanical and electronic—using
                    manufacturer tools and structured troubleshooting. Interpreted diagnostic outputs and
                    worked with technical teams to resolve complex faults.
                </p>
                <p>
                    The transferable skill is methodical debugging: isolate the signal, test hypotheses,
                    and document what you find so the team can move forward.
                </p>
            </section>

            <section className="page-section" aria-labelledby="exp-earlier">
                <h2 id="exp-earlier">Earlier service &amp; retail roles</h2>
                <p>
                    Before Tesla and Lexus, I worked express production at{' '}
                    <strong>Carriage Nissan</strong> (December 2020 – February 2022), express technician
                    shifts at <strong>Jiffy Lube</strong> (December 2019 – July 2020), parts and POS
                    support at <strong>AutoZone</strong> (Bloomington, IL), and courtesy clerk shifts at{' '}
                    <strong>Jewel-Osco</strong> (Bloomington, IL). Those years built habits around
                    throughput, quality checks, and clear customer communication that still show up in
                    how I ship software.
                </p>
            </section>

            <section className="page-section" aria-labelledby="exp-community">
                <h2 id="exp-community">Community &amp; leadership</h2>
                <p>
                    Co-founded and served as Donation and Volunteer Coordinator for{' '}
                    <strong>Little Free Pantry</strong> in Bloomington, IL (2016 – 2019). Volunteered at
                    the Parkland Car Show (2019) and earned awards including the YICU Service Award and
                    Toastmasters Youth Leadership Program Completion. At KSU I have been recognized on the
                    Dean&apos;s and President&apos;s Lists and joined Ideathon and hackathon events.
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

import React from "react";
import "../global.css";

function ResumeSubheading({ primary, secondary, tertiary, quaternary }) {
    return (
        <div className="resume-subheading">
            <div className="resume-subheading__row">
                <span className="resume-subheading__primary">{primary}</span>
                <span className="resume-subheading__secondary">{secondary || "\u00a0"}</span>
            </div>
            <div className="resume-subheading__row resume-subheading__row--muted">
                <span>{tertiary}</span>
                <span>{quaternary || "\u00a0"}</span>
            </div>
        </div>
    );
}

function ResumeProjectHeading({ title, stack, dateRange }) {
    return (
        <div className="resume-project-heading">
            <span className="resume-project-heading__left">
                <strong>{title}</strong>
                <span className="resume-project-heading__sep"> | </span>
                <em>{stack}</em>
            </span>
            <span className="resume-project-heading__right">{dateRange}</span>
        </div>
    );
}

function ResumeItemList({ children }) {
    return <ul className="resume-item-list">{children}</ul>;
}

function ResumeItem({ children }) {
    return <li className="resume-item">{children}</li>;
}

function ResumeSection({ id, title, children }) {
    return (
        <section className="resume-section" aria-labelledby={id}>
            <h2 className="resume-section__title" id={id}>
                {title}
            </h2>
            {children}
        </section>
    );
}

function Resume() {
    return (
        <main className="page resume-page">
            <header className="resume-heading">
                <h1 className="resume-heading__name">Sankalp Amaravadi</h1>
                <p className="resume-heading__contact">
                    <a href="mailto:Sankalp.Amaravadi33@gmail.com" className="resume-heading__link">
                        Sankalp.Amaravadi33@gmail.com
                    </a>
                    <span className="resume-heading__pipe" aria-hidden>
                        {" "}
                        |{" "}
                    </span>
                    <a
                        href="https://linkedin.com/in/sankalp-amaravadi-147202291"
                        className="resume-heading__link"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        linkedin.com/in/sankalp-amaravadi-147202291
                    </a>
                    <span className="resume-heading__pipe" aria-hidden>
                        {" "}
                        |{" "}
                    </span>
                    <a
                        href="https://github.com/Leneord1"
                        className="resume-heading__link"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        github.com/Leneord1
                    </a>
                </p>
                <button
                    type="button"
                    className="button-outline resume-heading__print resume-print-hide"
                    onClick={() => globalThis.print()}
                >
                    Print or save as PDF
                </button>
            </header>

            <ResumeSection id="resume-education" title="Education">
                <div className="resume-subheading-list">
                    <ResumeSubheading
                        primary="Undergraduate studies — software engineering focus"
                        secondary=""
                        tertiary={
                            "Bachelor's in software engineering (in progress); full-stack web, systems (Docker), and team engineering coursework"
                        }
                        quaternary=""
                    />
                </div>
            </ResumeSection>

            <ResumeSection id="resume-experience" title="Experience">
                <div className="resume-subheading-list">
                    <article className="resume-entry">
                        <ResumeSubheading
                            primary="Website Development Intern"
                            secondary="Present"
                            tertiary="Georgia Watch"
                            quaternary="Georgia"
                        />
                        <ResumeItemList>
                            <ResumeItem>
                                Shipped React-based features and API-driven workflows in a nonprofit product
                                environment.
                            </ResumeItem>
                            <ResumeItem>
                                Participated in testing, debugging, and deployment alongside the team.
                            </ResumeItem>
                            <ResumeItem>
                                Collaborated on maintainable front-end code paths and integration with backend
                                services.
                            </ResumeItem>
                        </ResumeItemList>
                    </article>

                    <article className="resume-entry">
                        <ResumeSubheading
                            primary="Express Technician &amp; Intern"
                            secondary=""
                            tertiary="Automotive service (including Tesla internship)"
                            quaternary=""
                        />
                        <ResumeItemList>
                            <ResumeItem>
                                High-volume diagnostics and repair with structured quality checks and safety
                                standards.
                            </ResumeItem>
                            <ResumeItem>
                                Communicated technical findings clearly to teammates and service leadership.
                            </ResumeItem>
                        </ResumeItemList>
                    </article>
                </div>
            </ResumeSection>

            <ResumeSection id="resume-projects" title="Projects">
                <div className="resume-subheading-list">
                    <article className="resume-entry">
                        <ResumeProjectHeading
                            title="perso"
                            stack="JavaScript, React, Vite"
                            dateRange="—"
                        />
                        <ResumeItemList>
                            <ResumeItem>
                                Personal portfolio site deployed to Vercel with a component-driven UI and
                                project highlights sourced from GitHub metadata.
                            </ResumeItem>
                        </ResumeItemList>
                    </article>

                    <article className="resume-entry">
                        <ResumeProjectHeading
                            title="SWE4663_Group2_SPR25"
                            stack="Java"
                            dateRange="Spring 2025"
                        />
                        <ResumeItemList>
                            <ResumeItem>
                                Group software engineering coursework repository (team delivery, design, and
                                implementation artifacts).
                            </ResumeItem>
                        </ResumeItemList>
                    </article>

                    <article className="resume-entry">
                        <ResumeProjectHeading
                            title="UGAHacksX_1"
                            stack="JavaScript"
                            dateRange="—"
                        />
                        <ResumeItemList>
                            <ResumeItem>
                                Hackathon project work focused on rapid prototyping and collaborative delivery
                                under time constraints.
                            </ResumeItem>
                        </ResumeItemList>
                    </article>
                </div>
            </ResumeSection>

            <ResumeSection id="resume-skills" title="Technical Skills">
                <ul className="resume-skill-block">
                    <li className="resume-skill-block__item">
                        <strong>Languages</strong>
                        {": "}
                        Java, JavaScript, Python, SQL (PostgreSQL), HTML/CSS
                        <br />
                        <strong>Frameworks</strong>
                        {": "}
                        React, Node.js
                        <br />
                        <strong>Developer tools</strong>
                        {": "}
                        Git, GitHub, Docker, JetBrains IDEs, GitHub Actions (CI/CD), Bash, Microsoft Office,
                        Trello
                    </li>
                </ul>
            </ResumeSection>
        </main>
    );
}

export default Resume;

import React from "react";
import PropTypes from "prop-types";
import "../../global.css";

const PROFESSIONAL_SKILLS = [
    "Cross-Functional Collaboration",
    "Communication",
    "Technical Problem Solving",
    "Adaptability",
    "Ownership",
    "Team Leadership",
    "Customer Focus",
    "Attention to Quality",
];

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

ResumeSubheading.propTypes = {
    primary: PropTypes.string.isRequired,
    secondary: PropTypes.string,
    tertiary: PropTypes.string.isRequired,
    quaternary: PropTypes.string,
};

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

ResumeProjectHeading.propTypes = {
    title: PropTypes.string.isRequired,
    stack: PropTypes.string.isRequired,
    dateRange: PropTypes.string.isRequired,
};

function ResumeItemList({ children }) {
    return <ul className="resume-item-list">{children}</ul>;
}

ResumeItemList.propTypes = {
    children: PropTypes.node.isRequired,
};

function ResumeItem({ children }) {
    return <li className="resume-item">{children}</li>;
}

ResumeItem.propTypes = {
    children: PropTypes.node.isRequired,
};

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

ResumeSection.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

const RESUME_DOWNLOAD_NAME = "Sankalp_Resume";

/** Name the saved PDF then open the print dialog. */
function printResume() {
    const previousTitle = document.title;
    document.title = RESUME_DOWNLOAD_NAME;
    const restore = () => {
        document.title = previousTitle;
        globalThis.removeEventListener("afterprint", restore);
    };
    globalThis.addEventListener("afterprint", restore);
    globalThis.print();
}

function Resume() {
    return (
        <main className="page resume-page">
            <header className="resume-heading">
                <h1 className="resume-heading__name">Sankalp Amaravadi</h1>
                <p className="resume-heading__contact">
                    <a href="tel:+13092555290" className="resume-heading__link">
                        (309) 255-5290
                    </a>
                    <span className="resume-heading__pipe" aria-hidden>
                        {" "}
                        |{" "}
                    </span>
                    <a href="mailto:sankalp.amaravadi33@gmail.com" className="resume-heading__link">
                        sankalp.amaravadi33@gmail.com
                    </a>
                    <span className="resume-heading__pipe" aria-hidden>
                        {" "}
                        |{" "}
                    </span>
                    <a
                        href="https://www.linkedin.com/in/sankalp-amaravadi-147202291"
                        className="resume-heading__link"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        LinkedIn profile
                    </a>
                    <span className="resume-heading__pipe" aria-hidden>
                        {" "}
                        |{" "}
                    </span>
                    <a
                        href="https://github.com/leneord1"
                        className="resume-heading__link"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GitHub Repository
                    </a>
                    <span className="resume-heading__pipe" aria-hidden>
                        {" "}
                        |{" "}
                    </span>
                    <a
                        href="https://perso-alpha-one.vercel.app/"
                        className="resume-heading__link"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Personal Website
                    </a>
                </p>
                <button
                    type="button"
                    className="button-outline resume-heading__print resume-print-hide"
                    onClick={printResume}
                >
                    Print or save as PDF
                </button>
            </header>

            <ResumeSection id="resume-summary" title="Professional Summary">
                <p className="resume-summary">
                    Early-career Software Engineer with hands-on experience building full-stack applications
                    using Java, JavaScript, React, Node.js, PostgreSQL, and REST APIs, along with experience
                    in Swift and SwiftUI. Strong foundation in software development, testing, debugging,
                    object-oriented design, data structures, and algorithms. Collaborative and adaptable team
                    contributor with experience leading development teams, working with cross-functional
                    stakeholders, translating requirements into features, and taking ownership of solutions
                    from development through testing and delivery.
                </p>
            </ResumeSection>

            <ResumeSection id="resume-skills" title="Technical Skills">
                <ul className="resume-skill-block">
                    <li className="resume-skill-block__item">
                        <strong>Languages</strong>
                        {": "}
                        Java, JavaScript, Swift, Python, SQL (MySQL), HTML, CSS, C/C++, R
                        <br />
                        <strong>Frameworks and APIs</strong>
                        {": "}
                        SwiftUI, React.js, Node.js, RESTful APIs, JUnit, Streamlit
                        <br />
                        <strong>Developer Tools</strong>
                        {": "}
                        Git, GitHub, GitHub Actions, PowerShell, SonarQube, Google Cloud Platform, JetBrains
                        IDEs, Trello
                        <br />
                        <strong>Concepts</strong>
                        {": "}
                        Object-Oriented Programming, Data Structures, Algorithms, Swift Fundamentals, SDLC,
                        Agile Development, REST API Development, Relational Databases, Version Control, CI/CD,
                        Unit Testing, Integration Testing, Debugging, Modular Software Design, AI-Assisted
                        Development
                    </li>
                </ul>
            </ResumeSection>

            <ResumeSection id="resume-professional-skills" title="Professional Skills">
                <ul className="resume-pro-skills">
                    {PROFESSIONAL_SKILLS.map((skill) => (
                        <li key={skill}>{skill}</li>
                    ))}
                </ul>
            </ResumeSection>

            <ResumeSection id="resume-experience" title="Experience">
                <div className="resume-subheading-list">
                    <article className="resume-entry">
                        <ResumeSubheading
                            primary="Website Developer"
                            secondary="August 2025 -- June 2026"
                            tertiary="Georgia Watch"
                            quaternary="Atlanta, GA"
                        />
                        <ResumeItemList>
                            <ResumeItem>
                                Gathered requirements from 6 stakeholders across development and policy teams,
                                helping shape 3 feature releases.
                            </ResumeItem>
                            <ResumeItem>
                                Partnered with cross-functional stakeholders to clarify requirements, prioritize
                                application enhancements, and translate feedback into user-focused improvements.
                            </ResumeItem>
                            <ResumeItem>
                                Delivered 5 major features across a 4-month Agile development cycle, contributing
                                to an approximately 20% reduction in the open bug backlog.
                            </ResumeItem>
                            <ResumeItem>
                                Supported application quality through testing, debugging, and iterative feature
                                improvements.
                            </ResumeItem>
                            <ResumeItem>
                                Maintained clear project documentation across 3 concurrent workstreams, keeping
                                team members aligned on priorities and deliverables.
                            </ResumeItem>
                        </ResumeItemList>
                    </article>

                    <article className="resume-entry">
                        <ResumeSubheading
                            primary="Operations Lead"
                            secondary="February 2025 -- Present"
                            tertiary="Hamsini Decorations"
                            quaternary="Cumming, GA"
                        />
                        <ResumeItemList>
                            <ResumeItem>
                                Supported business growth by assisting in project planning and implementation
                                across decoration and event operations.
                            </ResumeItem>
                            <ResumeItem>
                                Coordinated schedules, resources, and stakeholder communication so client work
                                stayed on track.
                            </ResumeItem>
                        </ResumeItemList>
                    </article>

                    <article className="resume-entry">
                        <ResumeSubheading
                            primary="Express Technician"
                            secondary="October 2022 -- January 2025"
                            tertiary="Nalley Lexus Roswell"
                            quaternary="Roswell, GA"
                        />
                        <ResumeItemList>
                            <ResumeItem>
                                Performed preventative maintenance and inspections on at least 30 vehicles per
                                day while consistently meeting quality and productivity standards.
                            </ResumeItem>
                            <ResumeItem>
                                Applied standardized quality-control procedures to support service accuracy and
                                customer satisfaction.
                            </ResumeItem>
                            <ResumeItem>
                                Coordinated with technicians and service stakeholders to resolve issues and meet
                                time-sensitive customer commitments.
                            </ResumeItem>
                        </ResumeItemList>
                    </article>

                    <article className="resume-entry">
                        <ResumeSubheading
                            primary="Service Technician Intern"
                            secondary="February 2022 -- August 2022"
                            tertiary="Tesla"
                            quaternary="Kennesaw, GA"
                        />
                        <ResumeItemList>
                            <ResumeItem>
                                Performed root-cause analysis across multiple vehicle subsystems to isolate
                                complex technical faults and support accurate repairs.
                            </ResumeItem>
                            <ResumeItem>
                                Collaborated with technicians and engineering support to troubleshoot and resolve
                                system issues while maintaining quality and safety standards.
                            </ResumeItem>
                        </ResumeItemList>
                    </article>

                    <article className="resume-entry">
                        <ResumeSubheading
                            primary="Express Technician"
                            secondary="December 2020 -- February 2022"
                            tertiary="Carriage Nissan"
                        />
                        <ResumeItemList>
                            <ResumeItem>
                                Performed express production and service work in a high-volume dealership
                                environment.
                            </ResumeItem>
                            <ResumeItem>
                                Supported throughput, quality checks, and time-sensitive customer handoffs.
                            </ResumeItem>
                        </ResumeItemList>
                    </article>

                    <article className="resume-entry">
                        <ResumeSubheading
                            primary="Express Technician"
                            secondary="December 2019 -- July 2020"
                            tertiary="Jiffy Lube"
                        />
                        <ResumeItemList>
                            <ResumeItem>
                                Completed express maintenance and service work in a high-volume quick-service
                                shop.
                            </ResumeItem>
                            <ResumeItem>
                                Followed standardized service procedures to support quality and turnaround time.
                            </ResumeItem>
                        </ResumeItemList>
                    </article>

                    <article className="resume-entry">
                        <ResumeSubheading
                            primary="Parts and POS Support"
                            tertiary="AutoZone"
                            quaternary="Bloomington, IL"
                        />
                        <ResumeItemList>
                            <ResumeItem>
                                Provided parts lookup and point-of-sale support in a retail auto-parts
                                environment.
                            </ResumeItem>
                            <ResumeItem>
                                Communicated product and service information clearly to keep transactions
                                accurate.
                            </ResumeItem>
                        </ResumeItemList>
                    </article>

                    <article className="resume-entry">
                        <ResumeSubheading
                            primary="Courtesy Clerk"
                            tertiary="Jewel-Osco"
                            quaternary="Bloomington, IL"
                        />
                        <ResumeItemList>
                            <ResumeItem>
                                Supported customer-facing retail operations, including checkout assistance and
                                store upkeep.
                            </ResumeItem>
                            <ResumeItem>
                                Practiced clear customer communication and quality checks in a high-traffic
                                grocery environment.
                            </ResumeItem>
                        </ResumeItemList>
                    </article>
                </div>
            </ResumeSection>

            <ResumeSection id="resume-projects" title="Projects">
                <div className="resume-subheading-list">
                    <article className="resume-entry">
                        <ResumeProjectHeading
                            title="Better Financial Futures"
                            stack="JavaScript, React, Node.js, PostgreSQL, GitHub Actions, Vercel"
                            dateRange="January 2026 -- May 2026"
                        />
                        <ResumeItemList>
                            <ResumeItem>
                                Led a 5-member development team in designing and delivering a full-stack financial
                                application, coordinating responsibilities and collaborating on technical
                                decisions throughout the project.
                            </ResumeItem>
                            <ResumeItem>
                                Designed the Supabase database schema and integrated APIs to support application
                                data storage and retrieval.
                            </ResumeItem>
                            <ResumeItem>
                                Collaborated remotely using Trello, GitHub, and messaging tools to coordinate
                                work and deliver the project using Agile development practices.
                            </ResumeItem>
                            <ResumeItem>
                                Implemented CI/CD workflows using GitHub Actions to streamline testing and
                                deployment.
                            </ResumeItem>
                        </ResumeItemList>
                    </article>

                    <article className="resume-entry">
                        <ResumeProjectHeading
                            title="Service Department Operational Organization Software"
                            stack="Java, JavaFX, Git"
                            dateRange="June 2026 -- August 2026"
                        />
                        <ResumeItemList>
                            <ResumeItem>
                                Designed and developed a Java-based service department management application to
                                organize repair orders, technician scheduling, and service bay allocation.
                            </ResumeItem>
                            <ResumeItem>
                                Applied object-oriented programming and data structures to model real-world
                                service department workflows and operational constraints.
                            </ResumeItem>
                            <ResumeItem>
                                Developed a user interface to simplify operational workflows and improve
                                usability.
                            </ResumeItem>
                            <ResumeItem>
                                Applied Git version control, testing, debugging, and modular software design
                                throughout development.
                            </ResumeItem>
                        </ResumeItemList>
                    </article>
                </div>
            </ResumeSection>

            <ResumeSection id="resume-education" title="Education">
                <div className="resume-subheading-list">
                    <article className="resume-entry">
                        <ResumeSubheading
                            primary="Kennesaw State University"
                            secondary="Kennesaw, GA"
                            tertiary="Bachelor of Science in Software Engineering, Minor in Computer Science"
                            quaternary="January 2023 -- December 2026"
                        />
                        <ResumeItemList>
                            <ResumeItem>
                                Degree requirements completed; continuing additional coursework through December
                                2026.
                            </ResumeItem>
                        </ResumeItemList>
                    </article>
                    <ResumeSubheading
                        primary="Gwinnett Technical College"
                        secondary="Lawrenceville, GA"
                        tertiary="Associate of Applied Science in Automotive Technology"
                        quaternary="August 2019 -- December 2021"
                    />
                </div>
            </ResumeSection>

            <ResumeSection id="resume-awards" title="Awards and Extracurricular Activities">
                <ResumeItemList>
                    <ResumeItem>UGAHacks 11 — February 2026</ResumeItem>
                    <ResumeItem>KSU AI Club Hackathon — November 2025</ResumeItem>
                    <ResumeItem>UGAHacks 10 — February 2025</ResumeItem>
                    <ResumeItem>
                        Co-founded Little Free Pantry; Donation and Volunteer Coordinator, Bloomington, IL
                        (2016 -- 2019)
                    </ResumeItem>
                    <ResumeItem>Parkland Car Show volunteer — 2019</ResumeItem>
                    <ResumeItem>YICU Service Award</ResumeItem>
                    <ResumeItem>Toastmasters Youth Leadership Program Completion</ResumeItem>
                    <ResumeItem>Kennesaw State University Dean&apos;s List and President&apos;s List</ResumeItem>
                </ResumeItemList>
            </ResumeSection>
        </main>
    );
}

export default Resume;

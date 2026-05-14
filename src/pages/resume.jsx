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

function ResumeSubItem({ children }) {
    return <p className="resume-subitem">{children}</p>;
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
                    onClick={() => globalThis.print()}
                >
                    Print or save as PDF
                </button>
            </header>

            <ResumeSection id="resume-skills" title="Technical Skills">
                <ul className="resume-skill-block">
                    <li className="resume-skill-block__item">
                        <strong>Languages and Scripting</strong>
                        {": "}
                        Java, Python, JavaScript, C/C++, SQL (MySQL), Supabase (Postgres), HTML, CSS, R
                        <br />
                        <strong>Frameworks and APIs</strong>
                        {": "}
                        React.js, Node.js, JUnit, Streamlit, RESTful APIs
                        <br />
                        <strong>Developer Tools</strong>
                        {": "}
                        Github, JetBrains IDEs, Bash, Google Cloud Services, Arduino IDE, MS Office Suite,
                        Trello
                        <br />
                        <strong>DevOps and CI/CD</strong>
                        {": "}
                        Git, GitHub Actions, CI/CD Pipelines (GitHub Actions), Bash, AWS
                        <br />
                        <strong>Concepts</strong>
                        {": "}
                        Object-Oriented Programming, Data Structures, Algorithms, CI/CD, SDLC
                        <br />
                        <strong>Testing</strong>
                        {": "}
                        Unit testing, Automated testing, Debugging, Integration testing
                    </li>
                </ul>
            </ResumeSection>

            <ResumeSection id="resume-experience" title="Experience">
                <div className="resume-subheading-list">
                    <article className="resume-entry">
                        <ResumeSubheading
                            primary="Website Development Intern"
                            secondary="August 2025 -- Present"
                            tertiary="Georgia Watch"
                            quaternary="Atlanta, GA"
                        />
                        <ResumeSubItem>
                            Delivered a production-ready web application supporting healthcare data access and
                            user interaction.
                        </ResumeSubItem>
                        <ResumeItemList>
                            <ResumeItem>
                                Collaborated with stakeholders and developers to translate business requirements
                                into scalable application features.
                            </ResumeItem>
                            <ResumeItem>
                                Developed maintainable frontend components and integrated application workflows
                                using React and JavaScript.
                            </ResumeItem>
                            <ResumeItem>
                                Assisted with implementing and testing API-driven functionality to support
                                structured data workflows.
                            </ResumeItem>
                            <ResumeItem>
                                Participated in debugging, issue resolution, and deployment support to improve
                                application reliability.
                            </ResumeItem>
                            <ResumeItem>
                                Worked within collaborative development workflows using Git-based version control
                                practices.
                            </ResumeItem>
                        </ResumeItemList>
                    </article>

                    <article className="resume-entry">
                        <ResumeSubheading
                            primary="Express Technician"
                            secondary="October 2022 -- January 2025"
                            tertiary="Nalley Lexus"
                            quaternary="Roswell, GA"
                        />
                        <ResumeSubItem>
                            Supported high-volume service operations by ensuring consistent quality standards and
                            operational efficiency within a collaborative team environment.
                        </ResumeSubItem>
                        <ResumeItemList>
                            <ResumeItem>
                                Collaborated in a high-volume team environment to deliver timely and reliable service
                                outcomes.
                            </ResumeItem>
                            <ResumeItem>
                                Applied quality control processes to ensure service accuracy and operational
                                efficiency.
                            </ResumeItem>
                            <ResumeItem>
                                Worked with customer-facing workflows in fast-paced service environments requiring
                                accuracy and reliability.
                            </ResumeItem>
                        </ResumeItemList>
                    </article>

                    <article className="resume-entry">
                        <ResumeSubheading
                            primary="Service Technician (intern)"
                            secondary="February 2022 -- August 2022"
                            tertiary="Tesla"
                            quaternary="Kennesaw, GA"
                        />
                        <ResumeSubItem>
                            Supported diagnostic and service operations by analyzing vehicle system behavior and
                            identifying faults in mechanical and electronic components.
                        </ResumeSubItem>
                        <ResumeItemList>
                            <ResumeItem>
                                Performed system-level diagnostics on automotive electrical and mechanical systems
                                using manufacturer tools.
                            </ResumeItem>
                            <ResumeItem>
                                Diagnosed and resolved complex automotive system issues using structured
                                troubleshooting methods.
                            </ResumeItem>
                            <ResumeItem>
                                Interpreted diagnostic system outputs and collaborated with technical teams to
                                support issue resolution.
                            </ResumeItem>
                        </ResumeItemList>
                    </article>

                    <article className="resume-entry">
                        <ResumeSubheading
                            primary="Express Technician"
                            secondary="November 2020 -- February 2022"
                            tertiary="Jim Shorkey Nissan"
                            quaternary="Gainesville, GA"
                        />
                        <ResumeSubItem>
                            Worked flat-rate in dealership production, turning maintenance and light repair jobs from
                            oil services through basic recalls while keeping documentation and quality consistent.
                        </ResumeSubItem>
                        <ResumeItemList>
                            <ResumeItem>
                                Completed high-volume maintenance work (including oil changes and fluid services) with
                                attention to manufacturer specifications and inspection findings.
                            </ResumeItem>
                            <ResumeItem>
                                Executed basic recall and campaign work following documented procedures and parts
                                handling requirements.
                            </ResumeItem>
                            <ResumeItem>
                                Managed time and bay workflow under flat-rate expectations, coordinating with advisors
                                and teammates to keep vehicles moving through the shop.
                            </ResumeItem>
                            <ResumeItem>
                                Communicated vehicle condition and completed work clearly to support handoffs and
                                customer confidence in service outcomes.
                            </ResumeItem>
                        </ResumeItemList>
                    </article>

                    <article className="resume-entry">
                        <ResumeSubheading
                            primary="Bay Technician"
                            secondary="October 2019 -- July 2020"
                            tertiary="Jiffy Lube"
                            quaternary="Johns Creek, GA"
                        />
                        <ResumeSubItem>
                            Rotated through bay technician responsibilities in a quick-lube environment, completing
                            fluid services, inspections, and common under-hood and under-car maintenance with consistent
                            throughput and quality checks.
                        </ResumeSubItem>
                        <ResumeItemList>
                            <ResumeItem>
                                Performed oil changes, filter replacements, fluid top-offs, and related preventive
                                maintenance to manufacturer- and company-defined standards.
                            </ResumeItem>
                            <ResumeItem>
                                Supported tire and basic chassis services where assigned, including torque and safety
                                verification on completed work.
                            </ResumeItem>
                            <ResumeItem>
                                Kept the bay organized and stocked so the team could maintain service times during peak
                                traffic.
                            </ResumeItem>
                            <ResumeItem>
                                Communicated vehicle recommendations and completed services clearly to support advisor
                                and customer understanding.
                            </ResumeItem>
                        </ResumeItemList>
                    </article>

                    <article className="resume-entry">
                        <ResumeSubheading
                            primary="Customer Service Associate"
                            secondary="May 2019 -- July 2019"
                            tertiary="AutoZone"
                            quaternary="Bloomington, IL"
                        />
                        <ResumeSubItem>
                            Supported retail automotive customers at the counter with parts lookups, transactions, and
                            straightforward product guidance in a high-touch summer season.
                        </ResumeSubItem>
                        <ResumeItemList>
                            <ResumeItem>
                                Assisted customers with part and fluid selection using catalog and system tools while
                                confirming fitment details when available.
                            </ResumeItem>
                            <ResumeItem>
                                Operated point-of-sale workflows accurately, including returns, exchanges, and
                                promotional pricing where applicable.
                            </ResumeItem>
                            <ResumeItem>
                                Maintained aisle organization and stocking so high-demand items remained findable during
                                busy shifts.
                            </ResumeItem>
                        </ResumeItemList>
                    </article>

                    <article className="resume-entry">
                        <ResumeSubheading
                            primary="Courtesy Clerk"
                            secondary="August 2017 -- May 2018"
                            tertiary="Jewel-Osco"
                            quaternary="Bloomington, IL"
                        />
                        <ResumeSubItem>
                            Front-end courtesy support in a grocery environment focused on customer experience, safety,
                            and steady store flow during evenings and weekends.
                        </ResumeSubItem>
                        <ResumeItemList>
                            <ResumeItem>
                                Bagged purchases carefully, managed cart retrieval, and kept checkout lanes and entry
                                areas clean and unobstructed.
                            </ResumeItem>
                            <ResumeItem>
                                Assisted customers with directions to products and light carry-out support when
                                appropriate.
                            </ResumeItem>
                            <ResumeItem>
                                Followed food safety and sanitation expectations while handling customer-facing tasks
                                alongside the front-end team.
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
                            stack="JavaScript, React, Node, Supabase Database, GitHub Actions, Git"
                            dateRange="January 2026 -- Present"
                        />
                        <ResumeItemList>
                            <ResumeItem>
                                Designed and developed a full-stack financial application using React, Node.js, and
                                Supabase (PostgreSQL).
                            </ResumeItem>
                            <ResumeItem>
                                Built and integrated RESTful APIs to support frontend and backend communication.
                            </ResumeItem>
                            <ResumeItem>
                                Developed relational database structures and handled structured request/response
                                data flows.
                            </ResumeItem>
                            <ResumeItem>
                                Implemented CI/CD workflows using GitHub Actions to automate testing and deployment
                                processes.
                            </ResumeItem>
                            <ResumeItem>
                                Applied modular and maintainable coding practices to improve scalability and
                                long-term maintainability.
                            </ResumeItem>
                            <ResumeItem>
                                Collaborated using Git-based workflows in an agile-style development environment to
                                improve reliability and application performance.
                            </ResumeItem>
                        </ResumeItemList>
                    </article>

                    <article className="resume-entry">
                        <ResumeProjectHeading
                            title="Georgia Hospital Accountability Scorecard"
                            stack="JavaScript, React, Git"
                            dateRange="August 2025 -- Present"
                        />
                        <ResumeItemList>
                            <ResumeItem>
                                Contributed to development of a data-driven web application using React and
                                JavaScript.
                            </ResumeItem>
                            <ResumeItem>
                                Implemented frontend functionality and assisted with API-connected workflows.
                            </ResumeItem>
                            <ResumeItem>
                                Participated in debugging, testing, and feature enhancement activities to improve
                                application reliability and usability.
                            </ResumeItem>
                            <ResumeItem>
                                Collaborated with team members to iteratively improve system functionality and user
                                experience.
                            </ResumeItem>
                        </ResumeItemList>
                    </article>
                </div>
            </ResumeSection>

            <ResumeSection id="resume-education" title="Education">
                <div className="resume-subheading-list">
                    <ResumeSubheading
                        primary="Kennesaw State University"
                        secondary="Kennesaw, GA"
                        tertiary="B.S. in Software Engineering, Minor in Computer Science"
                        quaternary="January 2023 -- Senior graduating in Fall 2026"
                    />
                    <ResumeSubheading
                        primary="Gwinnett Technical College"
                        secondary="Lawrenceville, GA"
                        tertiary="Associates in Automotive Technology"
                        quaternary="August 2019 -- December 2021"
                    />
                    <ResumeSubheading
                        primary="Normal Community High School"
                        secondary="Normal, IL"
                        tertiary="High School Diploma"
                        quaternary="August 2014 -- May 2018"
                    />
                </div>
            </ResumeSection>

            <ResumeSection id="resume-awards" title="Awards and Extra Curricular">
                <ResumeItemList>
                    <ResumeItem>Participant in UGAHacks 11, February 2026</ResumeItem>
                    <ResumeItem>Participant in KSU AI Club Hackathon, November 2025</ResumeItem>
                    <ResumeItem>Participant in UGAHacks 10, February 2025</ResumeItem>
                </ResumeItemList>
            </ResumeSection>
        </main>
    );
}

export default Resume;

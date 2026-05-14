import React from 'react';
import { Link } from 'react-router-dom';
import '../global.css';

function Story() {
    return (
        <main className="page">
            <h1>My story</h1>
            <p>
                I am a prospective college student aiming for a bachelor's software engineer with experience
                building reliable, maintainable web applications.
            </p>
            <p>
                My background started in the automotive repair industry —with a Tesla service
                internship and high-volume work as an express technician—where I learned structured
                diagnostics, quality under pressure, and clear communication with technical teams. That same
                mindset carries into how I debug, ship, and collaborate on software.
            </p>
            <p>
                Recently I have been a Website Development Intern at Georgia Watch, shipping React-based
                features, API-driven workflows, and participating in testing, debugging, and deployment in a
                real product environment. I have also built full-stack work with Node.js, Supabase
                (PostgreSQL), and GitHub Actions for CI/CD, and contributed to data-driven React apps through
                coursework and projects.
            </p>
            <p>
                I am seeking software engineering internship and early-career opportunities where I can continue
                developing as an engineer while contributing to the delivery of reliable, maintainable, and
                impactful systems. I am particularly interested in frontend, full-stack, and generalist engineering roles.
            </p>

            <section className="page-section" aria-labelledby="story-lang-heading">
                <h2 id="story-lang-heading">Languages &amp; stacks</h2>
                <p>
                    Day to day I lean on Java, JavaScript, and Python, with React and Node.js for web work,
                    plus HTML, CSS, and SQL when I am shaping interfaces and data. I have used Docker and other
                    virtualization systems when a project calls for containerized setups. Approximate depth and
                    time-in-use for each language and framework live on the{' '}
                    <Link to="/skills" className="link">
                        Skills
                    </Link>{' '}
                    page in the first table.
                </p>
            </section>

            <section className="page-section" aria-labelledby="story-tools-heading">
                <h2 id="story-tools-heading">Tools &amp; how I ship</h2>
                <p>
                    Git and GitHub are central to how I work; JetBrains IDEs are my usual editor home. I have
                    been building and maintaining CI/CD pipelines for a couple of years, use Bash regularly,
                    and pick up lighter coordination tools (like Trello) when the team does. The second table on
                    the{' '}
                    <Link to="/skills" className="link">
                        Skills
                    </Link>{' '}
                    page breaks those tools out with the same rough tenure labels.
                </p>
            </section>

            <section className="page-section" aria-labelledby="story-skills-cta-heading">
                <h2 id="story-skills-cta-heading">Full skills breakdown</h2>
                <p>
                    This story is the narrative; for a concise table of languages and tools—so recruiters
                    and collaborators can scan depth at a glance—head to the{' '}
                    <Link to="/skills" className="link">
                        Skills page
                    </Link>
                    .
                </p>
            </section>
        </main>
    );
}

export default Story;

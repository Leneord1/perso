import React from 'react';
import { Link } from 'react-router';
import '../global.css';

function Story() {
    return (
        <main className="page">
            <h1>My story</h1>
            <p>
                I am a software engineer with experience building reliable, maintainable web applications.
            </p>
            <p>
                My background started in the automotive repair industry at a quick service shop, later working in
                different dealerships as an express technician at Carriage Nissan and Nalley Lexus, and landing a
                Tesla Technician role — where I established skills within structured diagnostics, having quality under
                pressure, and using clear communication with technical teams and non-technical stakeholders. That same
                mindset carries into how I debug, ship, and collaborate on software development.
            </p>
            <p>
                At Kennesaw State University I completed a Senior Capstone as a Website Development Intern for Georgia
                Watch, building the Georgia Hospital Accountability Scorecard System with React and JavaScript in a
                real production environment. Alongside that work I serve as Operations Lead at Hamsini Decorations,
                supporting business growth through project planning and implementation. I have also built full-stack
                applications with Node.js, Supabase on PostgreSQL, and GitHub Actions for CI/CD, and contributed to
                React apps through coursework, hackathons, and personal projects.
            </p>
            <p>
                Outside of class and work, I co-founded and coordinated donations for Little Free Pantry in
                Bloomington, IL, earned KSU Dean&apos;s and President&apos;s List recognition, and continue to join
                events like UGAHacks and the KSU AI Club hackathon. I am seeking software engineering internship and
                early-career opportunities where I can keep developing as an engineer while contributing to reliable,
                maintainable, and impactful systems — especially frontend, full-stack, and generalist roles.
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
                    Tools wise, I utilize a variety of development and deployment tools such as building software primarily
                    utilizing JetBrains IDES.  Using Github and Github Actions, I have been building and maintaining
                    CI/CD pipelines- much like the one I have for this website, using Bash & other CLI tools regularly for
                    version control, and -have experience with containerization and virtualization tools like Docker.
                    I also use and pick up lighter coordination tools (like Trello) when the team does. The second table on
                    the{' '}
                    <Link to="/skills" className="link">
                        Skills
                    </Link>{' '}
                    page breaks down the amount of time I have been using these tools.
                </p>
            </section>

            <section className="page-section" aria-labelledby="story-skills-cta-heading">
                <h2 id="story-skills-cta-heading">Full skills breakdown</h2>
                <p>
                    This page is for the story; for a concise table of languages and tools head to the{' '}
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

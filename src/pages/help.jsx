import React from 'react';
import { Link } from 'react-router';
import '../global.css';

function Help() {
    return (
        <main className="page">
            <h1>Help</h1>
            <p>
                Quick guide to this site—where pages live, how menus work, and how to reach me.
            </p>

            <section className="page-section" aria-labelledby="help-nav-heading">
                <h2 id="help-nav-heading">Navigation</h2>
                <p>
                    Use the top bar to move around. Desktop: hover a section for its submenu.
                    Mobile: open the menu, then tap a section to expand links. The wordmark
                    returns you to the home page.
                </p>
                <p>
                    <strong>About</strong> covers story, resume, skills, and experience.{' '}
                    <strong>Projects</strong> lists work, including photography.{' '}
                    <strong>Games</strong> has chess. <strong>Contact</strong> has email and
                    social links.
                </p>
            </section>

            <section className="page-section" aria-labelledby="help-pages-heading">
                <h2 id="help-pages-heading">Main pages</h2>
                <p>
                    <Link to="/" className="link">
                        Home
                    </Link>
                    {' — '}
                    short intro and jumps into projects, contact, story, and chess.
                </p>
                <p>
                    <Link to="/story" className="link">
                        My story
                    </Link>
                    {' — '}
                    background and path into software.
                </p>
                <p>
                    <Link to="/resume" className="link">
                        Resume
                    </Link>
                    {' — '}
                    printable summary of education, work, and projects.
                </p>
                <p>
                    <Link to="/skills" className="link">
                        Skills
                    </Link>
                    {' — '}
                    languages, frameworks, and tools with rough tenure.
                </p>
                <p>
                    <Link to="/experience" className="link">
                        Experience
                    </Link>
                    {' — '}
                    roles and what I shipped in each.
                </p>
                <p>
                    <Link to="/projects" className="link">
                        Projects
                    </Link>
                    {' — '}
                    all work, plus filters for{' '}
                    <Link to="/projects/professional" className="link">
                        professional
                    </Link>{' '}
                    and{' '}
                    <Link to="/projects/personal" className="link">
                        personal
                    </Link>
                    .
                </p>
                <p>
                    <Link to="/photography" className="link">
                        Photography
                    </Link>
                    {' — '}
                    photo gallery.
                </p>
                <p>
                    <Link to="/projects/chess" className="link">
                        Chess
                    </Link>
                    {' — '}
                    play against the on-site bot.
                </p>
                <p>
                    <Link to="/contact" className="link">
                        Contact
                    </Link>
                    {' — '}
                    email, LinkedIn, and GitHub.
                </p>
            </section>

            <section className="page-section" aria-labelledby="help-chat-heading">
                <h2 id="help-chat-heading">Chat assistant</h2>
                <p>
                    The chat button in the corner opens an assistant that can answer questions
                    about this site and point you to the right page. Ask in plain language;
                    replies may include links you can follow.
                </p>
            </section>

            <section className="page-section" aria-labelledby="help-more-heading">
                <h2 id="help-more-heading">Still stuck?</h2>
                <p>
                    Prefer a direct line—use{' '}
                    <Link to="/contact" className="link">
                        Contact
                    </Link>{' '}
                    or email{' '}
                    <a href="mailto:Sankalp.Amaravadi33@gmail.com" className="link">
                        Sankalp.Amaravadi33@gmail.com
                    </a>
                    .
                </p>
            </section>
        </main>
    );
}

export default Help;

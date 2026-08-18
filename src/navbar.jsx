import './navbar.css';
import { Link } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import { CalculatorPad } from './pages/calculator.jsx';
import { CalendarPad } from './pages/calendar.jsx';

const navItems = [
    {
        label: 'About',
        to: '/about',
        dropdown: [
            { label: 'My Story', to: '/story' },
            { label: 'Resume', to: '/resume' },
            { label: 'Skills', to: '/skills' },
            { label: 'Experience', to: '/experience' },
        ],
    },
    {
        label: 'Projects',
        to: '/projects',
        dropdown: [
            { label: 'All Projects', to: '/projects' },
            { label: 'Professional', to: '/projects/professional' },
            { label: 'Personal', to: '/projects/personal' },
            { label: 'Photography Portfolio', to: '/photography' },
        ],
    },
    {
        label: 'Games',
        to: '/games',
        dropdown: [
            { label: 'Play Chess', to: '/projects/chess' },
        ],
    },
    {
        label: 'Contact',
        to: '/contact',
        dropdown: [
            { label: 'Get In Touch', to: '/contact' },
            { label: 'LinkedIn', to: 'https://linkedin.com/in/sankalp-amaravadi-147202291', external: true },
            { label: 'GitHub', to: 'https://github.com/Leneord1', external: true },
        ],
    },
    {
        label: 'Utilities',
        to: '/utilities',
        dropdown: [
            { label: 'Utilities', to: '/utilities' },
            { label: 'Resume Parser', to: '/resume-parser' },
        ]
    },
];

function Navbar() {
    const [show, setShow] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [toolOpen, setToolOpen] = useState(null);
    const calendarRef = useRef(null);
    const calcRef = useRef(null);

    const toggleMenu = () => setShow(!show);

    const handleDropdownToggle = (navKey) => {
        setOpenDropdown(openDropdown === navKey ? null : navKey);
        setToolOpen(null);
    };

    const closeAll = () => {
        setShow(false);
        setOpenDropdown(null);
        setToolOpen(null);
    };

    /** Toggle calendar or calculator panel; closes the other. */
    const toggleTool = (tool) => {
        setOpenDropdown(null);
        setToolOpen((open) => (open === tool ? null : tool));
    };

    useEffect(() => {
        if (!toolOpen) return undefined;

        /** Close tool dropdown on outside click or Escape. */
        function handlePointerDown(event) {
            const refs = { calendar: calendarRef, calculator: calcRef };
            const activeRef = refs[toolOpen];
            if (activeRef?.current && !activeRef.current.contains(event.target)) {
                setToolOpen(null);
            }
        }

        function handleKeyDown(event) {
            if (event.key === 'Escape') setToolOpen(null);
        }

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [toolOpen]);

    return (
        <nav className="navbar" aria-label="Main navigation">
            <div className="navbar-container">
                <div className="navbar-left">
                    <Link to="/" className="navbar-wordmark" onClick={closeAll}>
                        Sankalp Amaravadi
                    </Link>

                    <button
                        type="button"
                        className="hamburger"
                        onClick={toggleMenu}
                        aria-expanded={show}
                        aria-controls="primary-navigation"
                        aria-label={show ? 'Close menu' : 'Open menu'}
                    >
                        <span className={show ? 'open' : ''} />
                        <span className={show ? 'open' : ''} />
                        <span className={show ? 'open' : ''} />
                        <span className={show ? 'open' : ''} />
                    </button>

                    <ul
                        id="primary-navigation"
                        className={show ? 'nav-menu active' : 'nav-menu'}
                    >
                    {navItems.map((item) => (
                        <li
                            key={item.to}
                            className={`nav-item${openDropdown === item.to ? ' open' : ''}`}
                            onMouseEnter={() => {
                                setOpenDropdown(item.to);
                                setToolOpen(null);
                            }}
                            onMouseLeave={() => setOpenDropdown(null)}
                        >
                            <button
                                type="button"
                                className="nav-link nav-dropdown-btn"
                                onClick={() => handleDropdownToggle(item.to)}
                                aria-expanded={openDropdown === item.to}
                            >
                                {item.label}
                                <span className="dropdown-arrow" aria-hidden>
                                    ▾
                                </span>
                            </button>
                            <ul className={`dropdown-menu${openDropdown === item.to ? ' visible' : ''}`}>
                                {item.dropdown.map((sub) =>
                                    sub.external ? (
                                        <li key={sub.to} className="dropdown-item">
                                            <a
                                                href={sub.to}
                                                className="dropdown-link"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={closeAll}
                                            >
                                                {sub.label}
                                            </a>
                                        </li>
                                    ) : (
                                        <li key={sub.to} className="dropdown-item">
                                            <Link to={sub.to} className="dropdown-link" onClick={closeAll}>
                                                {sub.label}
                                            </Link>
                                        </li>
                                    )
                                )}
                            </ul>
                        </li>
                    ))}
                    </ul>
                </div>
                <div className="navbar-right">
                    <div
                        className={`nav-item nav-tool${toolOpen === 'calendar' ? ' open' : ''}`}
                        ref={calendarRef}
                    >
                        <button
                            type="button"
                            className="nav-tools-btn"
                            onClick={() => toggleTool('calendar')}
                            aria-expanded={toolOpen === 'calendar'}
                            aria-controls="nav-calendar-dropdown"
                            aria-label="Calendar"
                        >
                            <img
                                src="/calendar-icon.png"
                                alt=""
                                className="nav-tools-icon"
                                width={32}
                                height={32}
                            />
                        </button>
                        {toolOpen === 'calendar' ? (
                            <div
                                id="nav-calendar-dropdown"
                                className="nav-tool-dropdown"
                                role="region"
                                aria-label="Calendar"
                                >
                                <CalendarPad />
                                <Link
                                    to="/calendar"
                                    className="button-outline nav-tool-fullpage"
                                    onClick={closeAll}
                                >
                                    Open full page
                                </Link>
                            </div>
                        ) : null}
                    </div>
                    <div
                        className={`nav-item nav-tool${toolOpen === 'calculator' ? ' open' : ''}`}
                        ref={calcRef}
                    >
                        <button
                            type="button"
                            className="nav-tools-btn"
                            onClick={() => toggleTool('calculator')}
                            aria-expanded={toolOpen === 'calculator'}
                            aria-controls="nav-calculator-dropdown"
                            aria-label="Calculator"
                        >
                            <img
                                src="/calculator-icon.png"
                                alt=""
                                className="nav-tools-icon"
                                width={32}
                                height={32}
                            />
                        </button>
                        {toolOpen === 'calculator' ? (
                            <div
                                id="nav-calculator-dropdown"
                                className="nav-tool-dropdown"
                                role="region"
                                aria-label="Calculator"
                            >
                                <CalculatorPad />
                                <Link
                                    to="/calculator"
                                    className="button-outline nav-tool-fullpage"
                                    onClick={closeAll}
                                >
                                    Open full page
                                </Link>
                            </div>
                        ) : null}
                    </div>
                    <Link to="/help" className="button-primary" onClick={closeAll}>
                        Help
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;

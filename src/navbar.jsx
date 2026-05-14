import './navbar.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const navItems = [
    {
        label: 'About',
        to: '/about',
        dropdown: [
            { label: 'My Story', to: '/story' },
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
];

function Navbar() {
    const [show, setShow] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);

    const toggleMenu = () => setShow(!show);

    const handleDropdownToggle = (navKey) => {
        setOpenDropdown(openDropdown === navKey ? null : navKey);
    };

    const closeAll = () => {
        setShow(false);
        setOpenDropdown(null);
    };

    return (
        <nav className="navbar" aria-label="Main navigation">
            <div className="navbar-container">
                <div className="navbar-left">
                    <Link to="/" className="navbar-wordmark" onClick={closeAll}>
                        Sankalp Amaravadi
                    </Link>

                    <ul
                        id="primary-navigation"
                        className={show ? 'nav-menu active' : 'nav-menu'}
                    >
                    {navItems.map((item) => (
                        <li
                            key={item.to}
                            className={`nav-item${openDropdown === item.to ? ' open' : ''}`}
                            onMouseEnter={() => setOpenDropdown(item.to)}
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
                </button>
            </div>
        </nav>
    );
}

export default Navbar;

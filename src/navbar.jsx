import './navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import logo from './assets/Logo.jpg';

const navItems = [
    {
        label: 'Home',
        to: '/',
        dropdown: [
            { label: 'Welcome', to: '/' },
        ],
    },
    {
        label: 'About',
        to: '/about',
        dropdown: [
            { label: 'My Story', to: '/about' },
            { label: 'Skills', to: '/about/skills' },
            { label: 'Experience', to: '/about/experience' },
        ],
    },
    {
        label: 'Projects',
        to: '/projects',
        dropdown: [
            { label: 'All Projects', to: '/projects' },
            { label: 'Open Source', to: '/projects/open-source' },
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
    useNavigate();

    const toggleMenu = () => setShow(!show);

    const handleDropdownToggle = (index) => {
        setOpenDropdown(openDropdown === index ? null : index);
    };

    const closeAll = () => {
        setShow(false);
        setOpenDropdown(null);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" onClick={closeAll}>
                    <img src={logo} alt="Logo" className="navbar-logo-img" />
                    <span className="navbar-brand">Sankalp Amaravadi</span>
                </Link>

                <div className="hamburger" onClick={toggleMenu}>
                    <span className={show ? 'open' : ''}></span>
                    <span className={show ? 'open' : ''}></span>
                    <span className={show ? 'open' : ''}></span>
                </div>

                <ul className={show ? 'nav-menu active' : 'nav-menu'}>
                    {navItems.map((item, index) => (
                        <li
                            key={index}
                            className={`nav-item${openDropdown === index ? ' open' : ''}`}
                            onMouseEnter={() => setOpenDropdown(index)}
                            onMouseLeave={() => setOpenDropdown(null)}
                        >
                            <button
                                className="nav-link nav-dropdown-btn"
                                onClick={() => handleDropdownToggle(index)}
                                aria-expanded={openDropdown === index}
                            >
                                {item.label}
                                <span className="dropdown-arrow">▾</span>
                            </button>
                            <ul className={`dropdown-menu${openDropdown === index ? ' visible' : ''}`}>
                                {item.dropdown.map((sub, subIndex) =>
                                    sub.external ? (
                                        <li key={subIndex} className="dropdown-item">
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
                                        <li key={subIndex} className="dropdown-item">
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
        </nav>
    );
}

export default Navbar;

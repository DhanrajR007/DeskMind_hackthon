import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bot, Menu, X, Sparkles } from 'lucide-react';
import ThemeSwitcher from './ThemeSwitcher';
import '../styles/navbar.css';

const NAV_LINKS = [
  { label: 'Features',     href: '#features' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Testimonials', href: '#testimonials' },
];

const Navbar = () => {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} id="main-navbar">
        <div className="navbar-container">

          {/* Logo */}
          <Link to="/" className="navbar-logo" id="navbar-logo">
            <div className="navbar-logo-icon">
              <Bot size={18} />
            </div>
            <span className="navbar-logo-text">DeskMind</span>
            <span className="navbar-logo-badge">AI</span>
          </Link>

          {/* Desktop links */}
          <div className="navbar-links" id="navbar-desktop-links">
            {NAV_LINKS.map(link => (
              <a key={link.label} href={link.href} className="navbar-link">
                {link.label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="navbar-actions" id="navbar-actions">
            <ThemeSwitcher />
            <Link to="/login"  className="navbar-btn-login"  id="navbar-login-btn">Login</Link>
            <Link to="/signup" className="navbar-btn-signup" id="navbar-signup-btn">
              <Sparkles size={14} />
              Get Started
            </Link>
            <button
              className="navbar-hamburger"
              id="navbar-hamburger"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`navbar-drawer ${menuOpen ? 'navbar-drawer--open' : ''}`} id="navbar-drawer">
        <div className="navbar-drawer-links">
          {NAV_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="navbar-drawer-link"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <hr className="navbar-drawer-divider" />
          <Link to="/login"  className="navbar-btn-login  w-full text-center" onClick={() => setMenuOpen(false)}>Login</Link>
          <Link to="/signup" className="navbar-btn-signup w-full justify-center" onClick={() => setMenuOpen(false)}>
            <Sparkles size={14} /> Get Started
          </Link>
        </div>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div
          className="navbar-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Navbar;

import React from "react";
import { Link } from "react-router-dom";
// import { Link2, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="logo-icon">🧠</span>
            <span>DeskMind</span>
          </Link>
          <p className="footer-description">
            The most advanced and modern way to shorten your URLs, track
            analytics, and grow your audience.
          </p>
          <div className="footer-socials">
            {/* <a href="#" aria-label="Twitter">
              <Twitter size={20} />
            </a> */}
            {/* <a href="#" aria-label="GitHub"><Github size={20} /></a> */}
            {/* <a href="#" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a> */}
          </div>
        </div>

        <div className="footer-links-grid">
          <div className="footer-column">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#how-it-works">How it Works</a>
            <Link to="/pricing">Pricing</Link>
          </div>
          <div className="footer-column">
            <h4>Resources</h4>
            <a href="#">Blog</a>
            <a href="#">Documentation</a>
            <a href="#">Help Center</a>
          </div>
          <div className="footer-column">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} DeskMind. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

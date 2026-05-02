import React from "react";
import { Link } from "react-router-dom";
// import { Bot, Twitter, Linkedin, Code2, Mail } from 'lucide-react';
import "../styles/footer.css";

const FOOTER_LINKS = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it Works", href: "#how-it-works" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "Pricing", to: "/pricing" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Blog", href: "#" },
      { label: "Documentation", href: "#" },
      { label: "Help Center", href: "#" },
      { label: "API Reference", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

// const SOCIALS = [
//   { icon: <Twitter size={16} />, href: "#", label: "Twitter" },
//   { icon: <Linkedin size={16} />, href: "#", label: "LinkedIn" },
//   { icon: <Code2 size={16} />, href: "#", label: "GitHub" },
//   { icon: <Mail size={16} />, href: "#", label: "Email" },
// ];

const Footer = () => (
  <footer className="footer" id="site-footer">
    {/* Top gradient line */}
    <div className="footer-top-line" />

    <div className="footer-container">
      {/* Brand column */}
      <div className="footer-brand">
        <Link to="/" className="footer-logo" id="footer-logo">
          <div className="footer-logo-icon">{/* <Bot size={18} /> */}</div>
          <span>DeskMind</span>
        </Link>

        <p className="footer-description">
          The AI-powered customer service platform that resolves tickets, chats
          with customers 24/7, and makes your support team unstoppable.
        </p>

        {/* <div className="footer-socials">
          {SOCIALS.map(s => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="footer-social-btn"
            >
              {s.icon}
            </a>
          ))}
        </div> */}
      </div>

      {/* Links grid */}
      <div className="footer-links-grid">
        {FOOTER_LINKS.map((col) => (
          <div key={col.heading} className="footer-column">
            <h4>{col.heading}</h4>
            {col.links.map((link) =>
              link.to ? (
                <Link key={link.label} to={link.to}>
                  {link.label}
                </Link>
              ) : (
                <a key={link.label} href={link.href}>
                  {link.label}
                </a>
              ),
            )}
          </div>
        ))}
      </div>
    </div>

    {/* Bottom bar */}
    <div className="footer-bottom">
      <p>© {new Date().getFullYear()} DeskMind, Inc. All rights reserved.</p>
      <div className="footer-bottom-links">
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="#">Cookies</a>
      </div>
    </div>
  </footer>
);

export default Footer;

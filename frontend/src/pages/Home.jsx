import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Bot, Zap, Shield, BarChart3, ArrowRight, MessageSquare,
  Users, Headphones, CheckCircle, Star, ChevronRight, Sparkles,
  Clock, Globe, TrendingUp
} from 'lucide-react';
import '../styles/Home.css';

const Home = () => {
  useEffect(() => {
    document.body.classList.add('home-loaded');

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => {
      document.body.classList.remove('home-loaded');
      observer.disconnect();
    };
  }, []);

  return (
    <div className="home-page">
      <Navbar />

      {/* Ambient background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <main>
        {/* ── HERO ── */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="badge animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <span className="badge-pulse" />
              Powered by Advanced AI &nbsp;✨
            </div>

            <h1 className="hero-title animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Customer Support,<br />
              <span className="text-gradient">Reimagined with AI.</span>
            </h1>

            <p className="hero-subtitle animate-slide-up" style={{ animationDelay: '0.3s' }}>
              DeskMind gives your business a 24/7 AI-powered support agent that resolves
              tickets, chats with customers, and escalates to human agents — all in one platform.
            </p>

            <div className="hero-actions animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <Link to="/signup" className="btn btn-primary btn-lg" id="hero-cta">
                Start for Free <ArrowRight size={18} />
              </Link>
              <a href="#features" className="btn btn-outline btn-lg" id="hero-features-link">
                See Features
              </a>
            </div>

            <div className="hero-stats animate-slide-up" style={{ animationDelay: '0.5s' }}>
              {[
                { value: '98%', label: 'Resolution Rate' },
                { value: '3s', label: 'Avg. Response Time' },
                { value: '10k+', label: 'Businesses Served' },
              ].map((s, i) => (
                <React.Fragment key={s.label}>
                  {i > 0 && <div className="stat-divider" />}
                  <div className="stat-item">
                    <h3>{s.value}</h3>
                    <p>{s.label}</p>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Live chat mock */}
          <div className="hero-visual animate-fade-in" style={{ animationDelay: '0.55s' }}>
            <div className="glass-card chat-mock">
              <div className="chat-header">
                <div className="chat-avatar">
                  <Bot size={18} />
                </div>
                <div>
                  <p className="chat-name">DeskMind AI</p>
                  <p className="chat-status"><span className="online-dot" /> Online</p>
                </div>
              </div>
              <div className="chat-body">
                <div className="msg msg-bot">
                  👋 Hi! How can I help you today?
                </div>
                <div className="msg msg-user">
                  I can't access my account after the update.
                </div>
                <div className="msg msg-bot">
                  I'm on it! Let me pull up your account details and walk you through the fix. 🔍
                </div>
                <div className="msg msg-typing">
                  <span /><span /><span />
                </div>
              </div>
              <div className="chat-input-mock">
                <span>Type a message…</span>
                <button aria-label="send"><ArrowRight size={16} /></button>
              </div>
            </div>

            {/* Floating badge */}
            <div className="float-badge float-badge-top">
              <CheckCircle size={14} className="badge-icon-green" />
              Ticket auto-resolved
            </div>
            <div className="float-badge float-badge-bottom">
              <TrendingUp size={14} className="badge-icon-purple" />
              +42% CSAT this week
            </div>
          </div>
        </section>

        {/* ── LOGOS / SOCIAL PROOF ── */}
        <section className="logos-section reveal">
          <p className="logos-label">Trusted by teams at</p>
          <div className="logos-row">
            {['Stripe', 'Shopify', 'Notion', 'Linear', 'Vercel', 'Figma'].map(name => (
              <span key={name} className="logo-pill">{name}</span>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" className="features-section">
          <div className="section-header reveal">
            <span className="section-tag">Features</span>
            <h2>Everything your support team needs</h2>
            <p>One platform to handle tickets, chats, FAQs, and analytics — backed by AI.</p>
          </div>

          <div className="features-grid">
            {[
              {
                icon: <Bot />, color: 'blue', delay: '0s',
                title: 'AI Chat Agent',
                desc: 'Resolve up to 80% of customer queries automatically with a context-aware AI trained on your data.',
              },
              {
                icon: <Zap />, color: 'yellow', delay: '0.1s',
                title: 'Instant Responses',
                desc: 'Sub-3-second reply times, 24/7, 365 days a year. No queues, no wait times.',
              },
              {
                icon: <Headphones />, color: 'green', delay: '0.2s',
                title: 'Smart Escalation',
                desc: 'When AI can\'t help, it smoothly hands off to the right human agent with full context.',
              },
              {
                icon: <BarChart3 />, color: 'purple', delay: '0.3s',
                title: 'Deep Analytics',
                desc: 'Track CSAT, resolution rates, ticket trends, and agent performance in real time.',
              },
              {
                icon: <Shield />, color: 'red', delay: '0.4s',
                title: 'Enterprise Security',
                desc: 'SOC 2 compliant, end-to-end encrypted conversations, and role-based access control.',
              },
              {
                icon: <Globe />, color: 'teal', delay: '0.5s',
                title: 'Multi-Language',
                desc: 'Support customers in 50+ languages automatically with our built-in translation engine.',
              },
            ].map(f => (
              <div key={f.title} className={`feature-card glass-card reveal`} style={{ animationDelay: f.delay }}>
                <div className={`feature-icon-wrapper ${f.color}`}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" className="how-it-works-section">
          <div className="section-header reveal">
            <span className="section-tag">How It Works</span>
            <h2>Up and running in minutes</h2>
            <p>No engineering team required. Set up your AI agent in three simple steps.</p>
          </div>

          <div className="steps-container">
            {[
              { num: '01', icon: <MessageSquare size={24} />, title: 'Connect Your Channels', desc: 'Integrate your existing chat widget, email, or WhatsApp in a single click.' },
              { num: '02', icon: <Sparkles size={24} />, title: 'Train the AI', desc: 'Upload your FAQs, docs, and past tickets. The AI learns your brand voice instantly.' },
              { num: '03', icon: <Users size={24} />, title: 'Go Live & Scale', desc: 'Deploy to customers and watch your support costs drop while satisfaction soars.' },
            ].map((step, i) => (
              <React.Fragment key={step.num}>
                <div className="step-item reveal">
                  <div className="step-icon">{step.icon}</div>
                  <div className="step-number">{step.num}</div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
                {i < 2 && <div className="step-connector reveal"><ChevronRight size={24} /></div>}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="testimonials-section">
          <div className="section-header reveal">
            <span className="section-tag">Testimonials</span>
            <h2>Loved by support teams</h2>
          </div>
          <div className="testimonials-grid">
            {[
              { quote: 'DeskMind cut our response time by 90%. Our CSAT went from 3.2 to 4.8 in one month.', name: 'Priya S.', role: 'Head of Support, Razorpay', stars: 5 },
              { quote: 'The AI handles 75% of our tickets autonomously. Our team now focuses on complex issues only.', name: 'James T.', role: 'CX Lead, Shopify Store', stars: 5 },
              { quote: 'Setup was under 20 minutes. The escalation handoff is seamless — customers can\'t even tell.', name: 'Amara N.', role: 'Founder, TechBridge SaaS', stars: 5 },
            ].map(t => (
              <div key={t.name} className="testimonial-card glass-card reveal">
                <div className="stars">
                  {Array.from({ length: t.stars }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="quote">"{t.quote}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.name[0]}</div>
                  <div>
                    <p className="author-name">{t.name}</p>
                    <p className="author-role">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cta-section reveal">
          <div className="cta-card glass-card">
            <div className="cta-icon"><Bot size={40} /></div>
            <h2>Ready to transform your customer support?</h2>
            <p>Join 10,000+ businesses delivering faster, smarter, and happier support with DeskMind.</p>
            <div className="cta-actions">
              <Link to="/signup" className="btn btn-primary btn-lg" id="cta-signup-btn">
                Get Started Free <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-ghost btn-lg" id="cta-login-btn">
                Sign In
              </Link>
            </div>
            <p className="cta-note"><Clock size={14} /> No credit card required · Setup in &lt;5 min</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;

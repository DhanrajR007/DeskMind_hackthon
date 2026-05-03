import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';
import { api } from '../lib/api';

// ─── Icons (inline SVG helpers) ─────────────────────────────────────────────
const Icon = ({ d, size = 20, viewBox = '0 0 24 24', ...props }) => (
  <svg viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" width={size} height={size} {...props}>
    {typeof d === 'string' ? <path d={d} /> : d}
  </svg>
);

// ─── Mock data ──────────────────────────────────────────────────────────────
const LIVE_CHATS = [
  { id: 'c1', visitor: 'Alice M.', topic: 'Billing question', status: 'active', wait: '2m', avatar: 'A', sentiment: 'positive' },
  { id: 'c2', visitor: 'Bob K.', topic: 'Cannot login to account', status: 'active', wait: '5m', avatar: 'B', sentiment: 'neutral' },
  { id: 'c3', visitor: 'Priya S.', topic: 'Integration setup help', status: 'transferred', wait: '8m', avatar: 'P', sentiment: 'neutral' },
  { id: 'c4', visitor: 'James L.', topic: 'Refund request', status: 'active', wait: '1m', avatar: 'J', sentiment: 'negative' },
];

const TICKETS = [
  { id: '#1042', title: 'API rate limit exceeded', priority: 'critical', status: 'open', customer: 'Acme Corp', updated: '10 min ago' },
  { id: '#1039', title: 'Widget not loading on Safari', priority: 'high', status: 'inProgress', customer: 'TechFlow Ltd', updated: '1h ago' },
  { id: '#1037', title: 'Custom branding colors', priority: 'medium', status: 'inProgress', customer: 'Bloom Studio', updated: '3h ago' },
  { id: '#1035', title: 'Export chat history to CSV', priority: 'low', status: 'resolved', customer: 'Nomad Inc', updated: 'Yesterday' },
];

const ACTIVITY = [
  { icon: 'bot', label: 'AI resolved 14 tickets automatically', time: '12 min ago', color: 'var(--primary-color)' },
  { icon: 'ticket', label: 'New critical ticket: API rate limit exceeded', time: '28 min ago', color: '#ef4444' },
  { icon: 'chat', label: 'Live chat volume spike detected (+42%)', time: '1h ago', color: '#f59e0b' },
  { icon: 'check', label: 'Widget deployed to Acme Corp', time: '2h ago', color: '#10b981' },
  { icon: 'agent', label: 'Agent Sarah joined support queue', time: '3h ago', color: 'var(--secondary-color)' },
];

const STATS = [
  { label: 'Active Sessions', value: '24', change: '+8', up: true, color: 'var(--primary-color)', icon: 'chat' },
  { label: 'Open Tickets', value: '57', change: '-3', up: false, color: '#f59e0b', icon: 'ticket' },
  { label: 'AI Resolution Rate', value: '82%', change: '+4%', up: true, color: '#10b981', icon: 'bot' },
  { label: 'Avg. Response Time', value: '1.4m', change: '-12s', up: true, color: 'var(--secondary-color)', icon: 'clock' },
];

// ─── Sub-Components ──────────────────────────────────────────────────────────

const StatIcon = ({ type, size = 22 }) => {
  const icons = {
    chat: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></>,
    ticket: <><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></>,
    bot: <><circle cx="12" cy="8" r="4" /><path d="M8 8H4a2 2 0 0 0-2 2v8" /><path d="M20 8h-4" /><path d="M2 18h20" /><line x1="12" y1="4" x2="12" y2="2" /></>,
    clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
    agent: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
    check: <><polyline points="20 6 9 17 4 12" /></>,
    bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>,
    search: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
    widget: <><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>,
    report: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
    chevronDown: <polyline points="6 9 12 15 18 9" />,
    trendUp: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>,
    trendDown: <><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></>,
    spark: <><path d="M12 2L9.5 9H2l6 4.5-2.3 7L12 16.5l6.3 4L16 13.5 22 9h-7.5L12 2z" /></>,
    layers: <><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>,
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      {icons[type]}
    </svg>
  );
};

const priorityConfig = {
  critical: { label: 'Critical', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  high: { label: 'High', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  medium: { label: 'Medium', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  low: { label: 'Low', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
};

const statusConfig = {
  open: { label: 'Open', color: '#ef4444' },
  inProgress: { label: 'In Progress', color: '#f59e0b' },
  resolved: { label: 'Resolved', color: '#10b981' },
  onHold: { label: 'On Hold', color: '#6366f1' },
};

const sentimentConfig = {
  positive: { emoji: '😊', color: '#10b981' },
  neutral: { emoji: '😐', color: '#f59e0b' },
  negative: { emoji: '😠', color: '#ef4444' },
};

// ─── Main Dashboard ──────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeNav, setActiveNav] = useState('overview');
  const [greeting, setGreeting] = useState('Good morning');
  const [aiPulse, setAiPulse] = useState(false);
  const pulseRef = useRef(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!token || !storedUser) { navigate('/login'); return; }
    try { setUser(JSON.parse(storedUser)); } catch { navigate('/login'); }
  }, [navigate]);

  // AI pulse animation every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setAiPulse(true);
      setTimeout(() => setAiPulse(false), 1000);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) await api.logout(token);
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  if (!user) return null;

  const initial = user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U';
  const fullInitials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <div className="dashboard-container">
      {/* Ambient background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="dashboard-wrapper">

        {/* ── Sidebar ────────────────────────────────────── */}
        <aside className="sidebar glass-panel">
          {/* Logo */}
          <div className="sidebar-logo">
            <div className={`logo-icon ${aiPulse ? 'ai-pulse' : ''}`}>
              <StatIcon type="layers" size={22} />
            </div>
            <div className="logo-text">
              <span className="logo-name">DeskMind</span>
              <span className="logo-badge">AI Support</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="nav-links">
            {[
              { id: 'overview', label: 'Overview', icon: 'grid' },
              { id: 'chats', label: 'Live Chats', icon: 'chat', badge: '24' },
              { id: 'tickets', label: 'Tickets', icon: 'ticket', badge: '57' },
              { id: 'ai', label: 'AI Engine', icon: 'bot' },
              { id: 'widget', label: 'Widget', icon: 'widget' },
              { id: 'reports', label: 'Reports', icon: 'report' },
              { id: 'settings', label: 'Settings', icon: 'settings' },
            ].map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                className={`nav-link ${activeNav === item.id ? 'active' : ''}`}
                onClick={() => setActiveNav(item.id)}
              >
                <span className="nav-icon"><StatIcon type={item.icon} size={20} /></span>
                <span className="nav-label">{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </button>
            ))}
          </nav>

          {/* User footer */}
          <div className="sidebar-footer">
            <div className="sidebar-user">
              <div className="sidebar-avatar">{fullInitials}</div>
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">{user.firstName} {user.lastName}</span>
                <span className="sidebar-user-role">Support Agent</span>
              </div>
            </div>
            <button id="logout-btn" className="logout-btn" onClick={handleLogout}>
              <StatIcon type="logout" size={18} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* ── Main Content ───────────────────────────────── */}
        <main className="main-content">

          {/* Top header */}
          <header className="dash-header">
            <div className="dash-greeting">
              <h1>{greeting}, <span className="grad-text">{user.firstName}!</span></h1>
              <p>Your AI support platform is running smoothly. Here's today's snapshot.</p>
            </div>

            <div className="dash-header-actions">
              <div className="search-pill glass-pill">
                <StatIcon type="search" size={16} />
                <input id="global-search" type="text" placeholder="Search chats, tickets…" />
              </div>

              <button id="notif-btn" className="icon-pill glass-pill notif-btn" aria-label="Notifications">
                <StatIcon type="bell" size={18} />
                <span className="notif-dot" />
              </button>

              <div className="profile-chip glass-pill">
                <div className="profile-avatar">{initial}</div>
                <span className="profile-name">{user.firstName}</span>
                <StatIcon type="chevronDown" size={14} />
              </div>
            </div>
          </header>

          {/* AI Status Banner */}
          <div className={`ai-banner glass-panel ${aiPulse ? 'ai-banner-pulse' : ''}`}>
            <div className="ai-banner-left">
              <div className="ai-dot-ring">
                <span className="ai-dot" />
              </div>
              <div>
                <div className="ai-banner-title">AI Engine is <span className="ai-status-text">Active</span></div>
                <div className="ai-banner-sub">Processing queries in real-time · Model: DeskMind v2.1</div>
              </div>
            </div>
            <div className="ai-banner-stats">
              <div className="ai-mini-stat">
                <span className="ai-mini-val">82%</span>
                <span className="ai-mini-label">Auto-resolve rate</span>
              </div>
              <div className="ai-mini-divider" />
              <div className="ai-mini-stat">
                <span className="ai-mini-val">1.4m</span>
                <span className="ai-mini-label">Avg response</span>
              </div>
              <div className="ai-mini-divider" />
              <div className="ai-mini-stat">
                <span className="ai-mini-val">99.9%</span>
                <span className="ai-mini-label">Uptime</span>
              </div>
            </div>
            <button id="ai-configure-btn" className="ai-configure-btn">Configure AI</button>
          </div>

          {/* Stats row */}
          <div className="stats-grid">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="stat-card glass-panel"
                style={{ animationDelay: `${0.05 * i}s` }}
              >
                <div className="stat-card-top">
                  <span className="stat-label">{stat.label}</span>
                  <div className="stat-icon-wrap" style={{ color: stat.color, background: `${stat.color}18` }}>
                    <StatIcon type={stat.icon} size={20} />
                  </div>
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className={`stat-change ${stat.up ? 'change-up' : 'change-down'}`}>
                  <StatIcon type={stat.up ? 'trendUp' : 'trendDown'} size={13} />
                  {stat.change} <span>vs yesterday</span>
                </div>
                <div className="stat-spark-line">
                  {[40, 55, 45, 70, 60, 80, 75].map((h, idx) => (
                    <div key={idx} className="spark-bar" style={{ height: `${h}%`, background: stat.color }} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Middle: Live Chats + Recent Tickets */}
          <div className="dash-middle">

            {/* Live Chat Queue */}
            <div className="panel glass-panel" id="live-chat-panel">
              <div className="panel-header">
                <div className="panel-title-group">
                  <h2>Live Chat Queue</h2>
                  <span className="live-badge">
                    <span className="live-dot" />
                    Live
                  </span>
                </div>
                <button id="view-all-chats-btn" className="text-link">View all</button>
              </div>

              <div className="chat-list">
                {LIVE_CHATS.map((chat) => (
                  <div key={chat.id} className="chat-row" id={`chat-${chat.id}`}>
                    <div className="chat-avatar" data-sentiment={chat.sentiment}>
                      {chat.avatar}
                    </div>
                    <div className="chat-info">
                      <div className="chat-visitor">{chat.visitor}</div>
                      <div className="chat-topic">{chat.topic}</div>
                    </div>
                    <div className="chat-meta">
                      <span className={`chat-status-badge status-${chat.status}`}>
                        {chat.status === 'active' ? '● Active' : '↗ Transferred'}
                      </span>
                      <span className="chat-wait">
                        <StatIcon type="clock" size={12} />
                        {chat.wait}
                      </span>
                    </div>
                    <div className="chat-sentiment" title={`Sentiment: ${chat.sentiment}`}>
                      {sentimentConfig[chat.sentiment].emoji}
                    </div>
                    <button className="chat-join-btn" id={`join-${chat.id}`}>Join</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Tickets */}
            <div className="panel glass-panel" id="tickets-panel">
              <div className="panel-header">
                <h2>Recent Tickets</h2>
                <button id="new-ticket-btn" className="new-ticket-btn">
                  <StatIcon type="plus" size={14} />
                  New
                </button>
              </div>

              <div className="ticket-list">
                {TICKETS.map((ticket) => {
                  const p = priorityConfig[ticket.priority];
                  const s = statusConfig[ticket.status];
                  return (
                    <div key={ticket.id} className="ticket-row" id={`ticket-${ticket.id.replace('#', '')}`}>
                      <div className="ticket-id">{ticket.id}</div>
                      <div className="ticket-body">
                        <div className="ticket-title">{ticket.title}</div>
                        <div className="ticket-customer">{ticket.customer} · {ticket.updated}</div>
                      </div>
                      <div className="ticket-tags">
                        <span className="priority-badge" style={{ color: p.color, background: p.bg }}>
                          {p.label}
                        </span>
                        <span className="status-dot" style={{ color: s.color }}>● {s.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom: Activity + Quick Actions */}
          <div className="dash-bottom">

            {/* Activity Feed */}
            <div className="panel glass-panel activity-panel" id="activity-panel">
              <div className="panel-header">
                <h2>Activity Feed</h2>
                <button id="view-all-activity-btn" className="text-link">View all</button>
              </div>
              <div className="activity-list">
                {ACTIVITY.map((item, i) => (
                  <div key={i} className="activity-row">
                    <div className="activity-icon-wrap" style={{ background: `${item.color}18`, color: item.color }}>
                      <StatIcon type={item.icon} size={16} />
                    </div>
                    <div className="activity-content">
                      <div className="activity-text">{item.label}</div>
                      <div className="activity-time">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="panel glass-panel" id="quick-actions-panel">
              <div className="panel-header">
                <h2>Quick Actions</h2>
              </div>
              <div className="quick-actions">
                {[
                  { id: 'qa-new-session', label: 'Start New Session', icon: 'chat', primary: true, desc: 'Open a manual support chat' },
                  { id: 'qa-new-ticket', label: 'Create Ticket', icon: 'ticket', desc: 'Log a new support ticket' },
                  { id: 'qa-train-ai', label: 'Train AI Model', icon: 'spark', desc: 'Upload new FAQ data' },
                  { id: 'qa-export', label: 'Export Reports', icon: 'report', desc: 'Download session analytics' },
                ].map((action) => (
                  <button
                    key={action.id}
                    id={action.id}
                    className={`qa-btn ${action.primary ? 'qa-primary' : ''}`}
                  >
                    <div className="qa-icon">
                      <StatIcon type={action.icon} size={18} />
                    </div>
                    <div className="qa-text">
                      <span className="qa-label">{action.label}</span>
                      <span className="qa-desc">{action.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

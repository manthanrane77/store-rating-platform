const AuthLayout = ({ title, subtitle, children, footer }) => (
  <div className="auth-page">
    <div className="auth-brand">
      <div className="auth-brand-inner">
        <div className="auth-logo">⭐</div>
        <h1>Store Rating</h1>
        <p>Discover top-rated stores, share your experience, and manage your business — all in one place.</p>
        <ul className="auth-features">
          <li><span>✦</span> Browse & rate stores from 1 to 5 stars</li>
          <li><span>✦</span> Role-based dashboards for every user</li>
          <li><span>✦</span> Real-time ratings & insights</li>
        </ul>
      </div>
    </div>
    <div className="auth-panel">
      <div className="auth-card">
        <h2>{title}</h2>
        {subtitle && <p className="auth-subtitle">{subtitle}</p>}
        {children}
      </div>
      {footer}
    </div>
  </div>
);

export default AuthLayout;

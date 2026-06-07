const StatCard = ({ icon, value, label, variant = 'indigo' }) => (
  <div className={`stat-card stat-card--${variant}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-body">
      <h3>{value}</h3>
      <p>{label}</p>
    </div>
  </div>
);

export default StatCard;

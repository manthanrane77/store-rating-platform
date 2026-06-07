const Alert = ({ type = 'error', children }) => (
  <div className={`alert alert--${type}`} role="alert">
    <span className="alert-icon">{type === 'error' ? '!' : '✓'}</span>
    {children}
  </div>
);

export default Alert;

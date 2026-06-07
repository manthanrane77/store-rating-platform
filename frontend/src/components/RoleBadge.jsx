const ROLE_STYLES = {
  ADMIN: 'admin',
  NORMAL_USER: 'user',
  STORE_OWNER: 'owner',
};

const ROLE_LABELS = {
  ADMIN: 'Admin',
  NORMAL_USER: 'User',
  STORE_OWNER: 'Store Owner',
};

const RoleBadge = ({ role }) => (
  <span className={`role-badge role-badge--${ROLE_STYLES[role] || 'user'}`}>
    {ROLE_LABELS[role] || role}
  </span>
);

export default RoleBadge;

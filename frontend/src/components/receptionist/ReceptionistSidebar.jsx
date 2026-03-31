import { NavLink } from 'react-router-dom';

function ReceptionistSidebar() {
  const navItems = [
    { to: '/receptionist/dashboard', label: 'Dashboard', icon: 'DB' },
    { to: '/receptionist/patients', label: 'Patients', icon: 'PT' },
  ];

  return (
    <aside className="panel-sidebar">
      <div className="panel-sidebar__brand">
        <div className="panel-sidebar__badge">HS</div>
        <div>
          <h1>Reception Panel</h1>
          <p>Front desk management</p>
        </div>
      </div>

      <nav className="panel-sidebar__nav" aria-label="Receptionist navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `panel-sidebar__link ${isActive ? 'is-active' : ''}`
            }
          >
            <span className="panel-sidebar__icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default ReceptionistSidebar;

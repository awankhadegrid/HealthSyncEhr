import { NavLink } from 'react-router-dom';
import '../../styles/panel-layout.css';

function DoctorPanelLayout({ heading, userName, children }) {
  const navItems = [
    { to: '/doctor/dashboard', label: 'Dashboard', icon: 'DB' },
    { to: '/doctor/patients', label: 'Patients', icon: 'PT' },
  ];

  return (
    <main className="panel-shell doctor-panel-shell">
      <aside className="panel-sidebar doctor-panel-sidebar">
        <div className="panel-sidebar__brand">
          <div className="panel-sidebar__badge">HS</div>
          <div>
            <h1>Doctor Panel</h1>
            <p>Clinical workspace</p>
          </div>
        </div>

        <nav className="panel-sidebar__nav" aria-label="Doctor navigation">
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

      <section className="panel-content doctor-panel-content">
        <header className="panel-topbar doctor-panel-topbar">
          <div>
            <p className="panel-topbar__eyebrow">Welcome</p>
            <h2>{heading}</h2>
          </div>

          <div className="panel-topbar__user doctor-panel-topbar__user">
            <span className="panel-topbar__avatar doctor-panel-topbar__avatar">
              {userName.slice(0, 1).toUpperCase()}
            </span>
            <div>
              <strong>{userName}</strong>
              <p>Doctor</p>
            </div>
          </div>
        </header>

        <div className="panel-content__body">{children}</div>
      </section>
    </main>
  );
}

export default DoctorPanelLayout;

import { NavLink } from 'react-router-dom';
import '../../styles/panel-layout.css';

function PharmacyPanelLayout({ heading, userName, children }) {
  const navItems = [
    { to: '/pharmacy/dashboard', label: 'Dashboard', icon: 'DB' },
    { to: '/pharmacy/medicine-master', label: 'Medicine Master', icon: 'MM' },
    { to: '/pharmacy/medicine-store', label: 'Medicine Store', icon: 'MS' },
  ];

  return (
    <main className="panel-shell pharmacy-panel-shell">
      <aside className="panel-sidebar pharmacy-panel-sidebar">
        <div className="panel-sidebar__brand">
          <div className="panel-sidebar__badge">HS</div>
          <div>
            <h1>Pharmacy Panel</h1>
            <p>Dispensing workspace</p>
          </div>
        </div>

        <nav className="panel-sidebar__nav" aria-label="Pharmacy navigation">
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

      <section className="panel-content pharmacy-panel-content">
        <header className="panel-topbar pharmacy-panel-topbar">
          <div>
            <p className="panel-topbar__eyebrow">Welcome</p>
            <h2>{heading}</h2>
          </div>

          <div className="panel-topbar__user pharmacy-panel-topbar__user">
            <span className="panel-topbar__avatar pharmacy-panel-topbar__avatar">
              {userName.slice(0, 1).toUpperCase()}
            </span>
            <div>
              <strong>{userName}</strong>
              <p>Pharmacy</p>
            </div>
          </div>
        </header>

        <div className="panel-content__body">{children}</div>
      </section>
    </main>
  );
}

export default PharmacyPanelLayout;

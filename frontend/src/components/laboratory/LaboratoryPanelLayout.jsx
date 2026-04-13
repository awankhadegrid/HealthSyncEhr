import { NavLink } from 'react-router-dom';
import '../../styles/panel-layout.css';

function LaboratoryPanelLayout({ heading, userName, children }) {
  const navItems = [
    { to: '/laboratory/dashboard', label: 'Dashboard', icon: 'LB' },
    { to: '/laboratory/tests/add', label: 'Add Test', icon: 'AT' },
    { to: '/laboratory/tests', label: 'All Tests', icon: 'LT' },
  ];

  return (
    <main className="panel-shell laboratory-panel-shell">
      <aside className="panel-sidebar laboratory-panel-sidebar">
        <div className="panel-sidebar__brand">
          <div className="panel-sidebar__badge">HS</div>
          <div>
            <h1>Laboratory Panel</h1>
            <p>Reports and sample workflow</p>
          </div>
        </div>

        <nav className="panel-sidebar__nav" aria-label="Laboratory navigation">
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

      <section className="panel-content laboratory-panel-content">
        <header className="panel-topbar laboratory-panel-topbar">
          <div>
            <p className="panel-topbar__eyebrow">Welcome</p>
            <h2>{heading}</h2>
          </div>

          <div className="panel-topbar__user laboratory-panel-topbar__user">
            <span className="panel-topbar__avatar laboratory-panel-topbar__avatar">
              {userName.slice(0, 1).toUpperCase()}
            </span>
            <div>
              <strong>{userName}</strong>
              <p>Laboratory</p>
            </div>
          </div>
        </header>

        <div className="panel-content__body">{children}</div>
      </section>
    </main>
  );
}

export default LaboratoryPanelLayout;

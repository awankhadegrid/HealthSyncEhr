import ReceptionistSidebar from './ReceptionistSidebar.jsx';
import ReceptionistTopbar from './ReceptionistTopbar.jsx';
import '../../styles/panel-layout.css';

function ReceptionistPanelLayout({ heading, userName, actions, children }) {
  return (
    <main className="panel-shell">
      <ReceptionistSidebar />

      <section className="panel-content">
        <ReceptionistTopbar
          heading={heading}
          userName={userName}
          actions={actions}
        />
        <div className="panel-content__body">{children}</div>
      </section>
    </main>
  );
}

export default ReceptionistPanelLayout;

function ReceptionistTopbar({ heading, userName, actions }) {
  return (
    <header className="panel-topbar">
      <div>
        <p className="panel-topbar__eyebrow">Welcome</p>
        <h2>{heading}</h2>
      </div>

      <div className="panel-topbar__right">
        {actions ? <div className="panel-topbar__actions">{actions}</div> : null}

        <div className="panel-topbar__user">
          <span className="panel-topbar__avatar">
            {userName.slice(0, 1).toUpperCase()}
          </span>
          <div>
            <strong>{userName}</strong>
            <p>Receptionist</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default ReceptionistTopbar;

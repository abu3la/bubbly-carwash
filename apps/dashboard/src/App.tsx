import { NavLink, Outlet } from 'react-router-dom';

function BrandMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 34 34" aria-hidden="true">
      <circle cx="13" cy="19" r="10" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="24" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="2.4" opacity="0.7" />
      <circle cx="27" cy="23" r="3" fill="none" stroke="currentColor" strokeWidth="2.4" opacity="0.45" />
    </svg>
  );
}

export function App() {
  return (
    <>
      <nav className="nav">
        <div className="nav-brand">
          <BrandMark />
          Bubbly Ops
        </div>
        <div className="nav-links">
          <NavLink to="/" end>
            Overview
          </NavLink>
          <NavLink to="/bookings">Bookings</NavLink>
          <NavLink to="/drivers">Drivers</NavLink>
          <NavLink to="/services">Services</NavLink>
        </div>
        <div className="nav-foot">Bubbly Carwash · operations</div>
      </nav>
      <main className="content">
        <Outlet />
      </main>
    </>
  );
}

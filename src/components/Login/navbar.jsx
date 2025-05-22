import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication state or token
    // localStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark px-3" style={{ backgroundColor: '#003366' }}>
      <Link className="navbar-brand" to="/dashboard">
        EQMS
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto align-items-center">
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard">Dashboard</Link>
          </li>

          {/* Search bar */}
          <li className="nav-item mx-3">
            <form className="d-flex" role="search">
              <input
                className="form-control form-control-sm"
                type="search"
                placeholder="Search"
                aria-label="Search"
                style={{
                    backgroundColor: '#8c9ccc',
                    color: 'white',
                    border: 'none'
                }}
              />
            </form>
          </li>

          {/* Logout button */}
          <li className="nav-item">
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

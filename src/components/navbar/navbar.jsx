import { Link, useNavigate } from 'react-router-dom';
import { logout } from "../../services/auth.service";
import './navbar.css';
import { FaHome } from "react-icons/fa";



const Navbar = () => {
  const navigate = useNavigate();

const handleLogout = (e) => {
     e.preventDefault();
     logout();
     navigate("/");
   };

 return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark navbar-first px-3">
       
        <Link className="navbar-brand flex items-center gap-2 text-white" to="/dashboard">
          <FaHome className='me-1' size={32} />
          <span className="text-lg font-semibold">EQMS</span>
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
            
            {/* First Dropdown */}
            <li className="nav-item dropdown hover-dropdown position-relative">
              <div className="nav-link dropdown-toggle" role="button">
                Module One
              </div>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="#">Option 1</Link></li>
                <li><Link className="dropdown-item" to="#">Option 2</Link></li>
              </ul>
            </li>

            {/* Second Dropdown */}
            <li className="nav-item dropdown hover-dropdown position-relative ms-3 me-3">
              <div className="nav-link dropdown-toggle" role="button">
                Module Two
              </div>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="#">Today</Link></li>
                <li><Link className="dropdown-item" to="#">This Week</Link></li>
                <li><Link className="dropdown-item" to="#">This Month</Link></li>
              </ul>
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

      
    </>
  );
};

export default Navbar;

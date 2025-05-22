import React from 'react';
import './login.css';
import loginimage from '../../assets/images/login.png';
import drdologo from '../../assets/images/drdologo.png';

const LoginPage = () => {
  return (
    <div className="login-wrapper d-flex flex-column" style={{ minHeight: '100vh' }}>
      {/* Header */}
      <header className="navbar navbar-expand-lg navbar-dark custom-header-bg px-2 py-2">
        <div className="d-flex align-items-center mx-auto">
          <img src={drdologo} alt="Logo" height="70" width="70" className="me-4" />
          <h4 className="text-white mb-0">Equipment Management System</h4>
        </div>
      </header>

      {/* Main Content with equal padding */}
      <main className="flex-grow-1 d-flex justify-content-center align-items-center p-4">
        <div className="card  rounded overflow-hidden w-100" style={{ maxWidth: '1000px', border: 'none', boxShadow: 'none' }}>
          <div className="row g-0" >
            {/* Left Side: Image */}
            <div className="col-md-6 d-flex align-items-center justify-content-center  p-4">
              <img
                src={loginimage}
                alt="loginimage"
                className="img-fluid"
                style={{ maxWidth: '400px', maxHeight: '100%' }}
              />
            </div>
            {/* Right Side: Login Form */}
            <div className="col-md-6 bg-light p-5 d-flex flex-column justify-content-center">
              <h5 className="text-center mb-2" style={{ color: '#003366' }}>Welcome To EQMS</h5>
              <h4 className="text-center mb-4">Login</h4>
              <form className="d-flex flex-column align-items-center">
                <div className="mb-3 w-75">
                  <input type="text" className="form-control custom-input" placeholder="Username" />
                </div>
                <div className="mb-3 w-75">
                  <input type="password" className="form-control custom-input" placeholder="Password" />
                </div>
                <div className="w-75">
                  <button type="submit" className="btn btn-success w-100">Login</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-2 text-center text-white custom-header-bg">
        <small>Website maintained by Vedant Tech Solutions</small>
      </footer>
    </div>



  );
};

export default LoginPage;

import React from 'react';
import gongChaLogo from '../assets/images/GongChaLogo.png';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';
import "../components/components.css";


function Landing() {
  return (
    <div className="container-fluid d-flex flex-row vh-100 vw-100 p-0 background">
      <div className="col-md-6 d-flex flex-column justify-content-center align-items-center vh-100">
        <Link to="/customerView" className="btn btn-primary mb-3 customer-order-menuboard">Order</Link>
        <Link to="/menu-board" className="btn btn-primary customer-order-menuboard">Menu Board</Link>
      </div>
      <div className="col-md-6 d-flex justify-content-center align-items-center vh-100 logoDiv">
        <img
          src={gongChaLogo}
          alt="GongCha Logo"
          width="70%"
          className="img-fluid"
        />
      </div>
      <div className="col d-flex flex-column justify-content-end align-items-end vh-100 pr-3 pb-3">
        <Link to="/login" className="btn btn-primary customer-login">Log In</Link>
      </div>
    </div>
  );
}

export default Landing;
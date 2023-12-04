import React from 'react'
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './logIn.css';
import { useNavigate  } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import gongChaLogo from '../assets/images/GongChaLogo.png';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      console.log("connect");
      const response = await fetch('https://gong-cha-server.onrender.com/employees', { mode: 'cors' });
      const data = await response.json();
      let isLoginSuccessful = false; // flag to track successful login

      data.forEach((employee: any) => {
        if (username === employee.employeeusername && password === employee.employeeuserpassword && employee.ismanager) {
          console.log("Login successful");
          isLoginSuccessful = true; // set the flag to true if matching user found
          sessionStorage.setItem("employeeId", employee.employeeid)
          navigate('/managerView');
        }
        else if (username === employee.employeeusername && password === employee.employeeuserpassword) {
          console.log("Login successful");
          isLoginSuccessful = true; // set the flag to true if matching user found
          sessionStorage.setItem("employeeId", employee.employeeid)
          navigate('/cashierView');
        }
      });

      if (!isLoginSuccessful) {
        console.log("Login failed");
        alert("Login failed");
      }

    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };


  const togglePasswordVisibility = () => {
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    if (passwordInput) {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
      } else {
        passwordInput.type = "password";
      }
    }
  };

  const onBackClick = () => {
    navigate("/");
  };


  return (
    <div className="container-fluid d-flex flex-row vh-100 vw-100 p-0 background">
      <div>
        <button className="back-button" onClick={onBackClick} aria-label="Go back">
          <FontAwesomeIcon icon={faArrowLeftLong} className="Back-icon" aria-hidden="true" />
        </button>
      </div>
      <div className="col-4 d-flex justify-content-center align-items-center vh-100 logoDiv">
        <img
          src={gongChaLogo}
          alt="GongCha Logo"
          width="70%"
          className="img-fluid"
        />
      </div>
      <div className="col d-flex flex-column align-items-center vh-100 loginForm">
        <h1 className="w-100 text-center my-2 loginText">Log-In</h1> {/* Use heading for section title */}
        <form className="w-75 mt-4" onSubmit={handleSubmit}>
          <div className="mb-3 mt-5">
            <label htmlFor="username" className="form-label mb-1">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Please enter username here"
              required
              aria-required="true" // Explicitly mark the field as required for screen readers
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label mb-1">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Please enter password here"
              required
              aria-required="true"
            />
          </div>
          <div className="mb-3">
            <input
              type="checkbox"
              id="showPassword"
              className="form-check-input"
              onChange={togglePasswordVisibility}
              aria-checked="false" // Reflect the state of the checkbox for screen readers
            />
            <label className="form-check-label" htmlFor="showPassword">Show Password</label>
          </div>
          <button type="submit" className="btn btn-primary buttonSubmit">
            Submit
          </button>
        </form>
      </div>
    </div>

  );
}

export default Login;


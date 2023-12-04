import { response } from 'express';
import React, { useEffect } from 'react'
//import * as jwt from 'jsonwebtoken';
import { useNavigate } from 'react-router-dom';
//import jwt from 'jsonwebtoken';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



declare global {
  interface Window {
    google: any;
  }
}

function GoogleLogIn() {
  function handleCallBackResponse(response: any) {
    console.log("Encoded JWT Token: " + response.credential);
    // console.log("Decoded JWT Token: " + jwt.decode(response.credential));
    // console.log("Decoded JWT Token: " + response.credential);
    // console.log("User ID: " + response.googleId);
  }
  
  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: "811468710463-ikhh72af9ep2do13c3bdo6sn1nd5olpq.apps.googleusercontent.com",
      callback: handleCallBackResponse
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-login-button"),
      { theme: "outline", size: "large", text: "continue_with", width: "300px", height: "50px" }
    );

  }, [])
  
  return (
    <div>
      <div id="google-login-button"></div>
    </div>
  )
}

export default GoogleLogIn;
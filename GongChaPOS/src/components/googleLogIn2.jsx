import { response } from 'express';
import React, { useEffect } from 'react'
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function GoogleLogIn2() {
  function handleCallBackResponse(response) {
    console.log("Encoded JWT Token: " + response.credential);
    const decodedToken = jwtDecode(response.credential)
    console.log("Decoded JWT Token: " + JSON.stringify(decodedToken));
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

export default GoogleLogIn2;
import React, { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';



function GoogleLogIn( { onSignIn } ) {
  const [userObject, setUserObject] = useState('');
  const handleCallBackResponse = (response) => {
    console.log("Encoded JWT Token: " + response.credential);
    var userObject = jwtDecode(response.credential)
    setUserObject(userObject);
    console.log(userObject);
    console.log(userObject.name);
    onSignIn(userObject.name);
  };
  useEffect(() => {
    sessionStorage.setItem("userName", JSON.stringify(userObject.name));
  }, [userObject])
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
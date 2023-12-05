import React, { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


/**
 * GoogleLogIn Component
 *
 * A reusable component for handling Google sign-in.
 *
 * @component
 *
 * @param {Object} props - The properties of the GoogleLogIn component.
 * @param {Function} props.onSignIn - Callback function triggered when a user successfully signs in with Google.
 *
 * @returns {JSX.Element} The rendered GoogleLogIn component.
 */
function GoogleLogIn( { onSignIn } ) {
  /**
   * State to store the decoded user object from the JWT token.
   *
   * @type {string}
   */
  const [userObject, setUserObject] = useState('');
  /**
   * Handles the callback response from the Google sign-in.
   *
   * @param {Object} response - The response object containing the Google sign-in credential.
   */
  const handleCallBackResponse = (response) => {
    console.log("Encoded JWT Token: " + response.credential);
    var userObject = jwtDecode(response.credential)
    setUserObject(userObject);
    console.log(userObject);
    console.log(userObject.name);
    onSignIn(userObject.name);
  };
  /**
   * useEffect hook to set the user's name in the sessionStorage when the userObject changes.
   */
  useEffect(() => {
    sessionStorage.setItem("userName", JSON.stringify(userObject.name));
  }, [userObject])

  /**
   * useEffect hook to initialize and render the Google sign-in button.
   */
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

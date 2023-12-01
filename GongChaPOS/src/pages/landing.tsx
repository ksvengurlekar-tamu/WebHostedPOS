import React, { useEffect } from 'react';
import gongChaLogo from '../assets/images/GongChaLogo.png';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';
import "../components/components.css";
import { useLanguageContext } from '../components/languageContext';


import GoogleLogin from '../components/googleLogIn';

function Landing() {
  const { selectedLanguage } = useLanguageContext();

  useEffect(() => {
    const googleTranslateScript = document.createElement('script');
    googleTranslateScript.src =
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    googleTranslateScript.async = true;

    const initializeTranslate = () => {
      if ((window as any).google?.translate?.TranslateElement) {
        new (window as any).google.translate.TranslateElement(
          { pageLanguage: selectedLanguage },
          'google_translate_element'
        );
      } else {
        setTimeout(initializeTranslate, 500); // Retry initialization after a delay
      }
    };

    googleTranslateScript.onload = initializeTranslate;

    document.body.appendChild(googleTranslateScript);

    return () => {
      document.body.removeChild(googleTranslateScript);
    };
  }, [selectedLanguage]);

  return (
    <div className="container-fluid d-flex flex-row vh-100 vw-100 p-0 background">
      <div className="col-6 d-flex flex-column justify-content-center align-items-center vh-100">
        <Link to="/customerView" className="btn btn-primary mb-3 customer-order-menuboard">Order</Link>
        <Link to="/menuBoard" className="btn btn-primary customer-order-menuboard">Menu Board</Link>
        <div>test div</div>
        <div id="google_translate_element"></div>
      </div>
      <div className="col-4 d-flex justify-content-center align-items-center vh-100 logoDiv">
        <img
          src={gongChaLogo}
          alt="GongCha Logo"
          width="60%"
          className="img-fluid"
        />
      </div>
      <div className="col-1.9 d-flex flex-column justify-content-end align-items-end vh-100 pr-3 pb-3">
        <Link to="/login" className="btn btn-primary customer-login">Log In</Link>
      </div>


      <div className="mt-3">
            <GoogleLogin />
          </div>
    </div>
  );
}

export default Landing;

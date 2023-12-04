import { useEffect, useState } from 'react';
import gongChaLogo from '../assets/images/GongChaLogo.png';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';
import "../components/components.css";
import WeatherWidget from '../components/weatherWidget';
import { useLanguageContext } from '../components/languageContext';
import axios from 'axios';

interface weatherInfo{
  cityName: string;
  countryName: string;
  currentTemp: number;
  feelsLike: number;
  maxTemp: number;
  minTemp: number;
  weatherDescription: string;
  weatherIcon: string;
}

function Landing() {
  const { selectedLanguage } = useLanguageContext();
  const [currTemp, setCurrTemp] = useState<string>(() => {
    const savedCurrTemp = localStorage.getItem('currTemp');
    return savedCurrTemp || "";
  });
  const [discountedDrink, setDiscountedDrink] = useState<string>(() => {
    const savedDiscountedDrink = sessionStorage.getItem('discountedDrink');
    return savedDiscountedDrink || "";
  });
  const [showAlert, setShowAlert] = useState(true);
  
  const [weatherInfo, setWeatherInfo] = useState<weatherInfo>();
  
  useEffect(() => { //determine current temperature
    const savedDiscountedDrink = sessionStorage.getItem('discountedDrink');
    const fetchWeatherData = async () => {
      try {
        const dailyWeatherInfo = await axios.get('https://gong-cha-server.onrender.com/weather/forecast');
        const currWeatherInfo = await axios.get('https://gong-cha-server.onrender.com/weather/current');
        console.log(savedDiscountedDrink);
        if (!savedDiscountedDrink) {
          const menuItems = await axios.get('https://gong-cha-server.onrender.com/category/Seasonal');
          const menuItemsData = menuItems.data;
          const randomIndex = Math.floor(Math.random() * menuItemsData.length);
          const randomDrink = menuItemsData[randomIndex].menuitemname;
          setDiscountedDrink(randomDrink);
          sessionStorage.setItem("discountedDrink", randomDrink);
        } else {
          setDiscountedDrink(savedDiscountedDrink);
        }

        if (currWeatherInfo.data.currentTemperature > 70.0) {
          setCurrTemp('Hot');
        }
        else if (currWeatherInfo.data.currentTemperature > 60.0) {
          setCurrTemp('warm');
        }
        else {
          setCurrTemp('Cold');
        }
        setWeatherInfo({
          cityName: dailyWeatherInfo.data.cityName,
          countryName: dailyWeatherInfo.data.countryName,
          currentTemp: currWeatherInfo.data.currentTemperature,
          feelsLike: currWeatherInfo.data.feelsLike,
          maxTemp: dailyWeatherInfo.data.temperatureMax,
          minTemp: dailyWeatherInfo.data.temperatureMin,
          weatherDescription: dailyWeatherInfo.data.weatherDescription,
          weatherIcon: dailyWeatherInfo.data.weatherIcon,
        });
        
      } catch (error) {
        // Handle any errors here
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, []);

  useEffect(() => {
    localStorage.setItem("currTemp", currTemp.toString());
  }, [currTemp]);
  useEffect(() => {
    sessionStorage.setItem("discountedDrink", discountedDrink.toString());
  }, [discountedDrink]);

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
      
      {showAlert && (
        <div className="alert alert-warning alert-dismissible fade-in show" role="alert">
          <span role="heading" aria-level={1} style={{margin: '5px', fontSize: '30px'}}>Since it is {currTemp} outside, we are offering a 100% discount on our {discountedDrink}! </span>
          <button type="button" className="close" onClick={() => setShowAlert(false)} aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )}
      
      <div className="col-6 d-flex flex-column justify-content-center align-items-center vh-100">
        <Link to="/customerView" className="btn btn-primary mb-3 customer-order-menuboard"  aria-label="Order Menu">Order</Link>
        <Link to="/menuBoard" className="btn btn-primary customer-order-menuboard" aria-label="View Menu Board">Menu Board</Link>
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
      {weatherInfo ? <WeatherWidget weatherInfo={weatherInfo} /> : <div className='widget'>Loading...</div>}
      <div className="col-1.9 d-flex flex-column justify-content-end align-items-end vh-100 pr-3 pb-3">
        <Link to="/login" className="btn btn-primary customer-login" aria-label="Log In to Account">Log In</Link>
      </div>
    </div>
  );
}

export default Landing;

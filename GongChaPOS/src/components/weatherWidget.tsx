import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.css';

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
interface WeatherWidgetProps {
    weatherInfo: weatherInfo;
}

function WeatherWidget({weatherInfo}: WeatherWidgetProps) {

const [weatherIconUrl, setWeatherIconUrl] = useState<string>('');

  useEffect(() => {
    // Replace with your API call logic
    const fetchWeatherData = async () => {
      const iconCode = weatherInfo.weatherIcon;
      const url = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      setWeatherIconUrl(url);
    };

    fetchWeatherData();
  }, []); // Empty dependency array means this effect runs once on component mount

  return (
      <div className="card widget">
          <div className="card-body">
              <strong className="mb-1 sfw-normal widgetTextCity">{weatherInfo.cityName}, {weatherInfo.countryName} </strong>
              <p className="mb-1 widgetText">Current temperature: <strong className="widgetText">{weatherInfo.currentTemp.toPrecision(2)}°F</strong></p>
              <p className="widgetText">Feels like: <strong className="widgetText">{weatherInfo.feelsLike.toPrecision(2)}°F</strong></p>
              <p className="widgetText"> Min: <strong className="widgetText">{weatherInfo.minTemp.toPrecision(2)}°F</strong>, Max: <strong className="widgetText">{weatherInfo.maxTemp.toPrecision(2)}°F</strong></p>

              <div className="d-flex flex-row align-items-center">
                  <p className="mb-0 me-4 widgetText">{weatherInfo.weatherDescription.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                  {/* <i className="fas fa-cloud fa-3x" style={{ color: "#eee" }}></i> */}
                  {weatherIconUrl && <img src={weatherIconUrl} alt="Weather Icon" />}
              </div>
          </div>
      </div>
  )
}

export default WeatherWidget
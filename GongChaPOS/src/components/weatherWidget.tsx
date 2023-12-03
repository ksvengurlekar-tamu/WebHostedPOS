import { useEffect, useState } from 'react'
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
              <strong role="heading" aria-level={1} className="mb-1 sfw-normal widgetTextCity">{weatherInfo.cityName}, {weatherInfo.countryName} </strong>
              <p role="heading" aria-level={2} className="mb-1 widgetText">Current temperature: <strong aria-level={2} className="widgetText">{weatherInfo.currentTemp.toPrecision(2)}°F</strong></p>
              <p role="heading" aria-level={2} className="widgetText">Feels like: <strong aria-level={2} className="widgetText">{weatherInfo.feelsLike.toPrecision(2)}°F</strong></p>
              <p role="heading" aria-level={2} className="widgetText"> Min: <strong aria-level={2} className="widgetText">{weatherInfo.minTemp.toPrecision(2)}°F</strong>, Max: <strong className="widgetText">{weatherInfo.maxTemp.toPrecision(2)}°F</strong></p>
              <div className="d-flex flex-row align-items-center">
                  <p role="heading" aria-level={2} className="mb-0 me-4 widgetText">{weatherInfo.weatherDescription.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                  {weatherIconUrl && <img src={weatherIconUrl} alt="Weather Icon" />}
              </div>
          </div>
      </div>
  )
}

export default WeatherWidget
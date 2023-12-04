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
    <div className="card widget" role="complementary">
      <div className="card-body">
        <h2 className="mb-1 sfw-normal widgetTextCity">{weatherInfo.cityName}, {weatherInfo.countryName}</h2>
        <p className="mb-1 widgetText">
          Current temperature: <strong>{weatherInfo.currentTemp.toPrecision(2)}°F</strong>
        </p>
        <p className="widgetText">
          Feels like: <strong>{weatherInfo.feelsLike.toPrecision(2)}°F</strong>
        </p>
        <p className="widgetText">
          Min: <strong>{weatherInfo.minTemp.toPrecision(2)}°F</strong>, Max: <strong>{weatherInfo.maxTemp.toPrecision(2)}°F</strong>
        </p>
        <div className="d-flex flex-row align-items-center">
          <p className="mb-0 me-4 widgetText">
            {weatherInfo.weatherDescription.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </p>
          {weatherIconUrl && <img src={weatherIconUrl} alt={`Weather icon representing ${weatherInfo.weatherDescription}`} />}
        </div>
      </div>
    </div>
  )
}

export default WeatherWidget
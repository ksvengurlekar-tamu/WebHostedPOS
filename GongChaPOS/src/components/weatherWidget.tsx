import { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.css';

/**
 * Weather Widget Component
 *
 * Displays weather information, including city name, country, current temperature,
 * feels-like temperature, min and max temperatures, weather description, and an icon.
 *
 * @component
 *
 * @param {Object} props - The properties of the WeatherWidget component.
 * @param {Object} props.weatherInfo - An object containing weather information.
 * @param {string} props.weatherInfo.cityName - The name of the city.
 * @param {string} props.weatherInfo.countryName - The name of the country.
 * @param {number} props.weatherInfo.currentTemp - The current temperature in Fahrenheit.
 * @param {number} props.weatherInfo.feelsLike - The feels-like temperature in Fahrenheit.
 * @param {number} props.weatherInfo.maxTemp - The maximum temperature in Fahrenheit.
 * @param {number} props.weatherInfo.minTemp - The minimum temperature in Fahrenheit.
 * @param {string} props.weatherInfo.weatherDescription - The description of the weather.
 * @param {string} props.weatherInfo.weatherIcon - The icon code for the weather representation.
 *
 * @returns {JSX.Element} The rendered WeatherWidget component.
 */
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
      <div className="card-body" role="main" >
        <h2 className="mb-1 sfw-normal widgetTextCity">{weatherInfo.cityName}, {weatherInfo.countryName}</h2>
        <p className="mb-1 widgetText">
          Current temperature: <strong role="heading" aria-level={3}>{weatherInfo.currentTemp.toPrecision(2)}°F</strong>
        </p>
        <p className="widgetText">
          Feels like: <strong role="heading" aria-level={3}>{weatherInfo.feelsLike.toPrecision(2)}°F</strong>
        </p>
        <p className="widgetText">
          Min: <strong role="heading" aria-level={3}>{weatherInfo.minTemp.toPrecision(2)}°F</strong>,
          Max: <strong role="heading" aria-level={3}>{weatherInfo.maxTemp.toPrecision(2)}°F</strong>
        </p>
        <div className="d-flex flex-row align-items-center">
          <span role="heading" aria-level={3} className="mb-0 me-4 widgetText">
            {weatherInfo.weatherDescription.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </span>
          {weatherIconUrl && <img src={weatherIconUrl} alt={`Weather icon representing ${weatherInfo.weatherDescription}`} />}
        </div>
      </div>
    </div>

  )
}

export default WeatherWidget

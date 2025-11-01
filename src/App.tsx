import { useState, KeyboardEvent } from 'react';
import axios from 'axios';
import './App.css';
import { useDynamicTextColour } from './usedynamictextcolour';
type Weather = {
  name: string;
  sys: { country: string };
  main: { temp: number; feels_like: number; humidity: number };
  weather: Array<{ description: string; icon: string }>;
  wind: { speed: number };
};

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API = 'https://api.openweathermap.org/data/2.5/weather';
  const KEY = import.meta.env.VITE_OPENWEATHER_KEY ?? 'f00c38e0279b7bc85480c3fe775d518c';

  const textColour = useDynamicTextColour();

  const fetchWeather = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get(API, { params: { q: city, units: 'metric', appid: KEY } });
      setWeather(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'City not found');
      } else {
        setError('An unexpected error occurred');
      }
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && fetchWeather();

  const currentDate = () =>
    new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="aurora-bg">
      <div className="card dynamic-text" style={{ '--text-color': textColour } as React.CSSProperties}>
        <h1 className="title dynamic-text"> Weather</h1>

        <div className="search-box">
         <input
  className="search-input"
  placeholder="City name…"
  value={city}
  onChange={(e) => setCity(e.target.value)}
  onKeyDown={handleKey}
/>
          <button className="search-btn" onClick={fetchWeather} disabled={loading}>
            {loading ? <span className="pulse" /> : 'Search'}
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        {weather && (
          <div className="weather-tile dynamic-text">
            <div className="header">
              <h3>{weather.name}, <span>{weather.sys.country}</span></h3>
              <p className="date">{currentDate()}</p>
            </div>

            <div className="body">
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                alt={weather.weather[0].description}
              />
              <div className="temp">{Math.round(weather.main.temp)}°C</div>
              <div className="desc">{weather.weather[0].description}</div>
            </div>

            <div className="footer">
              <span>Feels like {Math.round(weather.main.feels_like)}°C</span>
              <span>Humidity {weather.main.humidity}%</span>
              <span>Wind {weather.wind.speed} m/s</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
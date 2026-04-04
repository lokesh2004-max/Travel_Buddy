import React from 'react';

interface WeatherData {
  temp: string;
  condition: string;
  icon: string;
}

const weatherMap: Record<string, WeatherData> = {
  goa:    { temp: '30°C', condition: 'Sunny',  icon: '☀️' },
  manali: { temp: '12°C', condition: 'Cold',   icon: '🏔️' },
  kerala: { temp: '28°C', condition: 'Humid',  icon: '🌤️' },
  shimla: { temp: '10°C', condition: 'Chilly', icon: '❄️' },
  kashmir:{ temp: '8°C',  condition: 'Snowy',  icon: '🌨️' },
  delhi:  { temp: '35°C', condition: 'Hot',    icon: '🔥' },
  mumbai: { temp: '32°C', condition: 'Humid',  icon: '🌧️' },
};

const defaultWeather: WeatherData = { temp: '25°C', condition: 'Pleasant', icon: '🌤️' };

interface WeatherCardProps {
  location: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ location }) => {
  const weather = weatherMap[location.toLowerCase()] || defaultWeather;

  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      {weather.icon} {weather.temp} · {weather.condition}
    </span>
  );
};

export default WeatherCard;

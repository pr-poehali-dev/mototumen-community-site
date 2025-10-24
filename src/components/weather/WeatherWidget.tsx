import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface WeatherData {
  temperature: number;
  condition: string;
  wind_speed: number;
  road_condition: string;
  description: string;
  demo?: boolean;
}

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/6d43ea57-e8e2-4fe3-8ec4-8ae89a2aac87');
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error('Failed to fetch weather:', error);
        setWeather({
          temperature: 15,
          condition: 'clear',
          wind_speed: 5,
          road_condition: 'dry',
          description: 'Ясно',
          demo: true
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 3600000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherAnimation = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'rain':
      case 'drizzle':
        return (
          <div className="relative w-12 h-12">
            <Icon name="CloudRain" className="w-12 h-12 text-blue-400 animate-pulse" />
            <div className="absolute top-8 left-3 space-y-1">
              <div className="w-1 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-1 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        );
      case 'thunderstorm':
        return (
          <div className="relative w-12 h-12">
            <Icon name="CloudLightning" className="w-12 h-12 text-yellow-400 animate-pulse" />
          </div>
        );
      case 'snow':
        return (
          <div className="relative w-12 h-12">
            <Icon name="Snowflake" className="w-12 h-12 text-blue-200 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
        );
      case 'clouds':
        return <Icon name="Cloud" className="w-12 h-12 text-gray-300 animate-pulse" />;
      case 'clear':
        return (
          <div className="relative w-12 h-12">
            <Icon name="Sun" className="w-12 h-12 text-yellow-400 animate-spin" style={{ animationDuration: '10s' }} />
            <div className="absolute inset-0 bg-yellow-300/20 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
          </div>
        );
      default:
        return <Icon name="Sun" className="w-12 h-12 text-yellow-400" />;
    }
  };

  const getRoadIcon = (condition: string) => {
    switch (condition) {
      case 'wet':
        return <Icon name="Droplets" className="w-4 h-4 text-blue-400" />;
      case 'icy':
        return <Icon name="Snowflake" className="w-4 h-4 text-blue-200" />;
      case 'dry':
      default:
        return <Icon name="CheckCircle" className="w-4 h-4 text-green-400" />;
    }
  };

  const getRoadText = (condition: string) => {
    switch (condition) {
      case 'wet':
        return 'Мокрая';
      case 'icy':
        return 'Гололёд';
      case 'dry':
      default:
        return 'Сухая';
    }
  };

  if (loading) {
    return (
      <div className="w-32 md:w-48">
        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-1.5">
          <div className="flex items-center justify-center">
            <Icon name="Loader" className="w-4 h-4 text-orange-500 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="w-24 md:w-40 animate-fade-in">
      <div className="bg-transparent rounded p-0.5 md:p-1.5">
        <div className="space-y-0 md:space-y-1">
          <div className="flex items-center justify-between mb-0">
            <div className="flex items-center gap-0.5">
              <Icon name="MapPin" className="w-1.5 h-1.5 md:w-3 md:h-3 text-white" />
              <span className="text-white text-[7px] md:text-[11px] font-medium">Тюмень</span>
            </div>
            {weather.demo && (
              <span className="text-[6px] md:text-[9px] text-white/60">DEMO</span>
            )}
          </div>

          <div className="flex items-center justify-between gap-0.5 -my-0.5">
            <div className="scale-[0.35] md:scale-[0.55] origin-left -ml-2.5">
              {getWeatherAnimation(weather.condition)}
            </div>
            <div className="text-right">
              <div className="text-base md:text-xl font-bold text-white leading-none">
                {weather.temperature > 0 ? '+' : ''}{weather.temperature}°
              </div>
              <div className="text-[7px] md:text-[9px] text-white/80 capitalize leading-tight mt-0.5">
                {weather.description}
              </div>
            </div>
          </div>

          <div className="space-y-0 pt-0.5 md:pt-1 border-t border-white/20">
            <div className="flex items-center justify-between text-[7px] md:text-[10px] leading-none py-0.5">
              <div className="flex items-center gap-0.5">
                <Icon name="Wind" className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 text-white" />
                <span className="text-white/90">Ветер</span>
              </div>
              <span className="text-white font-medium">{weather.wind_speed}</span>
            </div>

            <div className="flex items-center justify-between text-[7px] md:text-[10px] leading-none py-0.5">
              <div className="flex items-center gap-0.5">
                {getRoadIcon(weather.road_condition)}
                <span className="text-white/90">Дорога</span>
              </div>
              <span className="text-white font-medium">{getRoadText(weather.road_condition)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
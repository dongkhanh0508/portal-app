import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Avatar,
} from '@mui/material';
import {
  WbSunny,
  Cloud,
  Grain,
  AcUnit,
  Thunderstorm,
} from '@mui/icons-material';
import { WeatherWidget as WeatherWidgetType } from '@/types/widgets';

interface WeatherWidgetProps {
  widget: WeatherWidgetType;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ widget }) => {
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState({
    temperature: 22,
    condition: 'sunny',
    humidity: 65,
    windSpeed: 12,
    forecast: [
      { day: 'Today', high: 24, low: 18, condition: 'sunny' },
      { day: 'Tomorrow', high: 26, low: 20, condition: 'cloudy' },
      { day: 'Friday', high: 23, low: 17, condition: 'rainy' },
    ],
  });

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <WbSunny sx={{ color: '#ffa726' }} />;
      case 'cloudy':
        return <Cloud sx={{ color: '#90a4ae' }} />;
      case 'rainy':
        return <Grain sx={{ color: '#42a5f5' }} />;
      case 'snowy':
        return <AcUnit sx={{ color: '#e1f5fe' }} />;
      case 'stormy':
        return <Thunderstorm sx={{ color: '#5e35b1' }} />;
      default:
        return <WbSunny sx={{ color: '#ffa726' }} />;
    }
  };

  const formatTemperature = (temp: number) => {
    return widget.config.units === 'fahrenheit'
      ? `${Math.round(temp * 9/5 + 32)}°F`
      : `${temp}°C`;
  };

  if (loading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      {/* Current Weather */}
      <Box textAlign="center" mb={2}>
        <Avatar
          sx={{
            width: 60,
            height: 60,
            bgcolor: 'transparent',
            mx: 'auto',
            mb: 1,
          }}
        >
          {getWeatherIcon(weatherData.condition)}
        </Avatar>

        <Typography variant="h4" component="div" gutterBottom>
          {formatTemperature(weatherData.temperature)}
        </Typography>

        <Typography variant="body2" color="textSecondary" gutterBottom>
          {widget.config.location}
        </Typography>

        <Box display="flex" justifyContent="space-around" mt={1}>
          <Box textAlign="center">
            <Typography variant="caption" color="textSecondary">
              Humidity
            </Typography>
            <Typography variant="body2">
              {weatherData.humidity}%
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="caption" color="textSecondary">
              Wind
            </Typography>
            <Typography variant="body2">
              {weatherData.windSpeed} km/h
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Forecast */}
      {widget.config.showForecast && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Forecast
          </Typography>
          {weatherData.forecast.map((day, index) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              py={0.5}
            >
              <Typography variant="body2" sx={{ minWidth: 60 }}>
                {day.day}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                {getWeatherIcon(day.condition)}
                <Typography variant="body2">
                  {formatTemperature(day.high)}/{formatTemperature(day.low)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default WeatherWidget;

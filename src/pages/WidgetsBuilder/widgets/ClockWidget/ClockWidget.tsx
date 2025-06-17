import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { ClockWidget as ClockWidgetType } from '@/types/widgets';

interface ClockWidgetProps {
  widget: ClockWidgetType;
}

const ClockWidget: React.FC<ClockWidgetProps> = ({ widget }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      ...(widget.config.showSeconds && { second: '2-digit' }),
      hour12: widget.config.format === '12h',
      timeZone: widget.config.timezone,
    };

    return date.toLocaleTimeString('en-US', options);
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: widget.config.timezone,
    };

    return date.toLocaleDateString('en-US', options);
  };

  return (
    <Box
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <Typography
        variant="h3"
        component="div"
        sx={{
          fontFamily: 'monospace',
          fontWeight: 'bold',
          mb: 1,
        }}
      >
        {formatTime(time)}
      </Typography>

      {widget.config.showDate && (
        <Typography variant="body2" color="textSecondary">
          {formatDate(time)}
        </Typography>
      )}

      <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
        {widget.config.timezone.replace('_', ' ')}
      </Typography>
    </Box>
  );
};

export default ClockWidget;

import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Grid,
  Paper,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today,
  Event,
} from '@mui/icons-material';
import { CalendarWidget as CalendarWidgetType } from '@/types/widgets';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  color: string;
}

interface CalendarWidgetProps {
  widget: CalendarWidgetType;
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({ widget }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Team Meeting',
      date: new Date(2024, new Date().getMonth(), 15),
      color: '#2196f3',
    },
    {
      id: '2',
      title: 'Project Deadline',
      date: new Date(2024, new Date().getMonth(), 20),
      color: '#f44336',
    },
    {
      id: '3',
      title: 'Client Call',
      date: new Date(2024, new Date().getMonth(), 25),
      color: '#4caf50',
    },
  ]);

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (day: number) => {
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  const getEventsForDay = (day: number) => {
    return events.filter(event =>
      event.date.getDate() === day &&
      event.date.getMonth() === month &&
      event.date.getFullYear() === year
    );
  };

  const isWeekend = (dayIndex: number) => {
    return dayIndex === 0 || dayIndex === 6;
  };

  const renderCalendarDays = () => {
    const days = [];

    // Previous month's trailing days
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(
        <Grid item xs key={`prev-${i}`}>
          <Box sx={{ height: 40 }} />
        </Grid>
      );
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      const dayEvents = getEventsForDay(day);
      const isWeekendDay = isWeekend(dayDate.getDay());

      days.push(
        <Grid item xs key={day}>
          <Paper
            elevation={0}
            sx={{
              height: 40,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              cursor: 'pointer',
              backgroundColor: isToday(day) ? 'primary.main' : 'transparent',
              color: isToday(day) ? 'white' : isWeekendDay && !widget.config.showWeekends ? 'text.disabled' : 'text.primary',
              '&:hover': {
                backgroundColor: isToday(day) ? 'primary.dark' : 'action.hover',
              },
              opacity: !widget.config.showWeekends && isWeekendDay ? 0.5 : 1,
            }}
          >
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
              {day}
            </Typography>

            {dayEvents.length > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 2,
                  display: 'flex',
                  gap: 0.5,
                }}
              >
                {dayEvents.slice(0, 2).map((event, index) => (
                  <Tooltip key={event.id} title={event.title}>
                    <Box
                      sx={{
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        backgroundColor: event.color,
                      }}
                    />
                  </Tooltip>
                ))}
                {dayEvents.length > 2 && (
                  <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>
                    +{dayEvents.length - 2}
                  </Typography>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      );
    }

    return days;
  };

  const upcomingEvents = events
    .filter(event => event.date >= today)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3);

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" sx={{ fontSize: '1rem' }}>
          {monthNames[month]} {year}
        </Typography>

        <Box>
          <IconButton size="small" onClick={previousMonth}>
            <ChevronLeft fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={goToToday}>
            <Today fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={nextMonth}>
            <ChevronRight fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Calendar Grid */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {/* Day Headers */}
        <Grid container spacing={0} sx={{ mb: 1 }}>
          {dayNames.map((day, index) => (
            <Grid item xs key={day}>
              <Typography
                variant="caption"
                align="center"
                sx={{
                  display: 'block',
                  fontWeight: 'bold',
                  color: isWeekend(index) ? 'text.disabled' : 'text.secondary',
                }}
              >
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {/* Calendar Days */}
        <Grid container spacing={0.5}>
          {renderCalendarDays()}
        </Grid>
      </Box>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontSize: '0.875rem' }}>
            Upcoming Events
          </Typography>

          {upcomingEvents.map((event) => (
            <Box key={event.id} display="flex" alignItems="center" gap={1} mb={1}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: event.color,
                }}
              />
              <Typography variant="body2" sx={{ fontSize: '0.75rem', flexGrow: 1 }}>
                {event.title}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {event.date.getDate()}/{event.date.getMonth() + 1}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CalendarWidget;

import React, { Suspense } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import WidgetErrorBoundary from '../WidgetErrorBoundary/WidgetErrorBoundary';
import { Widget } from '@/types/widgets';

// Lazy load widgets for better performance
const WeatherWidget = React.lazy(() => import('../../widgets/WeatherWidget/WeatherWidget'));
const NewsWidget = React.lazy(() => import('../../widgets/NewsWidget/NewsWidget'));
const CalculatorWidget = React.lazy(() => import('../../widgets/CalculatorWidget/CalculatorWidget'));
const ClockWidget = React.lazy(() => import('../../widgets/ClockWidget/ClockWidget'));
const TodoWidget = React.lazy(() => import('../../widgets/TodoWidget/TodoWidget'));
const CalendarWidget = React.lazy(() => import('../../widgets/CalendarWidget/CalendarWidget'));
const NotesWidget = React.lazy(() => import('../../widgets/NotesWidget/NotesWidget'));
const ChartWidget = React.lazy(() => import('../../widgets/ChartWidget/ChartWidget'));

interface WidgetRendererProps {
  widget: Widget;
}

const LoadingFallback = () => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    height="100%"
    flexDirection="column"
    gap={1}
  >
    <CircularProgress size={24} />
    <Typography variant="caption" color="textSecondary">
      Loading...
    </Typography>
  </Box>
);

const WidgetRenderer: React.FC<WidgetRendererProps> = ({ widget }) => {
  const renderWidget = () => {
    switch (widget.type) {
      case 'weather':
        return <WeatherWidget widget={widget as any} />;
      case 'news':
        return <NewsWidget widget={widget as any} />;
      case 'calculator':
        return <CalculatorWidget widget={widget as any} />;
      case 'clock':
        return <ClockWidget widget={widget as any} />;
      case 'todo':
        return <TodoWidget widget={widget as any} />;
      case 'calendar':
        return <CalendarWidget widget={widget as any} />;
      case 'notes':
        return <NotesWidget widget={widget as any} />;
      case 'chart':
        return <ChartWidget widget={widget as any} />;
      default:
        return (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
            p={2}
            textAlign="center"
          >
            <Typography color="error" variant="body2">
              Unknown widget type: {widget.type}
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <WidgetErrorBoundary widgetTitle={widget.title}>
        <Suspense fallback={<LoadingFallback />}>
          {renderWidget()}
        </Suspense>
      </WidgetErrorBoundary>
    </Box>
  );
};

export default WidgetRenderer;

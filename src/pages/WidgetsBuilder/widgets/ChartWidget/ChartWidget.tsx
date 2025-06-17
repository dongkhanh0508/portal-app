import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Select,
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material';
import {
  MoreVert,
  Refresh,
  TrendingUp,
  BarChart,
  PieChart,
  ShowChart,
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { ChartWidget as ChartWidgetType } from '@/types/widgets';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartWidgetProps {
  widget: ChartWidgetType;
}

const ChartWidget: React.FC<ChartWidgetProps> = ({ widget }) => {
  const [loading, setLoading] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [chartType, setChartType] = useState(widget.config.chartType);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Sample data - in real app, this would come from API
  const [chartData, setChartData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 205, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 2,
        fill: chartType === 'line',
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 12,
        },
        bodyFont: {
          size: 11,
        },
      },
    },
    scales: chartType === 'pie' || chartType === 'doughnut' ? {} : {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 10,
          },
        },
      },
    },
  };

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-refresh data based on refresh interval
    const interval = setInterval(() => {
      refreshData();
    }, widget.config.refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [widget.config.refreshInterval]);

  const refreshData = () => {
    setLoading(true);

    // Simulate API call with random data
    setTimeout(() => {
      const newData = chartData.datasets[0].data.map(() =>
        Math.floor(Math.random() * 20) + 1
      );

      setChartData(prev => ({
        ...prev,
        datasets: [
          {
            ...prev.datasets[0],
            data: newData,
          },
        ],
      }));

      setLastUpdated(new Date());
      setLoading(false);
    }, 500);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleChartTypeChange = (newType: string) => {
    setChartType(newType);

    // Update chart data based on type
    setChartData(prev => ({
      ...prev,
      datasets: [
        {
          ...prev.datasets[0],
          fill: newType === 'line',
        },
      ],
    }));

    handleMenuClose();
  };

  const getChartIcon = (type: string) => {
    switch (type) {
      case 'line':
        return <ShowChart fontSize="small" />;
      case 'bar':
        return <BarChart fontSize="small" />;
      case 'pie':
      case 'doughnut':
        return <PieChart fontSize="small" />;
      default:
        return <TrendingUp fontSize="small" />;
    }
  };

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      options: chartOptions,
    };

    switch (chartType) {
      case 'line':
        return <Line {...commonProps} />;
      case 'bar':
        return <Bar {...commonProps} />;
      case 'pie':
        return <Pie {...commonProps} />;
      case 'doughnut':
        return <Doughnut {...commonProps} />;
      default:
        return <Line {...commonProps} />;
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100%"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={32} />
        <Typography variant="body2" color="textSecondary">
          Loading chart data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          {getChartIcon(chartType)}
          <Typography variant="subtitle2">
            {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart
          </Typography>
          <Chip
            size="small"
            label="Live"
            color="success"
            variant="outlined"
            sx={{ fontSize: '0.7rem', height: 20 }}
          />
        </Box>

        <Box>
          <IconButton size="small" onClick={refreshData} disabled={loading}>
            <Refresh fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVert fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Chart */}
      <Box sx={{ flex: 1, position: 'relative', minHeight: 200 }}>
        {renderChart()}
      </Box>

      {/* Footer */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
        <Typography variant="caption" color="textSecondary">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </Typography>

        <Typography variant="caption" color="textSecondary">
          Refresh: {widget.config.refreshInterval}s
        </Typography>
      </Box>

      {/* Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2">Chart Type</Typography>
        </MenuItem>

        {['line', 'bar', 'pie', 'doughnut'].map((type) => (
          <MenuItem
            key={type}
            onClick={() => handleChartTypeChange(type)}
            selected={chartType === type}
            sx={{ pl: 3 }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              {getChartIcon(type)}
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Box>
          </MenuItem>
        ))}

        <MenuItem onClick={refreshData}>
          <Refresh fontSize="small" sx={{ mr: 1 }} />
          Refresh Data
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ChartWidget;

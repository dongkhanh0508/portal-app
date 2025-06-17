import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Link,
} from '@mui/material';
import {
  Article,
  MoreVert,
  Refresh,
  OpenInNew,
  Schedule,
} from '@mui/icons-material';
import { NewsWidget as NewsWidgetType } from '@/types/widgets';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: Date;
  category: string;
  imageUrl?: string;
}

interface NewsWidgetProps {
  widget: NewsWidgetType;
}

const NewsWidget: React.FC<NewsWidgetProps> = ({ widget }) => {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  // Sample news data
  const sampleNews: NewsItem[] = [
    {
      id: '1',
      title: 'Tech Giants Report Strong Q4 Earnings',
      description: 'Major technology companies exceeded expectations in their quarterly reports...',
      url: '#',
      source: 'TechNews',
      publishedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      category: 'technology',
    },
    {
      id: '2',
      title: 'Climate Summit Reaches Historic Agreement',
      description: 'World leaders agree on ambitious climate targets for the next decade...',
      url: '#',
      source: 'Global Times',
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      category: 'environment',
    },
    {
      id: '3',
      title: 'New Medical Breakthrough in Cancer Research',
      description: 'Scientists discover promising new treatment method with 90% success rate...',
      url: '#',
      source: 'Medical Journal',
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      category: 'health',
    },
    {
      id: '4',
      title: 'Stock Markets Hit Record Highs',
      description: 'Global markets continue their upward trend as investors remain optimistic...',
      url: '#',
      source: 'Financial Times',
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      category: 'business',
    },
    {
      id: '5',
      title: 'Space Mission Successfully Lands on Mars',
      description: 'Latest rover mission provides new insights into the red planet...',
      url: '#',
      source: 'Space News',
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      category: 'science',
    },
  ];

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setNews(sampleNews.slice(0, widget.config.maxItems));
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [widget.config.maxItems]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setNews([...sampleNews].slice(0, widget.config.maxItems));
      setLoading(false);
    }, 1000);
    handleMenuClose();
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      technology: '#2196f3',
      business: '#4caf50',
      health: '#f44336',
      science: '#9c27b0',
      environment: '#8bc34a',
      sports: '#ff9800',
      entertainment: '#e91e63',
      politics: '#607d8b',
    };
    return colors[category] || '#9e9e9e';
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
          Loading latest news...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        borderBottom={1}
        borderColor="divider"
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Article color="primary" />
          <Typography variant="h6" sx={{ fontSize: '1rem' }}>
            Latest News
          </Typography>
          <Chip
            size="small"
            label={widget.config.category}
            color="primary"
            variant="outlined"
          />
        </Box>

        <IconButton size="small" onClick={handleMenuOpen}>
          <MoreVert />
        </IconButton>
      </Box>

      {/* News List */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List dense>
          {news.map((item, index) => (
            <ListItem
              key={item.id}
              sx={{
                borderBottom: index < news.length - 1 ? 1 : 0,
                borderColor: 'divider',
                alignItems: 'flex-start',
                py: 1.5,
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: getCategoryColor(item.category),
                    width: 32,
                    height: 32,
                  }}
                >
                  <Article fontSize="small" />
                </Avatar>
              </ListItemAvatar>

              <ListItemText
                primary={
                  <Link
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="inherit"
                    underline="hover"
                    sx={{
                      display: 'block',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      lineHeight: 1.3,
                      mb: 0.5,
                    }}
                  >
                    {item.title}
                  </Link>
                }
                secondary={
                  <Box>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{
                        fontSize: '0.75rem',
                        lineHeight: 1.3,
                        mb: 0.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {item.description}
                    </Typography>

                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{ fontSize: '0.7rem' }}
                      >
                        {item.source}
                      </Typography>

                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Schedule sx={{ fontSize: 12 }} color="disabled" />
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          sx={{ fontSize: '0.7rem' }}
                        >
                          {formatTimeAgo(item.publishedAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                }
              />

              <IconButton
                size="small"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mt: 0.5 }}
              >
                <OpenInNew fontSize="small" />
              </IconButton>
            </ListItem>
          ))}
        </List>

        {news.length === 0 && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={4}
          >
            <Article sx={{ fontSize: 48, color: 'action.disabled', mb: 1 }} />
                        <Typography color="textSecondary">
              No news available
            </Typography>
          </Box>
        )}
      </Box>

      {/* Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleRefresh}>
          <Refresh fontSize="small" sx={{ mr: 1 }} />
          Refresh News
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <OpenInNew fontSize="small" sx={{ mr: 1 }} />
          View All News
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default NewsWidget;



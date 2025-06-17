import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Chip,
  Paper,
} from '@mui/material';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import {
  Close,
  WbSunny,
  Article,
  Calculate,
  AccessTime,
  CheckBox,
  CalendarMonth,
  StickyNote2,
  BarChart,
  DragIndicator,
} from '@mui/icons-material';
import { WidgetType } from '@/types/widgets';
import './WidgetSidebar.scss';

interface WidgetOption {
  type: WidgetType;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  size: string;
  color: string;
}

interface WidgetSidebarProps {
  onAddWidget: (type: WidgetType) => void;
  onClose?: () => void;
}

const widgetOptions: WidgetOption[] = [
  {
    type: 'weather',
    title: 'Weather',
    description: 'Current weather and forecast',
    icon: <WbSunny />,
    category: 'Information',
    size: '2x2',
    color: '#2196f3',
  },
  {
    type: 'news',
    title: 'News Feed',
    description: 'Latest news and articles',
    icon: <Article />,
    category: 'Information',
    size: '2x3',
    color: '#f44336',
  },
  {
    type: 'calculator',
    title: 'Calculator',
    description: 'Basic and scientific calculator',
    icon: <Calculate />,
    category: 'Tools',
    size: '2x3',
    color: '#ff9800',
  },
  {
    type: 'clock',
    title: 'Clock',
    description: 'Digital and analog clock',
    icon: <AccessTime />,
    category: 'Information',
    size: '2x2',
    color: '#9c27b0',
  },
  {
    type: 'todo',
    title: 'Todo List',
    description: 'Task management and reminders',
    icon: <CheckBox />,
    category: 'Productivity',
    size: '2x3',
    color: '#4caf50',
  },
  {
    type: 'calendar',
    title: 'Calendar',
    description: 'Monthly calendar view',
    icon: <CalendarMonth />,
    category: 'Productivity',
    size: '3x3',
    color: '#3f51b5',
  },
  {
    type: 'notes',
    title: 'Sticky Notes',
    description: 'Quick notes and reminders',
    icon: <StickyNote2 />,
    category: 'Productivity',
    size: '2x2',
    color: '#ffeb3b',
  },
  {
    type: 'chart',
    title: 'Charts',
    description: 'Data visualization charts',
    icon: <BarChart />,
    category: 'Analytics',
    size: '3x2',
    color: '#607d8b',
  },
];

const categories = Array.from(new Set(widgetOptions.map(w => w.category)));

const WidgetSidebar: React.FC<WidgetSidebarProps> = ({ onAddWidget, onClose }) => {
  return (
    <Box className="widget-sidebar" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">Add Widgets</Typography>
        {onClose && (
          <IconButton size="small" onClick={onClose}>
            <Close />
          </IconButton>
        )}
      </Box>

      {/* Widget List */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
        <Droppable droppableId="widget-sidebar" isDropDisabled={true}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                backgroundColor: snapshot.isDraggingOver ? 'rgba(0,0,0,0.05)' : 'transparent',
                minHeight: '100%',
              }}
            >
              {categories.map((category) => (
                <Box key={category} sx={{ mb: 2 }}>
                  <Typography
                    variant="overline"
                    sx={{
                      px: 1,
                      color: 'text.secondary',
                      fontWeight: 'bold',
                      fontSize: '0.75rem',
                    }}
                  >
                    {category}
                  </Typography>

                  <List dense sx={{ pt: 0.5 }}>
                    {widgetOptions
                      .filter(widget => widget.category === category)
                      .map((widget, index) => {
                        const globalIndex = widgetOptions.findIndex(w => w.type === widget.type);
                        return (
                          <Draggable
                            key={widget.type}
                            draggableId={widget.type}
                            index={globalIndex}
                          >
                            {(provided, snapshot) => (
                              <Paper
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                elevation={snapshot.isDragging ? 4 : 0}
                                sx={{
                                  mb: 1,
                                  backgroundColor: snapshot.isDragging
                                    ? 'background.paper'
                                    : 'transparent',
                                  transform: snapshot.isDragging
                                    ? 'rotate(5deg)'
                                    : 'none',
                                  transition: 'all 0.2s ease',
                                  border: snapshot.isDragging
                                    ? '2px dashed'
                                    : '1px solid transparent',
                                  borderColor: snapshot.isDragging
                                    ? 'primary.main'
                                    : 'transparent',
                                }}
                              >
                                <ListItem
                                  button
                                  onClick={() => onAddWidget(widget.type)}
                                  sx={{
                                    borderRadius: 1,
                                    '&:hover': {
                                      backgroundColor: 'action.hover',
                                    },
                                  }}
                                >
                                  <Box
                                    {...provided.dragHandleProps}
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      mr: 1,
                                      color: 'text.disabled',
                                      cursor: 'grab',
                                      '&:active': {
                                        cursor: 'grabbing',
                                      },
                                    }}
                                  >
                                    <DragIndicator fontSize="small" />
                                  </Box>

                                  <ListItemIcon
                                    sx={{
                                      color: widget.color,
                                      minWidth: 36,
                                    }}
                                  >
                                    {widget.icon}
                                  </ListItemIcon>

                                  <ListItemText
                                    primary={
                                      <Box display="flex" alignItems="center" gap={1}>
                                        <Typography variant="body2" fontWeight="medium">
                                          {widget.title}
                                        </Typography>
                                        <Chip
                                          label={widget.size}
                                          size="small"
                                          variant="outlined"
                                          sx={{
                                            height: 16,
                                            fontSize: '0.6rem',
                                            '& .MuiChip-label': {
                                              px: 0.5,
                                            },
                                          }}
                                        />
                                      </Box>
                                    }
                                    secondary={
                                      <Typography
                                        variant="caption"
                                        color="textSecondary"
                                        sx={{ fontSize: '0.7rem' }}
                                      >
                                        {widget.description}
                                      </Typography>
                                    }
                                  />
                                </ListItem>
                              </Paper>
                            )}
                          </Draggable>
                        );
                      })}
                  </List>
                </Box>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Box>

      {/* Instructions */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          backgroundColor: 'grey.50',
        }}
      >
        <Typography variant="caption" color="textSecondary" align="center" display="block">
          💡 Drag widgets to the grid or click to add them
        </Typography>
      </Box>
    </Box>
  );
};

export default WidgetSidebar;

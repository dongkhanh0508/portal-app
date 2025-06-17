import React, { useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Drawer,
  useTheme,
  useMediaQuery,
  Fab,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Add,
  Menu as MenuIcon,
  Save,
  Download,
  Upload,
  Settings,
  Close,
} from '@mui/icons-material';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';

import { Widget, WidgetType } from '@/types/widgets';
import { v4 as uuidv4 } from 'uuid';
import './WidgetsBuilderPage.scss';
import WidgetGrid from './widgets/WidgetGrid/WidgetGrid';
import WidgetSidebar from './WidgetSidebar/WidgetSidebar';
import WidgetConfigDialog from './WidgetConfigDialog/WidgetConfigDialog';

const WidgetsBuilderPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [configWidget, setConfigWidget] = useState<Widget | null>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const showNotification = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setNotification({ open: true, message, severity });
  };

  const createWidget = useCallback((type: WidgetType): Widget => {
    const baseWidget = {
      id: uuidv4(),
      type,
      position: { x: 0, y: 0 },
      size: { width: 2, height: 2 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    switch (type) {
      case 'weather':
        return {
          ...baseWidget,
          title: 'Weather',
          config: {
            location: 'New York',
            units: 'metric' as const,
            showForecast: true,
            refreshInterval: 300,
          },
        };

      case 'news':
        return {
          ...baseWidget,
          title: 'Latest News',
          config: {
            category: 'general',
            sources: [],
            maxItems: 5,
            showImages: true,
            showSource: true,
            refreshInterval: 600,
          },
        };

      case 'calculator':
        return {
          ...baseWidget,
          title: 'Calculator',
          size: { width: 2, height: 3 },
          config: {
            scientific: false,
            theme: 'light' as const,
            precision: 10,
          },
        };

      case 'clock':
        return {
          ...baseWidget,
          title: 'Clock',
          config: {
            timezone: 'local',
            format: '12h' as const,
            showDate: true,
            showSeconds: true,
            theme: 'analog' as const,
          },
        };

      case 'todo':
        return {
          ...baseWidget,
          title: 'Todo List',
          size: { width: 2, height: 3 },
          config: {
            maxItems: 10,
            showCompleted: true,
            categories: ['work', 'personal'],
            sortBy: 'created' as const,
            defaultPriority: 'medium' as const,
          },
        };

      case 'calendar':
        return {
          ...baseWidget,
          title: 'Calendar',
          size: { width: 3, height: 3 },
          config: {
            view: 'month' as const,
            showWeekends: true,
            firstDayOfWeek: 0,
            showEventColors: true,
            timeFormat: '12h' as const,
          },
        };

      case 'notes':
        return {
          ...baseWidget,
          title: 'Sticky Notes',
          size: { width: 2, height: 2 },
          config: {
            backgroundColor: '#fff59d',
            fontSize: 14,
            fontFamily: 'Arial',
            autoSave: true,
            wordWrap: true,
          },
        };

      case 'chart':
        return {
          ...baseWidget,
          title: 'Chart',
          size: { width: 3, height: 2 },
          config: {
            chartType: 'line' as const,
            dataSource: 'sample',
            refreshInterval: 60,
            showLegend: true,
            showGrid: true,
            animationDuration: 1000,
          },
        };

      default:
        return {
          ...baseWidget,
          title: 'Unknown Widget',
          config: {},
        };
    }
  }, []);

  const handleAddWidget = useCallback((type: WidgetType) => {
    const newWidget = createWidget(type);

    // Find an empty position
    const findEmptyPosition = () => {
      const gridSize = 12;
      const maxRows = 20;

      for (let y = 0; y < maxRows; y++) {
        for (let x = 0; x <= gridSize - newWidget.size.width; x++) {
          const position = { x, y };
          const overlaps = widgets.some(widget => {
            const widgetRight = widget.position.x + widget.size.width;
            const widgetBottom = widget.position.y + widget.size.height;
            const newRight = position.x + newWidget.size.width;
            const newBottom = position.y + newWidget.size.height;

            return !(
              position.x >= widgetRight ||
              newRight <= widget.position.x ||
              position.y >= widgetBottom ||
              newBottom <= widget.position.y
            );
          });

          if (!overlaps) {
            return position;
          }
        }
      }

      return { x: 0, y: 0 };
    };

    newWidget.position = findEmptyPosition();
    setWidgets(prev => [...prev, newWidget]);
    showNotification(`${newWidget.title} widget added successfully!`, 'success');

    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [widgets, createWidget, isMobile]);

  const handleDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If dropped outside any droppable area
    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Handle drag from sidebar to grid
    if (source.droppableId === 'widget-sidebar' && destination.droppableId === 'widget-grid') {
      const widgetType = draggableId as WidgetType;
      handleAddWidget(widgetType);
      return;
    }

    // Handle reordering within grid
    if (source.droppableId === 'widget-grid' && destination.droppableId === 'widget-grid') {
      const newWidgets = Array.from(widgets);
      const [reorderedWidget] = newWidgets.splice(source.index, 1);
      newWidgets.splice(destination.index, 0, reorderedWidget);
      setWidgets(newWidgets);
      return;
    }
  }, [widgets, handleAddWidget]);

  const handleWidgetUpdate = useCallback((updatedWidget: Widget) => {
    setWidgets(prev =>
      prev.map(widget =>
        widget.id === updatedWidget.id ? updatedWidget : widget
      )
    );
    showNotification('Widget updated successfully!', 'success');
  }, []);

  const handleWidgetDelete = useCallback((widgetId: string) => {
    setWidgets(prev => prev.filter(widget => widget.id !== widgetId));
    showNotification('Widget deleted successfully!', 'success');
  }, []);

  const handleWidgetConfigure = useCallback((widget: Widget) => {
    setConfigWidget(widget);
  }, []);

  const handleSaveLayout = useCallback(() => {
    try {
      const layoutData = {
        widgets,
        savedAt: new Date().toISOString(),
        version: '1.0',
      };
      localStorage.setItem('widget-layout', JSON.stringify(layoutData));
      showNotification('Layout saved successfully!', 'success');
    } catch (error) {
      showNotification('Failed to save layout', 'error');
    }
  }, [widgets]);

  const handleLoadLayout = useCallback(() => {
    try {
      const savedLayout = localStorage.getItem('widget-layout');
      if (savedLayout) {
        const layoutData = JSON.parse(savedLayout);
        setWidgets(layoutData.widgets || []);
        showNotification('Layout loaded successfully!', 'success');
      } else {
        showNotification('No saved layout found', 'info');
      }
    } catch (error) {
      showNotification('Failed to load layout', 'error');
    }
  }, []);

  const handleExportLayout = useCallback(() => {
    try {
      const layoutData = {
        widgets,
        exportedAt: new Date().toISOString(),
        version: '1.0',
      };
      const dataStr = JSON.stringify(layoutData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `widget-layout-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      showNotification('Layout exported successfully!', 'success');
    } catch (error) {
      showNotification('Failed to export layout', 'error');
    }
  }, [widgets]);

  const handleImportLayout = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const layoutData = JSON.parse(e.target?.result as string);
            setWidgets(layoutData.widgets || []);
            showNotification('Layout imported successfully!', 'success');
          } catch (error) {
            showNotification('Failed to import layout', 'error');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, []);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box className="widgets-builder-page">
        {/* Header */}
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            position: 'sticky',
            top: 0,
            zIndex: theme.zIndex.appBar,
          }}
        >
          <Container maxWidth="xl">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              py={2}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <IconButton
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  sx={{ display: { md: 'none' } }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h4" component="h1">
                  Widget Builder
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {widgets.length} widgets
                </Typography>
              </Box>

              <Box display="flex" gap={1}>
                <Button
                  startIcon={<Save />}
                  onClick={handleSaveLayout}
                  variant="outlined"
                  size="small"
                >
                  Save
                </Button>
                <Button
                  startIcon={<Upload />}
                  onClick={handleLoadLayout}
                  variant="outlined"
                  size="small"
                >
                  Load
                </Button>
                <Button
                  startIcon={<Download />}
                  onClick={handleExportLayout}
                  variant="outlined"
                  size="small"
                >
                  Export
                </Button>
                <Button
                  startIcon={<Upload />}
                  onClick={handleImportLayout}
                  variant="outlined"
                  size="small"
                >
                  Import
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Main Content */}
        <Box display="flex" height="calc(100vh - 80px)">
          {/* Sidebar */}
          <Drawer
            variant={isMobile ? 'temporary' : 'persistent'}
            anchor="left"
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            sx={{
              '& .MuiDrawer-paper': {
                width: 280,
                position: 'relative',
                height: '100%',
                borderRight: 1,
                borderColor: 'divider',
              },
            }}
          >
            <WidgetSidebar
              onAddWidget={handleAddWidget}
              onClose={() => setSidebarOpen(false)}
            />
          </Drawer>

          {/* Grid Area */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              height: '100%',
              overflow: 'auto',
              backgroundColor: 'grey.50',
            }}
          >
            <Container maxWidth="xl" sx={{ py: 3, height: '100%' }}>
              <WidgetGrid
                widgets={widgets}
                onWidgetUpdate={handleWidgetUpdate}
                onWidgetDelete={handleWidgetDelete}
                onWidgetConfigure={handleWidgetConfigure}
              />
            </Container>
          </Box>
        </Box>

        {/* Mobile FAB */}
        {isMobile && (
          <Fab
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
            }}
            onClick={() => setSidebarOpen(true)}
          >
            <Add />
          </Fab>
        )}

        {/* Widget Configuration Dialog */}
        <WidgetConfigDialog
          open={Boolean(configWidget)}
          widget={configWidget}
          onClose={() => setConfigWidget(null)}
          onSave={handleWidgetUpdate}
        />

        {/* Notifications */}
        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert
            onClose={() => setNotification(prev => ({ ...prev, open: false }))}
            severity={notification.severity}
            variant="filled"
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </DragDropContext>
  );
};

export default WidgetsBuilderPage;

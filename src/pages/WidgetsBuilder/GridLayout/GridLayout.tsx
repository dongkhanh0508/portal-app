import React, { useState, useCallback } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import {
  Box,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Tooltip,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slider,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  MoreVert,
  Delete,
  Edit,
  Settings,
  Fullscreen,
  GridView,
  Add,
} from '@mui/icons-material';
import { Widget } from '@/types/widgets';
import './GridLayout.scss';
import WidgetRenderer from '../widgets/WidgetRenderer/WidgetRenderer';

interface GridLayoutProps {
  widgets: Widget[];
  columns: number;
  gap: number;
  onWidgetUpdate: (widget: Widget) => void;
  onWidgetDelete: (widgetId: string) => void;
  onWidgetMove: (widgetId: string, newPosition: { x: number; y: number }) => void;
  onWidgetResize: (widgetId: string, newSize: { width: number; height: number }) => void;
  onLayoutChange?: (columns: number, gap: number) => void;
}

const GridLayout: React.FC<GridLayoutProps> = ({
  widgets,
  columns,
  gap,
  onWidgetUpdate,
  onWidgetDelete,
  onWidgetMove,
  onWidgetResize,
  onLayoutChange,
}) => {
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tempColumns, setTempColumns] = useState(columns);
  const [tempGap, setTempGap] = useState(gap);
  const [showGrid, setShowGrid] = useState(true);

  const handleWidgetMenuOpen = (event: React.MouseEvent<HTMLElement>, widgetId: string) => {
    event.stopPropagation();
    setSelectedWidget(widgetId);
    setMenuAnchor(event.currentTarget);
  };

  const handleWidgetMenuClose = () => {
    setMenuAnchor(null);
    setSelectedWidget(null);
  };

  const handleWidgetDelete = () => {
    if (selectedWidget) {
      onWidgetDelete(selectedWidget);
      handleWidgetMenuClose();
    }
  };

  const handleWidgetEdit = () => {
    // Open widget configuration dialog
    handleWidgetMenuClose();
  };

  const handleSettingsOpen = () => {
    setTempColumns(columns);
    setTempGap(gap);
    setSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setSettingsOpen(false);
  };

  const handleSettingsSave = () => {
    onLayoutChange?.(tempColumns, tempGap);
    setSettingsOpen(false);
  };

  const getGridStyle = () => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: `${gap}px`,
    padding: `${gap}px`,
    minHeight: '100%',
    position: 'relative' as const,
  });

  const getWidgetStyle = (widget: Widget) => ({
    gridColumn: `${widget.position.x + 1} / span ${widget.size.width}`,
    gridRow: `${widget.position.y + 1} / span ${widget.size.height}`,
  });

  // Calculate grid positions for drop zones
  const getDropZones = () => {
    const maxRows = Math.max(...widgets.map(w => w.position.y + w.size.height), 10);
    const zones = [];

    for (let row = 0; row < maxRows; row++) {
      for (let col = 0; col < columns; col++) {
        const isOccupied = widgets.some(widget =>
          col >= widget.position.x &&
          col < widget.position.x + widget.size.width &&
          row >= widget.position.y &&
          row < widget.position.y + widget.size.height
        );

        if (!isOccupied) {
          zones.push({ x: col, y: row });
        }
      }
    }

    return zones;
  };

  return (
    <Box className="grid-layout">
      {/* Layout Controls */}
      <Box className="grid-layout__controls">
        <Tooltip title="Grid Settings">
          <IconButton onClick={handleSettingsOpen}>
            <GridView />
          </IconButton>
        </Tooltip>

        <FormControlLabel
          control={
            <Switch
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
              size="small"
            />
          }
          label="Show Grid"
        />
      </Box>

      {/* Grid Container */}
      <Droppable droppableId="widget-grid">
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`grid-layout__container ${showGrid ? 'grid-layout__container--grid' : ''} ${
              snapshot.isDraggingOver ? 'grid-layout__container--drag-over' : ''
            }`}
            style={getGridStyle()}
          >
            {/* Drop Zones */}
            {snapshot.isDraggingOver && (
              <>
                {getDropZones().map((zone, index) => (
                  <Box
                    key={`drop-zone-${zone.x}-${zone.y}`}
                    className="grid-layout__drop-zone"
                    style={{
                      gridColumn: `${zone.x + 1}`,
                      gridRow: `${zone.y + 1}`,
                    }}
                  />
                ))}
              </>
            )}

            {/* Widgets */}
            {widgets.map((widget, index) => (
              <Draggable
                key={widget.id}
                draggableId={widget.id}
                index={index}
              >
                {(provided, snapshot) => (
                  <Paper
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`grid-layout__widget ${
                      snapshot.isDragging ? 'grid-layout__widget--dragging' : ''
                    }`}
                    style={{
                      ...getWidgetStyle(widget),
                      ...provided.draggableProps.style,
                    }}
                    elevation={snapshot.isDragging ? 8 : 2}
                  >
                    {/* Widget Header */}
                    <Box
                      {...provided.dragHandleProps}
                      className="grid-layout__widget-header"
                    >
                      <Typography variant="subtitle2" noWrap>
                        {widget.title}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => handleWidgetMenuOpen(e, widget.id)}
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </Box>

                    {/* Widget Content */}
                    <Box className="grid-layout__widget-content">
                      <WidgetRenderer widget={widget} />
                    </Box>

                    {/* Resize Handle */}
                    <Box className="grid-layout__resize-handle" />
                  </Paper>
                )}
              </Draggable>
            ))}

            {provided.placeholder}

            {/* Empty State */}
            {widgets.length === 0 && (
              <Box className="grid-layout__empty-state">
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No widgets yet
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Drag widgets from the sidebar to get started
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Droppable>

      {/* Widget Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleWidgetMenuClose}
      >
        <MenuItem onClick={handleWidgetEdit}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit Widget
        </MenuItem>
        <MenuItem onClick={() => {}}>
          <Settings fontSize="small" sx={{ mr: 1 }} />
          Configure
        </MenuItem>
        <MenuItem onClick={() => {}}>
          <Fullscreen fontSize="small" sx={{ mr: 1 }} />
          Fullscreen
        </MenuItem>
        <MenuItem onClick={handleWidgetDelete} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Layout Settings Dialog */}
      <Dialog open={settingsOpen} onClose={handleSettingsClose} maxWidth="sm" fullWidth>
        <DialogTitle>Grid Layout Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography gutterBottom>
              Columns: {tempColumns}
            </Typography>
            <Slider
              value={tempColumns}
              onChange={(_, value) => setTempColumns(value as number)}
              min={1}
              max={12}
              step={1}
              marks
              sx={{ mb: 3 }}
            />

            <Typography gutterBottom>
              Gap: {tempGap}px
            </Typography>
            <Slider
              value={tempGap}
              onChange={(_, value) => setTempGap(value as number)}
              min={4}
              max={32}
              step={4}
              marks
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSettingsClose}>Cancel</Button>
          <Button onClick={handleSettingsSave} variant="contained">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GridLayout;

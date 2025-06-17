import React from 'react';
import { Box, Typography } from '@mui/material';
import { Droppable } from '@hello-pangea/dnd';
import WidgetCard from '../WidgetCard/WidgetCard';
import { Widget } from '@/types/widgets';
import './WidgetGrid.scss';

interface WidgetGridProps {
  widgets: Widget[];
  onWidgetUpdate: (widget: Widget) => void;
  onWidgetDelete: (widgetId: string) => void;
  onWidgetConfigure: (widget: Widget) => void;
}

const WidgetGrid: React.FC<WidgetGridProps> = ({
  widgets,
  onWidgetUpdate,
  onWidgetDelete,
  onWidgetConfigure,
}) => {
  return (
    <Droppable droppableId="widget-grid">
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="widget-grid"
          sx={{
            minHeight: '100%',
            backgroundColor: snapshot.isDraggingOver ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
            transition: 'background-color 0.2s ease',
            position: 'relative',
            padding: 2,
          }}
        >
          {widgets.length === 0 ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height="60vh"
              textAlign="center"
              sx={{
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                backgroundColor: 'background.paper',
              }}
            >
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No widgets yet
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Drag widgets from the sidebar or click to add them
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: 2,
                alignItems: 'start',
              }}
            >
              {widgets.map((widget, index) => (
                <WidgetCard
                  key={widget.id}
                  widget={widget}
                  index={index}
                  onUpdate={onWidgetUpdate}
                  onDelete={onWidgetDelete}
                  onConfigure={onWidgetConfigure}
                />
              ))}
            </Box>
          )}
          {provided.placeholder}
        </Box>
      )}
    </Droppable>
  );
};

export default WidgetGrid;

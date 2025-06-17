import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import {
  MoreVert,
  Settings,
  Delete,
  DragIndicator,
} from '@mui/icons-material';
import { Draggable } from '@hello-pangea/dnd';
import WidgetRenderer from '../WidgetRenderer/WidgetRenderer';
import { Widget } from '@/types/widgets';
import './WidgetCard.scss';

interface WidgetCardProps {
  widget: Widget;
  index: number;
  onUpdate: (widget: Widget) => void;
  onDelete: (widgetId: string) => void;
  onConfigure: (widget: Widget) => void;
}

const WidgetCard: React.FC<WidgetCardProps> = ({
  widget,
  index,
  onUpdate,
  onDelete,
  onConfigure,
}) => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleConfigure = () => {
    onConfigure(widget);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(widget.id);
    handleMenuClose();
  };

  return (
    <Draggable draggableId={widget.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="widget-card"
          sx={{
            height: `${widget.size.height * 120 + (widget.size.height - 1) * 16}px`,
            minHeight: 200,
            display: 'flex',
            flexDirection: 'column',
                      transform: snapshot.isDragging ? 'rotate(3deg)' : 'none',
            boxShadow: snapshot.isDragging ? 4 : 1,
            transition: 'all 0.2s ease',
            border: snapshot.isDragging ? '2px solid' : '1px solid',
            borderColor: snapshot.isDragging ? 'primary.main' : 'divider',
            '&:hover': {
              boxShadow: 2,
            },
          }}
        >
          <CardHeader
            {...provided.dragHandleProps}
            title={
              <Box display="flex" alignItems="center" gap={1}>
                <DragIndicator
                  sx={{
                    color: 'text.disabled',
                    cursor: 'grab',
                    '&:active': {
                      cursor: 'grabbing',
                    },
                  }}
                />
                <Typography variant="subtitle2" noWrap>
                  {widget.title}
                </Typography>
              </Box>
            }
            action={
              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreVert />
              </IconButton>
            }
            sx={{
              pb: 1,
              '& .MuiCardHeader-content': {
                minWidth: 0,
              },
            }}
          />

          <CardContent
            sx={{
              flex: 1,
              pt: 0,
              pb: '16px !important',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
              <WidgetRenderer widget={widget} />
            </Box>
          </CardContent>

          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleConfigure}>
              <Settings fontSize="small" sx={{ mr: 1 }} />
              Configure
            </MenuItem>
            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              <Delete fontSize="small" sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          </Menu>
        </Card>
      )}
    </Draggable>
  );
};

export default WidgetCard;


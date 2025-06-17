import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  MoreVert,
  BugReport,
  Assignment,
  AutoAwesome,
  Flag,
  AccessTime,
  Comment,
  Attachment,
} from '@mui/icons-material';
import { Task } from '@/types/backlog';
import { formatDistanceToNow } from 'date-fns';
import './TaskCard.scss';

interface TaskCardProps {
  task: Task;
  index: number;
  onTaskClick: (task: Task) => void;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  index,
  onTaskClick,
  onTaskEdit,
  onTaskDelete,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onTaskEdit(task);
    handleMenuClose();
  };

  const handleDelete = () => {
    onTaskDelete(task.id);
    handleMenuClose();
  };

  const getTaskIcon = () => {
    switch (task.type) {
      case 'bug':
        return <BugReport color="error" fontSize="small" />;
      case 'epic':
        return <AutoAwesome color="secondary" fontSize="small" />;
      case 'story':
        return <Assignment color="primary" fontSize="small" />;
      default:
        return <Assignment color="action" fontSize="small" />;
    }
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'urgent':
        return '#d32f2f';
      case 'high':
        return '#f57c00';
      case 'medium':
        return '#1976d2';
      case 'low':
        return '#388e3c';
      default:
        return '#757575';
    }
  };

  // Safe date formatting
  const formatDueDate = (dueDate: Date | undefined) => {
    if (!dueDate) return null;

    try {
      // Ensure it's a Date object
      const date = dueDate instanceof Date ? dueDate : new Date(dueDate);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dueDate);
        return null;
      }

      return {
        formatted: formatDistanceToNow(date, { addSuffix: true }),
        locale: date.toLocaleDateString(),
      };
    } catch (error) {
      console.error('Error formatting date:', error, dueDate);
      return null;
    }
  };

  const dueDateInfo = formatDueDate(task.dueDate);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-card ${snapshot.isDragging ? 'task-card--dragging' : ''}`}
          onClick={() => onTaskClick(task)}
          sx={{
            mb: 1,
            cursor: 'pointer',
            transform: snapshot.isDragging ? 'rotate(5deg)' : 'none',
            boxShadow: snapshot.isDragging ? 3 : 1,
          }}
        >
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
              <Box display="flex" alignItems="center" gap={1}>
                {getTaskIcon()}
                <Typography variant="caption" color="textSecondary">
                  {task.id.toUpperCase()}
                </Typography>
                <Box
                  width={8}
                  height={8}
                  borderRadius="50%"
                  bgcolor={getPriorityColor()}
                />
              </Box>
              <IconButton
                size="small"
                onClick={handleMenuClick}
                sx={{ p: 0.5 }}
              >
                <MoreVert fontSize="small" />
              </IconButton>
            </Box>

            {/* Title */}
            <Typography variant="body2" fontWeight="bold" mb={1} lineHeight={1.3}>
              {task.title}
            </Typography>

            {/* Labels */}
            {task.labels.length > 0 && (
              <Box display="flex" flexWrap="wrap" gap={0.5} mb={1}>
                {task.labels.slice(0, 3).map((label) => (
                  <Chip
                    key={label}
                    label={label}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem', height: 20 }}
                  />
                ))}
                {task.labels.length > 3 && (
                  <Chip
                    label={`+${task.labels.length - 3}`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem', height: 20 }}
                  />
                )}
              </Box>
            )}

            {/* Footer */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" gap={1}>
                {task.storyPoints && (
                  <Chip
                    label={task.storyPoints}
                    size="small"
                    color="primary"
                    sx={{ fontSize: '0.7rem', height: 20, minWidth: 24 }}
                  />
                )}

                {dueDateInfo && (
                  <Tooltip title={`Due: ${dueDateInfo.locale}`}>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <AccessTime fontSize="small" color="warning" />
                      <Typography variant="caption" color="warning.main">
                        {dueDateInfo.formatted}
                      </Typography>
                    </Box>
                  </Tooltip>
                )}
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                {task.comments && task.comments.length > 0 && (
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Comment fontSize="small" color="action" />
                    <Typography variant="caption" color="textSecondary">
                      {task.comments.length}
                    </Typography>
                  </Box>
                )}

                {task.attachments && task.attachments.length > 0 && (
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Attachment fontSize="small" color="action" />
                    <Typography variant="caption" color="textSecondary">
                      {task.attachments.length}
                    </Typography>
                  </Box>
                )}

                {task.assignee && (
                  <Tooltip title={task.assignee.name}>
                    <Avatar
                      src={task.assignee.avatar}
                      sx={{ width: 24, height: 24, fontSize: '0.7rem' }}
                    >
                      {task.assignee.name.charAt(0)}
                    </Avatar>
                  </Tooltip>
                )}
              </Box>
            </Box>
          </CardContent>

          {/* Context Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={(e) => e.stopPropagation()}
          >
            <MenuItem onClick={handleEdit}>Edit</MenuItem>
            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              Delete
            </MenuItem>
          </Menu>
        </Card>
      )}
    </Draggable>
  );
};

export default TaskCard;

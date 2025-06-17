import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Badge,
  Tooltip,
} from '@mui/material';
import { Add, MoreVert } from '@mui/icons-material';
import TaskCard from '../TaskCard/TaskCard';
import { Column as ColumnType, Task } from '@/types/backlog';
import './Column.scss';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onAddTask: (columnId: string) => void;
}

const Column: React.FC<ColumnProps> = ({
  column,
  tasks,
  onTaskClick,
  onTaskEdit,
  onTaskDelete,
  onAddTask,
}) => {
  const isOverLimit = column.limit && tasks.length > column.limit;

  return (
    <Paper className="kanban-column" elevation={1}>
      {/* Column Header */}
      <Box className="kanban-column__header" sx={{ borderTop: `3px solid ${column.color}` }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="subtitle2" fontWeight="bold">
            {column.title}
          </Typography>
          <Badge
            badgeContent={tasks.length}
            color={isOverLimit ? 'error' : 'primary'}
            max={99}
          />
          {column.limit && (
            <Typography variant="caption" color="textSecondary">
              (max: {column.limit})
            </Typography>
          )}
        </Box>

        <Box>
          <Tooltip title="Add task">
            <IconButton
              size="small"
              onClick={() => onAddTask(column.id)}
            >
              <Add fontSize="small" />
            </IconButton>
          </Tooltip>
          <IconButton size="small">
            <MoreVert fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Column Content */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`kanban-column__content ${
              snapshot.isDraggingOver ? 'kanban-column__content--dragging-over' : ''
            }`}
            sx={{
              backgroundColor: snapshot.isDraggingOver ? 'action.hover' : 'transparent',
              minHeight: 200,
              maxHeight: 'calc(100vh - 300px)',
              overflowY: 'auto',
              p: 1,
            }}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onTaskClick={onTaskClick}
                onTaskEdit={onTaskEdit}
                onTaskDelete={onTaskDelete}
              />
            ))}
            {provided.placeholder}

            {tasks.length === 0 && (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height={150}
                color="text.secondary"
              >
                <Typography variant="body2" textAlign="center">
                  No tasks in {column.title.toLowerCase()}
                </Typography>
                <Typography variant="caption" textAlign="center">
                  Drag tasks here or click + to add
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Droppable>
    </Paper>
  );
};

export default Column;

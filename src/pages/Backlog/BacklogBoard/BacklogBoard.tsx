import React, { useState, useCallback } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Avatar,
  AvatarGroup,
  TextField,
  InputAdornment,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Add,
  FilterList,
  Search,
  ViewColumn,
  MoreVert,
  Clear,
  Settings,
  Timeline,
  Dashboard,
} from '@mui/icons-material';
import Column from '../Column/Column';
import TaskDialog from '../TaskDialog/TaskDialog';
import { Board, Task, User, Column as ColumnType } from '@/types/backlog';
import { v4 as uuidv4 } from 'uuid';
import './BacklogBoard.scss';

interface BacklogBoardProps {
  board: Board;
  users: User[];
  currentUser: User;
  onBoardUpdate: (board: Board) => void;
}

const BacklogBoard: React.FC<BacklogBoardProps> = ({
  board,
  users,
  currentUser,
  onBoardUpdate,
}) => {
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('view');
  const [newTaskColumnId, setNewTaskColumnId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const [boardMenuAnchor, setBoardMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('');
  const [selectedAssigneeFilter, setSelectedAssigneeFilter] = useState<string>('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('');

  const handleDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = board.columns.find(col => col.id === source.droppableId);
    const finish = board.columns.find(col => col.id === destination.droppableId);

    if (!start || !finish) {
      return;
    }

    if (start === finish) {
      // Moving within the same column
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newBoard = {
        ...board,
        columns: board.columns.map(col => col.id === newColumn.id ? newColumn : col),
        updatedAt: new Date(),
      };

      onBoardUpdate(newBoard);
    } else {
      // Moving to a different column
      const startTaskIds = Array.from(start.taskIds);
      startTaskIds.splice(source.index, 1);

      const newStart = {
        ...start,
        taskIds: startTaskIds,
      };

      const finishTaskIds = Array.from(finish.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);

      const newFinish = {
        ...finish,
        taskIds: finishTaskIds,
      };

      // Update task status based on column
      const updatedTask = {
        ...board.tasks[draggableId],
        status: getStatusFromColumnId(destination.droppableId),
        updatedAt: new Date(),
      };

      const newBoard = {
        ...board,
        columns: board.columns.map(col => {
          if (col.id === newStart.id) return newStart;
          if (col.id === newFinish.id) return newFinish;
          return col;
        }),
        tasks: {
          ...board.tasks,
          [draggableId]: updatedTask,
        },
        updatedAt: new Date(),
      };

      onBoardUpdate(newBoard);
    }
  }, [board, onBoardUpdate]);

  const getStatusFromColumnId = (columnId: string): Task['status'] => {
    const statusMap: { [key: string]: Task['status'] } = {
      'backlog': 'backlog',
      'todo': 'todo',
      'in-progress': 'in-progress',
      'review': 'review',
      'done': 'done',
    };
    return statusMap[columnId] || 'backlog';
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDialogMode('view');
    setTaskDialogOpen(true);
  };

  const handleTaskEdit = (task: Task) => {
    setSelectedTask(task);
    setDialogMode('edit');
    setTaskDialogOpen(true);
  };

  const handleTaskDelete = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const newTasks = { ...board.tasks };
      delete newTasks[taskId];

      const newColumns = board.columns.map(column => ({
        ...column,
        taskIds: column.taskIds.filter(id => id !== taskId),
      }));

      const newBoard = {
        ...board,
        tasks: newTasks,
        columns: newColumns,
        updatedAt: new Date(),
      };

      onBoardUpdate(newBoard);
    }
  };

  const handleAddTask = (columnId: string) => {
    setNewTaskColumnId(columnId);
    setSelectedTask(null);
    setDialogMode('create');
    setTaskDialogOpen(true);
  };

  const handleTaskSave = (taskData: Partial<Task>) => {
    if (dialogMode === 'create') {
      const newTask: Task = {
        id: `task-${uuidv4()}`,
        title: taskData.title || '',
        description: taskData.description || '',
        priority: taskData.priority || 'medium',
        status: getStatusFromColumnId(newTaskColumnId),
        assignee: taskData.assignee,
        reporter: currentUser,
        labels: taskData.labels || [],
        storyPoints: taskData.storyPoints,
        dueDate: taskData.dueDate,
        createdAt: new Date(),
        updatedAt: new Date(),
        comments: [],
        attachments: [],
        subtasks: [],
        type: taskData.type || 'story',
      };

      const targetColumn = board.columns.find(col => col.id === newTaskColumnId);
      if (targetColumn) {
        const newBoard = {
          ...board,
          tasks: {
            ...board.tasks,
            [newTask.id]: newTask,
          },
          columns: board.columns.map(col =>
            col.id === newTaskColumnId
              ? { ...col, taskIds: [...col.taskIds, newTask.id] }
              : col
          ),
          updatedAt: new Date(),
        };

        onBoardUpdate(newBoard);
      }
    } else if (dialogMode === 'edit' && selectedTask) {
      const updatedTask = {
        ...selectedTask,
        ...taskData,
        updatedAt: new Date(),
      };

      const newBoard = {
        ...board,
        tasks: {
          ...board.tasks,
          [selectedTask.id]: updatedTask,
        },
        updatedAt: new Date(),
      };

      onBoardUpdate(newBoard);
    }
  };

  const handleCloseDialog = () => {
    setTaskDialogOpen(false);
    setSelectedTask(null);
    setNewTaskColumnId('');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleFilterMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null);
  };

  const handleBoardMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setBoardMenuAnchor(event.currentTarget);
  };

  const handleBoardMenuClose = () => {
    setBoardMenuAnchor(null);
  };

  const clearAllFilters = () => {
    setSelectedPriorityFilter('');
    setSelectedAssigneeFilter('');
    setSelectedTypeFilter('');
    setSearchQuery('');
    handleFilterMenuClose();
  };

  // Filter tasks based on search and filters
  const filterTasks = (tasks: Task[]): Task[] => {
    return tasks.filter(task => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower) ||
          task.labels.some(label => label.toLowerCase().includes(searchLower)) ||
          task.assignee?.name.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

      // Priority filter
      if (selectedPriorityFilter && task.priority !== selectedPriorityFilter) {
        return false;
      }

      // Assignee filter
      if (selectedAssigneeFilter) {
        if (selectedAssigneeFilter === 'unassigned' && task.assignee) {
          return false;
        }
        if (selectedAssigneeFilter !== 'unassigned' && task.assignee?.id !== selectedAssigneeFilter) {
          return false;
        }
      }

      // Type filter
      if (selectedTypeFilter && task.type !== selectedTypeFilter) {
        return false;
      }

      return true;
    });
  };

  // Get tasks for each column with filters applied
  const getTasksForColumn = (column: ColumnType): Task[] => {
    const columnTasks = column.taskIds.map(taskId => board.tasks[taskId]).filter(Boolean);
    return filterTasks(columnTasks);
  };

  // Get board statistics
  const boardStats = {
    totalTasks: Object.keys(board.tasks).length,
    completedTasks: Object.values(board.tasks).filter(task => task.status === 'done').length,
    inProgressTasks: Object.values(board.tasks).filter(task => task.status === 'in-progress').length,
    assignedUsers: [...new Set(Object.values(board.tasks).map(task => task.assignee?.id).filter(Boolean))],
  };

  const hasActiveFilters = searchQuery || selectedPriorityFilter || selectedAssigneeFilter || selectedTypeFilter;

  return (
    <Box className="backlog-board">
      {/* Board Header */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {board.name}
          </Typography>

          {/* Search */}
          <TextField
            size="small"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ mr: 2, minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleClearSearch}>
                    <Clear fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Board Stats */}
          <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
            <Chip
              label={`${boardStats.totalTasks} tasks`}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`${boardStats.completedTasks} done`}
              size="small"
              color="success"
              variant="outlined"
            />
            <Chip
              label={`${boardStats.inProgressTasks} in progress`}
              size="small"
              color="warning"
              variant="outlined"
            />
          </Box>

          {/* Assigned Users */}
          <AvatarGroup max={4} sx={{ mr: 2 }}>
            {users.filter(user => boardStats.assignedUsers.includes(user.id)).map(user => (
              <Tooltip key={user.id} title={user.name}>
                <Avatar src={user.avatar} sx={{ width: 32, height: 32 }}>
                  {user.name.charAt(0)}
                </Avatar>
              </Tooltip>
            ))}
          </AvatarGroup>

          {/* Actions */}
          <Button
            startIcon={<Add />}
            onClick={() => handleAddTask('backlog')}
            variant="contained"
            sx={{ mr: 1 }}
          >
            Add Task
          </Button>

          <Tooltip title="Filters">
            <IconButton onClick={handleFilterMenuOpen}>
              <Badge color="primary" variant="dot" invisible={!hasActiveFilters}>
                <FilterList />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="View Options">
            <IconButton>
              <ViewColumn />
            </IconButton>
          </Tooltip>

          <Tooltip title="Board Settings">
            <IconButton onClick={handleBoardMenuOpen}>
              <MoreVert />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <Box sx={{ p: 1, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
            <Typography variant="caption" color="textSecondary">
              Active filters:
            </Typography>
            {selectedPriorityFilter && (
              <Chip
                label={`Priority: ${selectedPriorityFilter}`}
                size="small"
                onDelete={() => setSelectedPriorityFilter('')}
                color="primary"
                variant="outlined"
              />
            )}
            {selectedAssigneeFilter && (
              <Chip
                label={`Assignee: ${selectedAssigneeFilter === 'unassigned' ? 'Unassigned' : users.find(u => u.id === selectedAssigneeFilter)?.name}`}
                size="small"
                onDelete={() => setSelectedAssigneeFilter('')}
                color="primary"
                variant="outlined"
              />
            )}
            {selectedTypeFilter && (
              <Chip
                label={`Type: ${selectedTypeFilter}`}
                size="small"
                onDelete={() => setSelectedTypeFilter('')}
                color="primary"
                variant="outlined"
              />
            )}
            {searchQuery && (
              <Chip
                label={`Search: "${searchQuery}"`}
                size="small"
                onDelete={handleClearSearch}
                color="primary"
                variant="outlined"
              />
            )}
            <Button size="small" onClick={clearAllFilters}>
              Clear All
            </Button>
          </Box>
        </Box>
      )}

      {/* Board Content */}
      <Box className="backlog-board__content">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Box className="backlog-board__columns">
            {board.columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                tasks={getTasksForColumn(column)}
                onTaskClick={handleTaskClick}
                onTaskEdit={handleTaskEdit}
                onTaskDelete={handleTaskDelete}
                onAddTask={handleAddTask}
              />
            ))}
          </Box>
        </DragDropContext>
      </Box>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={handleFilterMenuClose}
        PaperProps={{ sx: { minWidth: 250 } }}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2">Filter by Priority</Typography>
        </MenuItem>
        {['low', 'medium', 'high', 'urgent'].map((priority) => (
          <MenuItem
            key={priority}
            onClick={() => {
              setSelectedPriorityFilter(selectedPriorityFilter === priority ? '' : priority);
            }}
            selected={selectedPriorityFilter === priority}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                width={8}
                height={8}
                borderRadius="50%"
                bgcolor={
                  priority === 'urgent' ? '#d32f2f' :
                  priority === 'high' ? '#f57c00' :
                  priority === 'medium' ? '#1976d2' : '#388e3c'
                }
              />
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Box>
          </MenuItem>
        ))}

        <MenuItem disabled sx={{ mt: 1 }}>
          <Typography variant="subtitle2">Filter by Assignee</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setSelectedAssigneeFilter(selectedAssigneeFilter === 'unassigned' ? '' : 'unassigned');
          }}
          selected={selectedAssigneeFilter === 'unassigned'}
        >
          Unassigned
        </MenuItem>
        {users.map((user) => (
          <MenuItem
            key={user.id}
            onClick={() => {
              setSelectedAssigneeFilter(selectedAssigneeFilter === user.id ? '' : user.id);
            }}
            selected={selectedAssigneeFilter === user.id}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar src={user.avatar} sx={{ width: 20, height: 20 }}>
                {user.name.charAt(0)}
              </Avatar>
              {user.name}
            </Box>
          </MenuItem>
        ))}

        <MenuItem disabled sx={{ mt: 1 }}>
          <Typography variant="subtitle2">Filter by Type</Typography>
        </MenuItem>
        {['story', 'bug', 'task', 'epic'].map((type) => (
          <MenuItem
            key={type}
            onClick={() => {
              setSelectedTypeFilter(selectedTypeFilter === type ? '' : type);
            }}
            selected={selectedTypeFilter === type}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </MenuItem>
        ))}

        {hasActiveFilters && (
          <>
            <MenuItem disabled sx={{ mt: 1 }} />
            <MenuItem onClick={clearAllFilters}>
              <Typography color="primary">Clear All Filters</Typography>
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Board Menu */}
      <Menu
        anchorEl={boardMenuAnchor}
        open={Boolean(boardMenuAnchor)}
        onClose={handleBoardMenuClose}
      >
        <MenuItem onClick={handleBoardMenuClose}>
          <Settings sx={{ mr: 1 }} />
          Board Settings
        </MenuItem>
        <MenuItem onClick={handleBoardMenuClose}>
          <Timeline sx={{ mr: 1 }} />
          Board Analytics
        </MenuItem>
        <MenuItem onClick={handleBoardMenuClose}>
          <Dashboard sx={{ mr: 1 }} />
          Export Board
        </MenuItem>
      </Menu>

      {/* Task Dialog */}
      <TaskDialog
        open={taskDialogOpen}
        task={selectedTask}
        users={users}
        onClose={handleCloseDialog}
        onSave={handleTaskSave}
        mode={dialogMode}
      />
    </Box>
  );
};

export default BacklogBoard;

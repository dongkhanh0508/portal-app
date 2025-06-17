import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  Chip,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  MoreVert,
  CheckCircle,
  RadioButtonUnchecked,
  Flag,
} from '@mui/icons-material';
import { TodoWidget as TodoWidgetType } from '@/types/widgets';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  completedAt?: Date;
}

interface TodoWidgetProps {
  widget: TodoWidgetType;
}

const TodoWidget: React.FC<TodoWidgetProps> = ({ widget }) => {
  const [todos, setTodos] = useState<TodoItem[]>([
    {
      id: '1',
      text: 'Complete project proposal',
      completed: false,
      priority: 'high',
      createdAt: new Date(),
    },
    {
      id: '2',
      text: 'Review team feedback',
      completed: true,
      priority: 'medium',
      createdAt: new Date(),
      completedAt: new Date(),
    },
    {
      id: '3',
      text: 'Update documentation',
      completed: false,
      priority: 'low',
      createdAt: new Date(),
    },
  ]);

  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
  const [editText, setEditText] = useState('');
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [selectedTodo, setSelectedTodo] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: TodoItem = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        priority: 'medium',
        createdAt: new Date(),
      };

      setTodos(prev => [todo, ...prev]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
              completedAt: !todo.completed ? new Date() : undefined,
            }
          : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const editTodo = (todo: TodoItem) => {
    setEditingTodo(todo);
    setEditText(todo.text);
    setEditDialogOpen(true);
  };

  const saveEdit = () => {
    if (editingTodo && editText.trim()) {
      setTodos(prev =>
        prev.map(todo =>
          todo.id === editingTodo.id
            ? { ...todo, text: editText.trim() }
            : todo
        )
      );
      setEditDialogOpen(false);
      setEditingTodo(null);
      setEditText('');
    }
  };

  const setPriority = (id: string, priority: 'low' | 'medium' | 'high') => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, priority } : todo
      )
    );
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, todoId: string) => {
    setMenuAnchor(event.currentTarget);
    setSelectedTodo(todoId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedTodo(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#f44336';
      case 'medium':
        return '#ff9800';
      case 'low':
        return '#4caf50';
      default:
        return '#9e9e9e';
    }
  };

  const filteredTodos = widget.config.showCompleted
    ? todos
    : todos.filter(todo => !todo.completed);

  const displayedTodos = filteredTodos.slice(0, widget.config.maxItems);

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle2">
            Tasks ({completedCount}/{totalCount})
          </Typography>
          <Chip
            size="small"
            label={`${Math.round((completedCount / totalCount) * 100) || 0}%`}
            color="primary"
            variant="outlined"
          />
        </Box>

        {/* Add Todo */}
        <Box display="flex" gap={1}>
          <TextField
            fullWidth
            size="small"
            placeholder="Add new task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          />
          <IconButton size="small" onClick={addTodo} color="primary">
            <Add />
          </IconButton>
        </Box>
      </Box>

      {/* Todo List */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List dense>
          {displayedTodos.map((todo) => (
            <ListItem
              key={todo.id}
              sx={{
                px: 0,
                opacity: todo.completed ? 0.6 : 1,
                '&:hover': {
                  backgroundColor: 'action.hover',
                  borderRadius: 1,
                },
              }}
            >
              <Checkbox
                edge="start"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                size="small"
                icon={<RadioButtonUnchecked />}
                checkedIcon={<CheckCircle />}
              />

              <ListItemText
                primary={todo.text}
                secondary={
                  <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                    <Box
                      width={8}
                      height={8}
                      borderRadius="50%"
                      bgcolor={getPriorityColor(todo.priority)}
                    />
                    <Typography variant="caption" color="textSecondary">
                      {todo.priority} priority
                    </Typography>
                    {todo.completed && todo.completedAt && (
                      <Typography variant="caption" color="textSecondary">
                        • Completed {todo.completedAt.toLocaleDateString()}
                      </Typography>
                    )}
                  </Box>
                }
                primaryTypographyProps={{
                  style: {
                    textDecoration: todo.completed ? 'line-through' : 'none',
                  },
                }}
              />

              <ListItemSecondaryAction>
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, todo.id)}
                >
                  <MoreVert fontSize="small" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        {displayedTodos.length === 0 && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={4}
          >
            <CheckCircle sx={{ fontSize: 48, color: 'action.disabled', mb: 1 }} />
            <Typography color="textSecondary">
              {todos.length === 0 ? 'No tasks yet' : 'All tasks completed!'}
            </Typography>
          </Box>
        )}

        {filteredTodos.length > widget.config.maxItems && (
          <Typography variant="caption" color="textSecondary" sx={{ p: 1 }}>
            +{filteredTodos.length - widget.config.maxItems} more tasks
          </Typography>
        )}
      </Box>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            const todo = todos.find(t => t.id === selectedTodo);
            if (todo) editTodo(todo);
            handleMenuClose();
          }}
        >
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>

        <MenuItem disabled>
          <Flag fontSize="small" sx={{ mr: 1 }} />
          Priority
        </MenuItem>

        {['high', 'medium', 'low'].map((priority) => (
          <MenuItem
            key={priority}
            onClick={() => {
              if (selectedTodo) setPriority(selectedTodo, priority as any);
              handleMenuClose();
            }}
            sx={{ pl: 4 }}
          >
            <Box
              width={8}
              height={8}
              borderRadius="50%"
              bgcolor={getPriorityColor(priority)}
              mr={1}
            />
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </MenuItem>
        ))}

        <MenuItem
          onClick={() => {
            if (selectedTodo) deleteTodo(selectedTodo);
            handleMenuClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={3}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={saveEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TodoWidget;

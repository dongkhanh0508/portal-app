import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Typography,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Close,
  Add,
  Delete,
  AttachFile,
  Comment,
  Flag,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Task, User } from '@/types/backlog';
import './TaskDialog.scss';

interface TaskDialogProps {
  open: boolean;
  task: Task | null;
  users: User[];
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  mode: 'create' | 'edit' | 'view';
}

const TaskDialog: React.FC<TaskDialogProps> = ({
  open,
  task,
  users,
  onClose,
  onSave,
  mode,
}) => {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    priority: 'medium',
    type: 'story',
    labels: [],
    storyPoints: undefined,
    dueDate: undefined,
    assignee: undefined,
  });
  const [newLabel, setNewLabel] = useState('');
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (task) {
      setFormData(task);
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        type: 'story',
        labels: [],
        storyPoints: undefined,
        dueDate: undefined,
        assignee: undefined,
      });
    }
  }, [task, open]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleAddLabel = () => {
    if (newLabel.trim() && !formData.labels?.includes(newLabel.trim())) {
      setFormData({
        ...formData,
        labels: [...(formData.labels || []), newLabel.trim()],
      });
      setNewLabel('');
    }
  };

  const handleRemoveLabel = (labelToRemove: string) => {
    setFormData({
      ...formData,
      labels: formData.labels?.filter(label => label !== labelToRemove) || [],
    });
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      // In a real app, you'd add this to the task's comments
      console.log('Adding comment:', newComment);
      setNewComment('');
    }
  };

  const isReadOnly = mode === 'view';

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        className="task-dialog"
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {mode === 'create' ? 'Create Task' : mode === 'edit' ? 'Edit Task' : 'Task Details'}
            </Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box display="flex" gap={3}>
            {/* Left Column */}
            <Box flex={2}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                margin="normal"
                disabled={isReadOnly}
                required
              />

              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                margin="normal"
                multiline
                rows={4}
                disabled={isReadOnly}
              />

              {/* Labels */}
              <Box mt={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Labels
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
                  {formData.labels?.map((label) => (
                    <Chip
                      key={label}
                      label={label}
                      onDelete={isReadOnly ? undefined : () => handleRemoveLabel(label)}
                      size="small"
                    />
                  ))}
                </Box>
                {!isReadOnly && (
                  <Box display="flex" gap={1}>
                    <TextField
                      size="small"
                      placeholder="Add label"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddLabel();
                        }
                      }}
                    />
                    <Button size="small" onClick={handleAddLabel}>
                      Add
                    </Button>
                  </Box>
                )}
              </Box>

              {/* Comments */}
              {mode !== 'create' && (
                <Box mt={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    Comments
                  </Typography>
                  <List dense>
                    {task?.comments.map((comment) => (
                      <ListItem key={comment.id} alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar src={comment.author.avatar}>
                            {comment.author.name.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="subtitle2">
                                {comment.author.name}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {comment.createdAt.toLocaleString()}
                              </Typography>
                            </Box>
                          }
                          secondary={comment.content}
                        />
                      </ListItem>
                    ))}
                  </List>

                  {!isReadOnly && (
                    <Box display="flex" gap={1} mt={1}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        multiline
                        rows={2}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                      >
                        Comment
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </Box>

            {/* Right Column */}
            <Box flex={1}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  disabled={isReadOnly}
                >
                  <MenuItem value="story">Story</MenuItem>
                  <MenuItem value="bug">Bug</MenuItem>
                  <MenuItem value="task">Task</MenuItem>
                  <MenuItem value="epic">Epic</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  disabled={isReadOnly}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Assignee</InputLabel>
                <Select
                  value={formData.assignee?.id || ''}
                  onChange={(e) => {
                    const selectedUser = users.find(user => user.id === e.target.value);
                    setFormData({ ...formData, assignee: selectedUser });
                  }}
                  disabled={isReadOnly}
                >
                  <MenuItem value="">Unassigned</MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar src={user.avatar} sx={{ width: 24, height: 24 }}>
                          {user.name.charAt(0)}
                        </Avatar>
                        {user.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Story Points"
                type="number"
                value={formData.storyPoints || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  storyPoints: e.target.value ? parseInt(e.target.value) : undefined
                })}
                margin="normal"
                disabled={isReadOnly}
              />

              <DatePicker
                label="Due Date"
                value={formData.dueDate}
                onChange={(date) => setFormData({ ...formData, dueDate: date || undefined })}
                disabled={isReadOnly}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: 'normal',
                  },
                }}
              />

              {/* Attachments */}
              {mode !== 'create' && task?.attachments && task.attachments.length > 0 && (
                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Attachments
                  </Typography>
                  <List dense>
                    {task.attachments.map((attachment) => (
                      <ListItem key={attachment.id}>
                        <ListItemAvatar>
                          <Avatar>
                            <AttachFile />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={attachment.name}
                          secondary={`${(attachment.size / 1024).toFixed(1)} KB`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          {!isReadOnly && (
            <Button onClick={handleSave} variant="contained">
              {mode === 'create' ? 'Create' : 'Save'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default TaskDialog;

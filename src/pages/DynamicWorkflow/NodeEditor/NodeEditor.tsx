import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { WorkflowNode, FormField } from '@/types/workflow';

interface NodeEditorProps {
  selectedNode: WorkflowNode | null;
  onNodeUpdate: (node: WorkflowNode) => void;
}

const NodeEditor: React.FC<NodeEditorProps> = ({ selectedNode, onNodeUpdate }) => {
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [fieldDialogOpen, setFieldDialogOpen] = useState(false);
  const [approverInput, setApproverInput] = useState('');

  const [fieldForm, setFieldForm] = useState<FormField>({
    id: '',
    name: '',
    type: 'text',
    label: '',
    required: false,
    options: [],
  });

  useEffect(() => {
    if (editingField) {
      setFieldForm(editingField);
    } else {
      setFieldForm({
        id: '',
        name: '',
        type: 'text',
        label: '',
        required: false,
        options: [],
      });
    }
  }, [editingField]);

  if (!selectedNode) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Node Properties
          </Typography>
          <Typography color="textSecondary">
            Select a node to edit its properties
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const handleNodeDataChange = (field: string, value: any) => {
    const updatedNode = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        [field]: value,
      },
    };
    onNodeUpdate(updatedNode);
  };

  const handleAddFormField = () => {
    setEditingField(null);
    setFieldDialogOpen(true);
  };

  const handleEditFormField = (field: FormField) => {
    setEditingField(field);
    setFieldDialogOpen(true);
  };

  const handleSaveFormField = () => {
    const newField = {
      ...fieldForm,
      id: fieldForm.id || `field-${Date.now()}`,
    };

    const currentFields = selectedNode.data.formFields || [];
    let updatedFields;

    if (editingField) {
      updatedFields = currentFields.map(field =>
        field.id === editingField.id ? newField : field
      );
    } else {
      updatedFields = [...currentFields, newField];
    }

    handleNodeDataChange('formFields', updatedFields);
    setFieldDialogOpen(false);
    setEditingField(null);
  };

  const handleDeleteFormField = (fieldId: string) => {
    const currentFields = selectedNode.data.formFields || [];
    const updatedFields = currentFields.filter(field => field.id !== fieldId);
    handleNodeDataChange('formFields', updatedFields);
  };

  const handleAddApprover = () => {
    if (approverInput.trim()) {
      const currentApprovers = selectedNode.data.approvers || [];
      const updatedApprovers = [...currentApprovers, approverInput.trim()];
      handleNodeDataChange('approvers', updatedApprovers);
      setApproverInput('');
    }
  };

  const handleDeleteApprover = (index: number) => {
    const currentApprovers = selectedNode.data.approvers || [];
    const updatedApprovers = currentApprovers.filter((_, i) => i !== index);
    handleNodeDataChange('approvers', updatedApprovers);
  };

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Node Properties
          </Typography>

          <Box mb={2}>
            <Typography variant="subtitle2" gutterBottom>
              Node Type: {selectedNode.type}
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Label"
            value={selectedNode.data.label}
            onChange={(e) => handleNodeDataChange('label', e.target.value)}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Description"
            value={selectedNode.data.description || ''}
            onChange={(e) => handleNodeDataChange('description', e.target.value)}
            margin="normal"
            multiline
            rows={2}
          />

          {/* Form Node Specific Fields */}
          {selectedNode.type === 'form' && (
            <Box mt={2}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle2">Form Fields</Typography>
                <Button
                  size="small"
                  startIcon={<Add />}
                  onClick={handleAddFormField}
                >
                  Add Field
                </Button>
              </Box>

              <List dense>
                {(selectedNode.data.formFields || []).map((field) => (
                  <ListItem key={field.id}>
                    <ListItemText
                      primary={field.label}
                      secondary={`${field.type} ${field.required ? '(Required)' : ''}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        size="small"
                        onClick={() => handleEditFormField(field)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteFormField(field.id)}
                      >
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* Approval Node Specific Fields */}
          {selectedNode.type === 'approval' && (
            <Box mt={2}>
              <Typography variant="subtitle2" gutterBottom>
                Approvers
              </Typography>

              <Box display="flex" gap={1} mb={1}>
                <TextField
                  size="small"
                  placeholder="Add approver email"
                  value={approverInput}
                  onChange={(e) => setApproverInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddApprover();
                    }
                  }}
                />
                <Button size="small" onClick={handleAddApprover}>
                  Add
                </Button>
              </Box>

              <Box display="flex" flexWrap="wrap" gap={1}>
                {(selectedNode.data.approvers || []).map((approver, index) => (
                  <Chip
                    key={index}
                    label={approver}
                    onDelete={() => handleDeleteApprover(index)}
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Form Field Dialog */}
      <Dialog
        open={fieldDialogOpen}
        onClose={() => setFieldDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
          <DialogTitle>
          {editingField ? 'Edit Form Field' : 'Add Form Field'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Field Name"
            value={fieldForm.name}
            onChange={(e) => setFieldForm({ ...fieldForm, name: e.target.value })}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Field Label"
            value={fieldForm.label}
            onChange={(e) => setFieldForm({ ...fieldForm, label: e.target.value })}
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Field Type</InputLabel>
            <Select
              value={fieldForm.type}
              onChange={(e) => setFieldForm({ ...fieldForm, type: e.target.value as any })}
            >
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="number">Number</MenuItem>
              <MenuItem value="select">Select</MenuItem>
              <MenuItem value="textarea">Textarea</MenuItem>
              <MenuItem value="date">Date</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={fieldForm.required}
                onChange={(e) => setFieldForm({ ...fieldForm, required: e.target.checked })}
              />
            }
            label="Required Field"
          />

          {fieldForm.type === 'select' && (
            <TextField
              fullWidth
              label="Options (comma separated)"
              value={fieldForm.options?.join(', ') || ''}
              onChange={(e) => setFieldForm({
                ...fieldForm,
                options: e.target.value.split(',').map(opt => opt.trim()).filter(opt => opt)
              })}
              margin="normal"
              helperText="Enter options separated by commas"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFieldDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveFormField} variant="contained">
            {editingField ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};


export default NodeEditor;

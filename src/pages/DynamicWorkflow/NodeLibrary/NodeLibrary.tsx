import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  Assignment,
  ThumbUp,
  AccountTree,
  Settings,
} from '@mui/icons-material';
import { NodeTemplate, WorkflowNodeType } from '@/types/workflow';
import './NodeLibrary.scss';

const nodeTemplates: NodeTemplate[] = [
  {
    type: 'start',
    label: 'Start',
    icon: <PlayArrow color="success" />,
    description: 'Workflow starting point',
    defaultData: {
      label: 'Start',
      description: 'Workflow begins here',
    },
  },
  {
    type: 'form',
    label: 'Form',
    icon: <Assignment color="primary" />,
    description: 'User input form',
    defaultData: {
      label: 'Form',
      description: 'Collect user input',
      formFields: [],
    },
  },
  {
    type: 'approval',
    label: 'Approval',
    icon: <ThumbUp color="warning" />,
    description: 'Approval step',
    defaultData: {
      label: 'Approval',
      description: 'Requires approval',
      approvers: [],
    },
  },
  {
    type: 'condition',
    label: 'Condition',
    icon: <AccountTree color="secondary" />,
    description: 'Conditional branching',
    defaultData: {
      label: 'Condition',
      description: 'Branch based on condition',
    },
  },
  {
    type: 'action',
    label: 'Action',
    icon: <Settings color="info" />,
    description: 'Automated action',
    defaultData: {
      label: 'Action',
      description: 'Perform automated task',
    },
  },
  {
    type: 'end',
    label: 'End',
    icon: <Stop color="error" />,
    description: 'Workflow endpoint',
    defaultData: {
      label: 'End',
      description: 'Workflow ends here',
    },
  },
];

interface NodeLibraryProps {
  onNodeDragStart: (event: React.DragEvent, nodeType: WorkflowNodeType, template: NodeTemplate) => void;
}

const NodeLibrary: React.FC<NodeLibraryProps> = ({ onNodeDragStart }) => {
  const handleDragStart = (event: React.DragEvent, template: NodeTemplate) => {
    console.log('Drag started for:', template.type); // Debug log
    event.dataTransfer.setData('application/reactflow', JSON.stringify(template));
    event.dataTransfer.effectAllowed = 'move';
    onNodeDragStart(event, template.type, template);
  };

  return (
    <Card className="node-library">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Node Library
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Drag nodes to the canvas
        </Typography>

        <List>
          {nodeTemplates.map((template) => (
            <ListItem
              key={template.type}
              className="node-library__item"
              sx={{ p: 0, mb: 1 }}
            >
              <Paper
                elevation={1}
                sx={{
                  width: '100%',
                  p: 1,
                  cursor: 'grab',
                  '&:active': {
                    cursor: 'grabbing'
                  }
                }}
                draggable
                onDragStart={(event) => handleDragStart(event, template)}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    {template.icon}
                  </ListItemIcon>
                  <Box>
                    <ListItemText
                      primary={template.label}
                      secondary={template.description}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 'bold' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </Box>
                </Box>
              </Paper>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default NodeLibrary;

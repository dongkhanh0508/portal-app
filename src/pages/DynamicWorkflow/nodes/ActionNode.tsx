import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Settings } from '@mui/icons-material';
import { WorkflowNodeData } from '@/types/workflow';

const ActionNode: React.FC<NodeProps<WorkflowNodeData>> = ({ data, selected }) => {
  return (
    <Card
      sx={{
        minWidth: 150,
        border: selected ? '2px solid #1976d2' : '1px solid #e0e0e0',
        backgroundColor: '#e0f2f1'
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Settings color="info" />
          <Typography variant="body2" fontWeight="bold">
            {data.label}
          </Typography>
        </Box>
        {data.description && (
          <Typography variant="caption" color="textSecondary">
            {data.description}
          </Typography>
        )}
      </CardContent>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </Card>
  );
};

export default ActionNode;

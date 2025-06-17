import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import { WorkflowNodeData } from '@/types/workflow';

const StartNode: React.FC<NodeProps<WorkflowNodeData>> = ({ data, selected }) => {
  return (
    <Card
      sx={{
        minWidth: 150,
        border: selected ? '2px solid #1976d2' : '1px solid #e0e0e0',
        backgroundColor: '#e8f5e8'
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box display="flex" alignItems="center" gap={1}>
          <PlayArrow color="success" />
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
      <Handle type="source" position={Position.Right} />
    </Card>
  );
};

export default StartNode;

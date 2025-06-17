import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { AccountTree } from '@mui/icons-material';
import { WorkflowNodeData } from '@/types/workflow';

const ConditionNode: React.FC<NodeProps<WorkflowNodeData>> = ({ data, selected }) => {
  return (
    <Card
      sx={{
        minWidth: 150,
        border: selected ? '2px solid #1976d2' : '1px solid #e0e0e0',
        backgroundColor: '#f3e5f5',
        transform: 'rotate(45deg)',
        '& .MuiCardContent-root': {
          transform: 'rotate(-45deg)',
        }
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box display="flex" alignItems="center" gap={1}>
          <AccountTree color="secondary" />
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
      <Handle type="target" position={Position.Left} style={{ transform: 'rotate(-45deg)' }} />
      <Handle type="source" position={Position.Top} id="true" style={{ transform: 'rotate(-45deg)' }} />
      <Handle type="source" position={Position.Bottom} id="false" style={{ transform: 'rotate(-45deg)' }} />
    </Card>
  );
};

export default ConditionNode;

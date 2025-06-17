import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { ThumbUp } from '@mui/icons-material';
import { WorkflowNodeData } from '@/types/workflow';

const ApprovalNode: React.FC<NodeProps<WorkflowNodeData>> = ({ data, selected }) => {
  return (
    <Card
      sx={{
        minWidth: 200,
        border: selected ? '2px solid #1976d2' : '1px solid #e0e0e0',
        backgroundColor: '#fff3e0'
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <ThumbUp color="warning" />
          <Typography variant="body2" fontWeight="bold">
            {data.label}
          </Typography>
        </Box>
        {data.description && (
          <Typography variant="caption" color="textSecondary" display="block" mb={1}>
            {data.description}
          </Typography>
        )}
        {data.approvers && data.approvers.length > 0 && (
          <Box>
            <Typography variant="caption" color="textSecondary">
              Approvers:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
              {data.approvers.slice(0, 2).map((approver, index) => (
                <Chip
                  key={index}
                  label={approver}
                  size="small"
                  color="warning"
                  variant="outlined"
                />
              ))}
              {data.approvers.length > 2 && (
                <Chip
                  label={`+${data.approvers.length - 2}`}
                  size="small"
                  color="warning"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        )}
      </CardContent>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} id="approved" />
      <Handle type="source" position={Position.Bottom} id="rejected" />
    </Card>
  );
};

export default ApprovalNode;

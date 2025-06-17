import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { Assignment } from '@mui/icons-material';
import { WorkflowNodeData } from '@/types/workflow';

const FormNode: React.FC<NodeProps<WorkflowNodeData>> = ({ data, selected }) => {
  return (
    <Card
      sx={{
        minWidth: 200,
        border: selected ? '2px solid #1976d2' : '1px solid #e0e0e0',
        backgroundColor: '#e3f2fd'
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Assignment color="primary" />
          <Typography variant="body2" fontWeight="bold">
            {data.label}
          </Typography>
        </Box>
        {data.description && (
          <Typography variant="caption" color="textSecondary" display="block" mb={1}>
            {data.description}
          </Typography>
        )}
        {data.formFields && data.formFields.length > 0 && (
          <Box>
            <Typography variant="caption" color="textSecondary">
              Fields: {data.formFields.length}
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
              {data.formFields.slice(0, 3).map((field) => (
                <Chip
                  key={field.id}
                  label={field.name}
                  size="small"
                  variant="outlined"
                />
              ))}
              {data.formFields.length > 3 && (
                <Chip
                  label={`+${data.formFields.length - 3}`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        )}
      </CardContent>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </Card>
  );
};

export default FormNode;

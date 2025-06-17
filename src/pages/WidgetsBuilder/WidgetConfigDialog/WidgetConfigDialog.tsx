import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Slider,
  Typography,
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import { Widget } from '@/types/widgets';

interface WidgetConfigDialogProps {
  open: boolean;
  widget: Widget | null;
  onClose: () => void;
  onSave: (widget: Widget) => void;
}

const WidgetConfigDialog: React.FC<WidgetConfigDialogProps> = ({
  open,
  widget,
  onClose,
  onSave,
}) => {
  const [config, setConfig] = useState(widget?.config || {});
  const [tabValue, setTabValue] = useState(0);

  const handleSave = () => {
    if (widget) {
      onSave({
        ...widget,
        config,
        updatedAt: new Date(),
      });
    }
    onClose();
  };

  const renderConfigFields = () => {
    if (!widget) return null;

    switch (widget.type) {
      case 'todo':
        return (
          <Box>
            <TextField
              fullWidth
              label="Max Items"
              type="number"
              value={config.maxItems || 10}
              onChange={(e) => setConfig({ ...config, maxItems: parseInt(e.target.value) })}
              margin="normal"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={config.showCompleted || false}
                  onChange={(e) => setConfig({ ...config, showCompleted: e.target.checked })}
                />
              }
              label="Show Completed Tasks"
            />
          </Box>
        );

      case 'notes':
        return (
          <Box>
            <Typography gutterBottom>Font Size: {config.fontSize || 14}px</Typography>
            <Slider
              value={config.fontSize || 14}
              onChange={(_, value) => setConfig({ ...config, fontSize: value })}
              min={10}
              max={24}
              step={1}
            />
            <TextField
              fullWidth
              label="Background Color"
              value={config.backgroundColor || '#fff59d'}
              onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })}
              margin="normal"
            />
          </Box>
        );

      case 'chart':
        return (
          <Box>
            <FormControl fullWidth margin="normal">
              <InputLabel>Chart Type</InputLabel>
              <Select
                value={config.chartType || 'line'}
                onChange={(e) => setConfig({ ...config, chartType: e.target.value })}
              >
                <MenuItem value="line">Line Chart</MenuItem>
                <MenuItem value="bar">Bar Chart</MenuItem>
                <MenuItem value="pie">Pie Chart</MenuItem>
                <MenuItem value="doughnut">Doughnut Chart</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Refresh Interval (seconds)"
              type="number"
              value={config.refreshInterval || 60}
              onChange={(e) => setConfig({ ...config, refreshInterval: parseInt(e.target.value) })}
              margin="normal"
            />
          </Box>
        );

      default:
        return (
          <Typography color="textSecondary">
            No configuration options available for this widget.
          </Typography>
        );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Configure {widget?.title}</DialogTitle>

      <DialogContent>
        <Tabs value={tabValue} onChange={(_, value) => setTabValue(value)}>
          <Tab label="Settings" />
          <Tab label="Appearance" />
        </Tabs>

        <Box sx={{ mt: 2 }}>
          {tabValue === 0 && renderConfigFields()}
          {tabValue === 1 && (
            <Box>
              <TextField
                fullWidth
                label="Widget Title"
                value={widget?.title || ''}
                onChange={(e) => {
                  if (widget) {
                    // Update widget title through parent
                  }
                }}
                margin="normal"
              />
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WidgetConfigDialog;

import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Tooltip,
  Paper,
  Slider,
  Popover,
} from '@mui/material';
import {
  Palette,
  FormatSize,
  Save,
  MoreVert,
  Delete,
  ContentCopy,
} from '@mui/icons-material';
import { NotesWidget as NotesWidgetType } from '@/types/widgets';

interface NotesWidgetProps {
  widget: NotesWidgetType;
}

const NotesWidget: React.FC<NotesWidgetProps> = ({ widget }) => {
  const [content, setContent] = useState('Click to start writing...\n\nThis is your personal sticky note. You can write anything here - reminders, ideas, quick notes, or to-do items.');
  const [backgroundColor, setBackgroundColor] = useState(widget.config.backgroundColor);
  const [fontSize, setFontSize] = useState(widget.config.fontSize);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [colorAnchor, setColorAnchor] = useState<HTMLElement | null>(null);
  const [fontAnchor, setFontAnchor] = useState<HTMLElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  const colorPresets = [
    { name: 'Yellow', color: '#fff59d' },
    { name: 'Pink', color: '#f8bbd9' },
    { name: 'Blue', color: '#bbdefb' },
    { name: 'Green', color: '#c8e6c9' },
    { name: 'Orange', color: '#ffcc02' },
    { name: 'Purple', color: '#e1bee7' },
    { name: 'Cyan', color: '#b2ebf2' },
    { name: 'Lime', color: '#dcedc8' },
    { name: 'White', color: '#ffffff' },
  ];

  useEffect(() => {
    // Auto-save content
    const timer = setTimeout(() => {
      if (isEditing) {
        setLastSaved(new Date());
        setIsEditing(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [content, isEditing]);

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
    setIsEditing(true);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleColorOpen = (event: React.MouseEvent<HTMLElement>) => {
    setColorAnchor(event.currentTarget);
    handleMenuClose();
  };

  const handleColorClose = () => {
    setColorAnchor(null);
  };

  const handleFontOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFontAnchor(event.currentTarget);
    handleMenuClose();
  };

  const handleFontClose = () => {
    setFontAnchor(null);
  };

  const handleColorChange = (color: string) => {
    setBackgroundColor(color);
    handleColorClose();
  };

  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
  };

  const handleSave = () => {
    setLastSaved(new Date());
    setIsEditing(false);
    handleMenuClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    handleMenuClose();
  };

  const handleClear = () => {
    setContent('');
    setIsEditing(true);
    handleMenuClose();
  };

  const getTextColor = (bgColor: string) => {
    // Simple contrast calculation
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#333333' : '#ffffff';
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="caption" color={getTextColor(backgroundColor)}>
            {isEditing ? 'Editing...' : `Saved ${lastSaved.toLocaleTimeString()}`}
          </Typography>
          {isEditing && (
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#f44336',
                animation: 'pulse 1.5s infinite',
              }}
            />
          )}
        </Box>

        <IconButton
          size="small"
          onClick={handleMenuOpen}
          sx={{ color: getTextColor(backgroundColor) }}
        >
          <MoreVert fontSize="small" />
        </IconButton>
      </Box>

      {/* Content */}
      <TextField
        multiline
        fullWidth
        value={content}
        onChange={handleContentChange}
        placeholder="Start typing your note..."
        variant="standard"
        InputProps={{
          disableUnderline: true,
          style: {
            fontSize: `${fontSize}px`,
            color: getTextColor(backgroundColor),
            lineHeight: 1.4,
          },
        }}
        sx={{
          flex: 1,
          '& .MuiInputBase-root': {
            height: '100%',
            alignItems: 'flex-start',
            p: 2,
          },
          '& .MuiInputBase-input': {
            height: '100% !important',
            overflow: 'auto !important',
            '&::placeholder': {
              color: getTextColor(backgroundColor),
              opacity: 0.6,
            },
          },
        }}
      />

      {/* Character Count */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          borderRadius: 1,
          px: 1,
          py: 0.5,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: getTextColor(backgroundColor),
            opacity: 0.7,
            fontSize: '0.7rem',
          }}
        >
          {content.length} chars
        </Typography>
      </Box>

      {/* Options Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleColorOpen}>
          <Palette fontSize="small" sx={{ mr: 1 }} />
          Background Color
        </MenuItem>
        <MenuItem onClick={handleFontOpen}>
          <FormatSize fontSize="small" sx={{ mr: 1 }} />
          Font Size
        </MenuItem>
        <MenuItem onClick={handleSave}>
          <Save fontSize="small" sx={{ mr: 1 }} />
          Save Now
        </MenuItem>
        <MenuItem onClick={handleCopy}>
          <ContentCopy fontSize="small" sx={{ mr: 1 }} />
          Copy Text
        </MenuItem>
        <MenuItem onClick={handleClear} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Clear Note
        </MenuItem>
      </Menu>

      {/* Color Picker Popover */}
      <Popover
        open={Boolean(colorAnchor)}
        anchorEl={colorAnchor}
        onClose={handleColorClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Paper sx={{ p: 2, maxWidth: 200 }}>
          <Typography variant="subtitle2" gutterBottom>
            Choose Color
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {colorPresets.map((preset) => (
              <Tooltip key={preset.name} title={preset.name}>
                <Box
                  onClick={() => handleColorChange(preset.color)}
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: preset.color,
                    border: backgroundColor === preset.color ? '3px solid #2196f3' : '1px solid #ccc',
                    borderRadius: 1,
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                />
              </Tooltip>
            ))}
          </Box>
        </Paper>
      </Popover>

      {/* Font Size Popover */}
      <Popover
        open={Boolean(fontAnchor)}
        anchorEl={fontAnchor}
        onClose={handleFontClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Paper sx={{ p: 2, width: 200 }}>
          <Typography variant="subtitle2" gutterBottom>
            Font Size: {fontSize}px
          </Typography>
          <Slider
            value={fontSize}
            onChange={(_, value) => handleFontSizeChange(value as number)}
            min={10}
            max={24}
            step={1}
            marks={[
              { value: 10, label: '10px' },
              { value: 14, label: '14px' },
              { value: 18, label: '18px' },
              { value: 24, label: '24px' },
            ]}
          />
        </Paper>
      </Popover>

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
};

export default NotesWidget;

import React, { Component, ReactNode } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { Refresh, BugReport } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  widgetTitle?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class WidgetErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Widget Error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
          p={2}
          textAlign="center"
        >
          <BugReport sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
          <Typography variant="h6" color="error" gutterBottom>
            Widget Error
          </Typography>
          <Typography variant="body2" color="textSecondary" mb={2}>
            {this.props.widgetTitle} encountered an error
          </Typography>
          <Button
            startIcon={<Refresh />}
            onClick={this.handleRetry}
            variant="outlined"
            size="small"
          >
            Retry
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default WidgetErrorBoundary;

import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  IconButton,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Backspace,
  Clear,
  Functions,
} from '@mui/icons-material';
import { CalculatorWidget as CalculatorWidgetType } from '@/types/widgets';
import './CalculatorWidget.scss';

interface CalculatorWidgetProps {
  widget: CalculatorWidgetType;
}

const CalculatorWidget: React.FC<CalculatorWidgetProps> = ({ widget }) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [scientificMode, setScientificMode] = useState(widget.config.scientific);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performScientificOperation = (func: string) => {
    const inputValue = parseFloat(display);
    let result: number;

    switch (func) {
      case 'sin':
        result = Math.sin(inputValue * Math.PI / 180);
        break;
      case 'cos':
        result = Math.cos(inputValue * Math.PI / 180);
        break;
      case 'tan':
        result = Math.tan(inputValue * Math.PI / 180);
        break;
      case 'log':
        result = Math.log10(inputValue);
        break;
      case 'ln':
        result = Math.log(inputValue);
        break;
      case 'sqrt':
        result = Math.sqrt(inputValue);
        break;
      case 'x²':
        result = inputValue * inputValue;
        break;
      case '1/x':
        result = 1 / inputValue;
        break;
      case 'π':
        result = Math.PI;
        break;
      case 'e':
        result = Math.E;
        break;
      default:
        result = inputValue;
    }

    setDisplay(String(result));
    setWaitingForOperand(true);
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const basicButtons = [
    { label: 'C', action: clear, color: 'error' },
    { label: '±', action: () => setDisplay(String(-parseFloat(display))), color: 'secondary' },
    { label: '%', action: () => setDisplay(String(parseFloat(display) / 100)), color: 'secondary' },
    { label: '÷', action: () => performOperation('÷'), color: 'primary' },

    { label: '7', action: () => inputNumber('7') },
    { label: '8', action: () => inputNumber('8') },
    { label: '9', action: () => inputNumber('9') },
    { label: '×', action: () => performOperation('×'), color: 'primary' },

    { label: '4', action: () => inputNumber('4') },
    { label: '5', action: () => inputNumber('5') },
    { label: '6', action: () => inputNumber('6') },
    { label: '-', action: () => performOperation('-'), color: 'primary' },

    { label: '1', action: () => inputNumber('1') },
    { label: '2', action: () => inputNumber('2') },
    { label: '3', action: () => inputNumber('3') },
    { label: '+', action: () => performOperation('+'), color: 'primary' },

    { label: '0', action: () => inputNumber('0'), span: 2 },
    { label: '.', action: inputDecimal },
    { label: '=', action: () => performOperation('='), color: 'primary' },
  ];

  const scientificButtons = [
    { label: 'sin', action: () => performScientificOperation('sin') },
    { label: 'cos', action: () => performScientificOperation('cos') },
    { label: 'tan', action: () => performScientificOperation('tan') },
    { label: 'log', action: () => performScientificOperation('log') },
    { label: 'ln', action: () => performScientificOperation('ln') },
    { label: '√', action: () => performScientificOperation('sqrt') },
    { label: 'x²', action: () => performScientificOperation('x²') },
    { label: '1/x', action: () => performScientificOperation('1/x') },
    { label: 'π', action: () => performScientificOperation('π') },
    { label: 'e', action: () => performScientificOperation('e') },
  ];

  return (
    <Box className="calculator-widget" sx={{ p: 1, height: '100%' }}>
      {/* Display */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 1,
          backgroundColor: widget.config.theme === 'dark' ? '#333' : '#fff',
          color: widget.config.theme === 'dark' ? '#fff' : '#000',
        }}
      >
        <Typography
          variant="h4"
          align="right"
          sx={{
            fontFamily: 'monospace',
            minHeight: '1.5em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {display}
        </Typography>
      </Paper>

      {/* Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <FormControlLabel
          control={
            <Switch
              checked={scientificMode}
              onChange={(e) => setScientificMode(e.target.checked)}
              size="small"
            />
          }
          label="Scientific"
          sx={{ fontSize: '0.75rem' }}
        />

        <IconButton size="small" onClick={backspace}>
          <Backspace fontSize="small" />
        </IconButton>
      </Box>

      {/* Scientific Functions */}
      {scientificMode && (
        <Box sx={{ mb: 1 }}>
          <Grid container spacing={0.5}>
            {scientificButtons.map((btn, index) => (
              <Grid item xs={2.4} key={index}>
                <Button
                  fullWidth
                  size="small"
                  variant="outlined"
                  onClick={btn.action}
                  sx={{ minWidth: 0, fontSize: '0.7rem', py: 0.5 }}
                >
                  {btn.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Basic Calculator */}
      <Grid container spacing={0.5}>
        {basicButtons.map((btn, index) => (
          <Grid item xs={btn.span || 3} key={index}>
            <Button
              fullWidth
              variant={btn.color ? 'contained' : 'outlined'}
              color={btn.color as any}
              onClick={btn.action}
              sx={{
                minWidth: 0,
                aspectRatio: btn.span ? '2/1' : '1/1',
                fontSize: '1rem',
              }}
            >
              {btn.label}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CalculatorWidget;

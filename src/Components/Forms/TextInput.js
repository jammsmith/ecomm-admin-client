import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import colours from '../../styles/colours.js';

const TextInput = ({
  name,
  value,
  label,
  helperText,
  required,
  handleChange,
  autoFocus,
  type,
  disabled,
  variant,
  margin,
  multiline
}) => {
  return (
    <TextField
      id={name}
      name={name}
      value={value}
      aria-describedby={name}
      required={required !== false}
      helperText={helperText}
      label={label}
      margin={margin || 'dense'}
      variant={variant || 'filled'}
      onChange={handleChange}
      fullWidth
      autoFocus={autoFocus}
      disabled={disabled}
      type={type}
      multiline={multiline}
      sx={{
        backgroundColor: 'transparent',
        background: 'transparent',
        borderRadius: '10px',
        '.Mui-focused': {
          color: colours.dark
        }
      }}
    />
  );
};

TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  helperText: PropTypes.string,
  required: PropTypes.bool,
  autoFocus: PropTypes.bool,
  type: PropTypes.string, // html input type
  disabled: PropTypes.bool,
  variant: PropTypes.string,
  margin: PropTypes.string,
  multiline: PropTypes.bool
};

export default TextInput;

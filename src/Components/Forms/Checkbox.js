import React from 'react';
import PropTypes from 'prop-types';
import { FormControlLabel, Checkbox as MuiCheckbox } from '@mui/material';

// Colours
import colours from '../../styles/colours.js';
const { dark } = colours;

const Checkbox = ({ value, label, handleChange, size, disabled }) => {
  return (
    <FormControlLabel
      control={
        <MuiCheckbox
          size={size}
          onChange={handleChange}
          sx={{
            color: dark,
            '&.Mui-checked': {
              color: dark
            }
          }}
          value={value}
          disabled={disabled}
        />
      }
      sx={{
        color: dark,
        '.MuiFormControlLabel-label': {
          marginLeft: '0.75rem'
        }
      }}
      label={label}
    />
  );
};

Checkbox.propTypes = {
  value: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  size: PropTypes.string,
  disabled: PropTypes.bool
};

export default Checkbox;

import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const SelectInput = ({ name, value, required, label, handleChange, options, variant, disabled, style }) => (
  <FormControl
    fullWidth
    sx={style}
  >
    <InputLabel>{label}</InputLabel>
    <Select
      id={name}
      name={name}
      value={value}
      label={label}
      aria-describedby={name}
      required={required}
      variant={variant || 'filled'}
      onChange={handleChange}
      disabled={disabled}
      sx={{
        backgroundColor: 'transparent',
        background: 'transparent',
        borderRadius: '4px'
      }}
      MenuProps={{
        sx: {
          '.MuiMenu-list': {
            padding: '0.5rem'
          },
          '.MuiMenuItem-root': {
            fontSize: '1.25rem',
            width: '100%'
          },
          '.MuiButtonBase-root': {
            justifyContent: 'flex-start'
          },
          '.MuiMenu-paper': {
            width: '200px'
          }
        }
      }}
    >
      {
        options.map((option, index) => {
          return (
            <MenuItem key={index} value={option.value}>
              {option.name}
            </MenuItem>
          );
        })
      }
    </Select>
  </FormControl>
);

SelectInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  required: PropTypes.bool,
  variant: PropTypes.string,
  disabled: PropTypes.bool,
  style: PropTypes.object
};

export default SelectInput;

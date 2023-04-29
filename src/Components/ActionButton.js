// External imports
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

import ProgressSpinner from './ProgressSpinner.js';

// Fonts
import fonts from '../styles/fonts.js';
import colours from '../styles/colours.js';
const { standard } = fonts;
const { dark } = colours;

//
const ActionButton = ({ text, linkTo, variant, customStyles, onClick, name, value, disabled, fullWidth, loading }) => {
  const basicStyles = {
    fontFamily: standard,
    width: fullWidth && '100%',
    color: dark
  };

  if (customStyles) {
    customStyles = {
      ...basicStyles,
      ...customStyles
    };
  }

  const button =
    <Button
      onClick={onClick}
      name={name}
      value={value}
      variant={variant || 'outlined'}
      style={customStyles || basicStyles}
      disabled={loading || disabled || false}
    >
      {
        loading
          ? <ProgressSpinner size='1.25rem' color={dark} />
          : text
      }
    </Button>;

  return linkTo ? <Link to={linkTo}>{button}</Link> : button;
};

ActionButton.propTypes = {
  text: PropTypes.node.isRequired,
  name: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  linkTo: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  variant: PropTypes.string,
  customStyles: PropTypes.object,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool
};

export default ActionButton;

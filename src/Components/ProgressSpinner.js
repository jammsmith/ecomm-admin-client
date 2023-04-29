import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import colours from '../styles/colours.js';

const ProgressSpinner = ({ colour, size }) => {
  return <CircularProgress sx={{ color: colour ? colours[colour] : colours.dark }} size={size} />;
};

ProgressSpinner.propTypes = {
  colour: PropTypes.string,
  size: PropTypes.string
};

export default ProgressSpinner;

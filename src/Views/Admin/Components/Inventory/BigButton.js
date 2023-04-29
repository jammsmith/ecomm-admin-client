import React from 'react';
import PropTypes from 'prop-types';

import ActionButton from '../../../../Components/ActionButton.js';

const style = {
  border: '0.25rem solid white',
  color: 'white',
  width: '220px',
  height: '200px',
  fontSize: '1.25rem',
  borderRadius: '25px'
};

const BigButton = ({ type, handleSelection }) => (
  <ActionButton
    text={type}
    onClick={handleSelection}
    customStyles={style}
  />
);

BigButton.propTypes = {
  type: PropTypes.string.isRequired,
  handleSelection: PropTypes.func.isRequired
};

export default BigButton;

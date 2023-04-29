import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import colours from '../styles/colours.js';

const Label = styled.label`
  width: 6rem;
  height: 2.5rem;
  color: ${colours.dark};
  border: 1px solid rgba(0, 0, 0, 0.23);
  border-radius: 4px;
  padding: 5px 15px;
  font-size: 0.875rem;
  letter-spacing: 0.02857em;
  line-height: 1.75px;
  font-weight: 500;
  display: inline-flex;
  margin: 0;
  align-items: center;
  justify-content: center;
  
  :hover {
    background-color: rgba(0, 0, 0, 0.04);
    cursor: pointer;
  };
`;

const FileBrowseButton = ({ onChange }) => {
  return (
    <div>
      <Label htmlFor='file-upload'>
        BROWSE
      </Label>
      <input
        id='file-upload'
        type='file'
        style={{ display: 'none' }}
        onChange={onChange}
      />
    </div>
  );
};

FileBrowseButton.propTypes = {
  onChange: PropTypes.func.isRequired
};

export default FileBrowseButton;

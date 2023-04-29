import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// Colours
import colours from '../../styles/colours.js';
const { darkFade, dark } = colours;

export const StyledHeading = styled.h4`
  color: ${({ color }) => color || dark};
  ${({ noSpace }) => noSpace ? ({
    margin: 0
  }) : ({
    paddingTop: '0.5rem',
    paddingBottom: '0.25rem',
    marginBottom: '0.25rem'
  })};
  border-bottom: 1px solid ${({ color }) => color || darkFade};
  font-size: ${({ size }) => {
    switch (size) {
      case 'large':
        return '1.75rem';
      case 'x-small':
        return '1rem';
      case 'small':
        return '1.25rem';
      default: return '1.5rem';
    }
  }}
`;

const Heading = ({ text, ...other }) => {
  return <StyledHeading {...other}>{text}</StyledHeading>;
};

Heading.propTypes = {
  text: PropTypes.string.isRequired,
  size: PropTypes.string,
  color: PropTypes.string,
  noSpace: PropTypes.bool
};

export default Heading;

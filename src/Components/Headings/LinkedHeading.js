import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Heading from './Heading.js';
import ActionButton from '../ActionButton.js';

export const HeadingWrapper = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  margin: ${({ margin }) => margin || 0};
  justify-content: space-between;
`;

const LinkedHeading = ({ text, onClick, linkTo, buttonText, headingSize, color, margin }) => (
  <HeadingWrapper margin={margin}>
    <div style={{ flex: 1 }}>
      <Heading
        text={text}
        noSpace
        color={color}
        size={headingSize}
      />
    </div>
    <ActionButton
      text={buttonText}
      onClick={onClick || null}
      linkTo={linkTo || null}
      customStyles={{
        marginTop: '0.5rem',
        color: color === 'white' && '#fff',
        borderColor: color === 'white' && '#fff'
      }}
    />
  </HeadingWrapper>
);

LinkedHeading.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  linkTo: PropTypes.string,
  buttonText: PropTypes.string.isRequired,
  headingSize: PropTypes.string,
  color: PropTypes.string,
  margin: PropTypes.string
};

export default LinkedHeading;

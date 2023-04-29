import React from 'react';
import PropTypes from 'prop-types';
import useBreakpoints from '../../hooks/useBreakpoints.js';

const RowGroup = ({ children }) => {
  const { isXs } = useBreakpoints();
  /*
    Can't use styled components as MUI TextField loses focus on each letter typed
    when wrapped in a styled component...
  */
  const asRow = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '0.25rem'
  };

  const asColumn = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  };

  return (
    isXs
      ? <div style={asColumn}>{children}</div>
      : <div style={asRow}>{children}</div>
  );
};

RowGroup.propTypes = {
  children: PropTypes.node.isRequired
};

export default RowGroup;

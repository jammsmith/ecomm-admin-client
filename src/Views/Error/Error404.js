import React from 'react';
import PropTypes from 'prop-types';

const Error404 = ({ requestedURL }) => {
  return (
    <>
      <h1>Sorry!</h1>
      <p>{requestedURL ? `${requestedURL} doesn't exist.` : 'This page doesn\'t exist.'}</p>
    </>
  );
};

Error404.propTypes = {
  requestedURL: PropTypes.string
};

export default Error404;

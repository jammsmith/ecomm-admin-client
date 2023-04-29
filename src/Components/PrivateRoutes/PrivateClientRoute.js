import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import { RealmAppContext } from '../../realmApolloClient.js';
import { isAuthenticated } from '../../helpers/auth.js';

const PrivateClientRoute = ({ component: Component, ...rest }) => {
  const app = useContext(RealmAppContext);

  return (
    app.currentUser && app.currentUser.dbUser ? (
      <Route
        {...rest} render={props =>
          isAuthenticated(app.currentUser)
            ? <Component {...props} />
            : <Redirect to='/login' />}
      />
    ) : null
  );
};

PrivateClientRoute.propTypes = {
  component: PropTypes.func.isRequired,
  exact: PropTypes.bool,
  path: PropTypes.string.isRequired
};

export default PrivateClientRoute;

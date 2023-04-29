import React, { useState, useEffect, useContext } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

// Main views
import Admin from './Views/Admin/Admin.js'
import ForgottenPassword from './Views/Account/ForgottenPassword.js'
import ResetPassword from './Views/Account/ResetPassword.js'
import Login from './Views/Account/Login.js'

// Other
import PrivateAdminRoute from './Components/PrivateRoutes/PrivateAdminRoute.js'
import { RealmAppContext } from './realmApolloClient.js'

const App = () => {
  const { currentUser } = useContext(RealmAppContext)
  const [appReady, setAppReady] = useState(false)

  useEffect(() => {
    if (currentUser && currentUser.dbUser) {
      setAppReady(true)
    }
  }, [currentUser])

  return appReady ? (
    <Router>
      <Switch>
        <PrivateAdminRoute exact path='/' component={Admin} />
        <Route exact path='/login' render={() => <Login />} />
        <Route
          exact
          path='/forgotPassword'
          render={() => <ForgottenPassword />}
        />
        <Route exact path='/resetPassword' render={() => <ResetPassword />} />
      </Switch>
    </Router>
  ) : null
}

export default App

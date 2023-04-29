import React, { useState, useContext, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Link, useHistory } from 'react-router-dom'
import uniqueString from 'unique-string'
import styled from 'styled-components'

import ActionButton from '../../Components/ActionButton.js'
import TextInput from '../../Components/Forms/TextInput.js'
import UserMessage from '../../Components/UserMessage.js'
import { RealmAppContext } from '../../realmApolloClient.js'
import {
  registerEmailPassword,
  getLoginError,
  isAuthenticated,
  isAdmin,
} from '../../helpers/auth.js'
import mutations from '../../graphql/mutations.js'
import useDDMutation from '../../hooks/useDDMutation.js'
import colours from '../../styles/colours.js'

// Styled components
export const BackgroundWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: #8dd9bf;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const LoginWrapper = styled.div`
  background-color: #fff;
  border-radius: 5px;
  box-shadow: -3px -1px 10px 2px rgba(0, 0, 0, 0.2);
  padding: 1rem;
  margin: 1rem auto;
  -webkit-box-shadow: -3px -1px 10px 2px rgba(0, 0, 0, 0.2);
  @media (min-width: 1024px) {
    width: 40%;
  }
`
const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1rem 0 0.5rem 0;
`
const ForgotPassword = styled(Link)`
  color: ${colours.dark};
  text-decoration: none;
  :hover {
    color: ${colours.dark};
    cursor: pointer;
    text-decoration: underline;
  }
`

const Login = ({ form }) => {
  const app = useContext(RealmAppContext)
  const { dbUser } = app.currentUser

  const [formType, setFormType] = useState(form || 'login')
  const [formFields, setFormFields] = useState({
    email: dbUser && dbUser.email ? dbUser.email : '',
    password: '',
    confirmPassword: '',
  })
  const [errorMessage, setErrorMessage] = useState()

  const [addUser] = useDDMutation(mutations.AddUser)

  const history = useHistory()

  // Event handlers
  const handleFormChange = (e) => {
    setFormFields((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    const { error } = await app.logIn(formFields.email, formFields.password)

    if (
      !error &&
      isAuthenticated(app.currentUser) &&
      isAdmin(app.currentUser)
    ) {
      history.push('/')
    } else {
      const message = getLoginError(error)
      setErrorMessage(message)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    const { email, password, confirmPassword } = formFields

    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match")
      return
    }

    try {
      const { error: registerError } = await registerEmailPassword(
        app,
        email,
        password
      )

      if (!registerError) {
        // If app.currentUser has been created as a guest user, save relevant details
        // to be duplicated into new user object
        const guestUser = dbUser &&
          dbUser.orders &&
          dbUser.orders.length && {
            _id: dbUser._id,
            user_id: dbUser.user_id,
            firstName: dbUser.firstName || '',
            lastName: dbUser.lastName || '',
            phone: dbUser.phone || '',
            orders: [],
            addresses: [],
          }
        // log user in, this will complete registration and create a new permenant user ID
        const { user, error: loginError } = await app.logIn(email, password)

        if (loginError) {
          const message = getLoginError(loginError)
          setErrorMessage(message)
          return
        }

        // create new user, keep existing data if it exists
        const { data: addUserData } = await addUser({
          variables: {
            _id: user.id,
            user_id: guestUser
              ? guestUser.user_id
              : `user-${await uniqueString()}`,
            email: email,
            type: 'customer',
          },
        })
        const newUser = addUserData.insertOneUser

        await app.setCurrentUser((user) => ({
          ...user,
          dbUser: newUser,
        }))

        setErrorMessage('Must have account enabled as admin to login')
      } else {
        setErrorMessage(registerError)
      }
    } catch (err) {
      throw new Error('Failed to register user. Error:', err.message)
    }
  }

  const locationStateUsed = useRef(false)
  useEffect(() => {
    if (isAuthenticated(app.currentUser) && isAdmin(app.currentUser)) {
      history.push('/')
      return
    }
    if (form && formType !== form && locationStateUsed.current === false) {
      setFormType(form)
      locationStateUsed.current = true
    }
  }, [formType, form, app.currentUser, history])

  return (
    <BackgroundWrapper>
      <LoginWrapper>
        <div>
          {formType === 'login'
            ? 'Login to your account'
            : 'Register an account'}
        </div>
        <div>
          <TextInput
            autoFocus
            label='Email Address'
            name='email'
            type='email'
            value={formFields.email}
            handleChange={handleFormChange}
          />
          <TextInput
            label='Password'
            name='password'
            type='password'
            value={formFields.password}
            handleChange={handleFormChange}
          />
          {formType === 'register' && (
            <TextInput
              label='Confirm password'
              name='confirmPassword'
              type='password'
              value={formFields.confirmPassword}
              handleChange={handleFormChange}
            />
          )}
        </div>
        {formType === 'login' ? (
          <ButtonsWrapper>
            <ActionButton
              text='register new account'
              onClick={() => setFormType('register')}
            />
            <ActionButton
              text='login'
              onClick={handleLogin}
              customStyles={{
                borderWidth: '0.15rem',
                borderColor: colours.dark,
              }}
            />
          </ButtonsWrapper>
        ) : (
          <ButtonsWrapper>
            <ActionButton
              text='login to your account'
              onClick={() => setFormType('login')}
            />
            <ActionButton
              text='register'
              onClick={handleRegister}
              customStyles={{
                borderWidth: '0.15rem',
                borderColor: colours.dark,
              }}
            />
          </ButtonsWrapper>
        )}
        {formType === 'login' && (
          <ForgotPassword to='/forgotPassword'>
            Forgotten your password?
          </ForgotPassword>
        )}
        {errorMessage && <UserMessage text={errorMessage} type='error' />}
      </LoginWrapper>
    </BackgroundWrapper>
  )
}

Login.propTypes = {
  form: PropTypes.string,
}

export default Login

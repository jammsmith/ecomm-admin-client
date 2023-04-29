import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import ActionButton from '../../Components/ActionButton.js'
import TextInput from '../../Components/Forms/TextInput.js'
import UserMessage from '../../Components/UserMessage.js'
import { RealmAppContext } from '../../realmApolloClient.js'

import { BackgroundWrapper, LoginWrapper } from './Login.js'

const ResetPassword = () => {
  const app = useContext(RealmAppContext)

  const [message, setMessage] = useState(null)
  const [formFields, setFormFields] = useState({
    password: '',
    confirmPassword: '',
  })

  const history = useHistory()

  // Get tokens from url params
  const params = new URLSearchParams(window.location.search)
  const token = params.get('token')
  const tokenId = params.get('tokenId')

  if (!token || !tokenId) {
    history.replace('/')
  }

  //
  const handleFormChange = (e) => {
    setFormFields((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleReset = async () => {
    if (formFields.password === formFields.confirmPassword) {
      try {
        await app.emailPasswordAuth.resetPassword({
          password: formFields.password,
          token,
          tokenId,
        })
        setMessage({ type: 'success', text: 'Password reset successful' })
      } catch (err) {
        setMessage({
          type: 'error',
          text: ` Failed to reset password. ${err.error}`,
        })
      }
    } else {
      setMessage({ type: 'error', text: "Passwords don't match" })
    }
  }

  const handleResendEmail = async () => {
    try {
      const email = app.currentUser.dbUser.email
      await app.emailPasswordAuth.sendResetPasswordEmail({ email })
      setMessage({
        type: 'success',
        text: `An email has been sent to ${email}.  Please click on the link in this email to reset your password.`,
      })
    } catch (err) {}
  }

  return (
    <BackgroundWrapper>
      <LoginWrapper>
        <div>Set a new password</div>
        <div>
          <TextInput
            autoFocus
            label='Password'
            name='password'
            type='password'
            value={formFields.password}
            handleChange={handleFormChange}
          />
          <TextInput
            label='Confirm password'
            name='confirmPassword'
            type='password'
            value={formFields.confirmPassword}
            handleChange={handleFormChange}
          />
        </div>
        <ActionButton text='reset' onClick={handleReset} />
        <ActionButton
          text='resend email'
          onClick={handleResendEmail}
          customStyles={{ marginLeft: '0.5rem' }}
        />
        {message && <UserMessage text={message.text} type={message.type} />}
      </LoginWrapper>
    </BackgroundWrapper>
  )
}

export default ResetPassword

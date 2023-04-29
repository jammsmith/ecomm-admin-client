import React, { useState, useContext } from 'react'

import ActionButton from '../../Components/ActionButton.js'
import TextInput from '../../Components/Forms/TextInput.js'
import UserMessage from '../../Components/UserMessage.js'
import { RealmAppContext } from '../../realmApolloClient.js'

import { BackgroundWrapper, LoginWrapper } from './Login.js'

const ForgottenPassword = () => {
  const app = useContext(RealmAppContext)

  const [message, setMessage] = useState(null)
  const [formFields, setFormFields] = useState({
    email: '',
  })

  //
  const handleFormChange = (e) => {
    setFormFields((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSendEmail = async () => {
    try {
      const email = formFields.email
      await app.emailPasswordAuth.sendResetPasswordEmail({ email })
      setMessage({
        type: 'success',
        text: `An email has been sent to ${email}.  Please click on the link in this email to reset your password.`,
      })
    } catch (err) {
      let message =
        'Failed to send password reset email.  Try refreshing and trying again or please contact Doves and Dandys'
      console.log('err', err.errorCode)
      if (err.errorCode === 'UserNotFound') {
        message = 'Email address does not exist'
      }
      setMessage({ type: 'error', text: message })
    }
  }

  return (
    <BackgroundWrapper>
      <LoginWrapper>
        <div>Please enter the email address for your account</div>
        <TextInput
          label='Email'
          name='email'
          type='email'
          value={formFields.confirmPassword}
          handleChange={handleFormChange}
        />
        <ActionButton text='Request password reset' onClick={handleSendEmail} />
        {message && <UserMessage text={message.text} type={message.type} />}
      </LoginWrapper>
    </BackgroundWrapper>
  )
}

export default ForgottenPassword

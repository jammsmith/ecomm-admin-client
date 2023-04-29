import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'

import ActionButton from '../../../../Components/ActionButton.js'
import { RealmAppContext } from '../../../../realmApolloClient.js'

// Styled components
import { Wrapper, MainText, ButtonsWrapper } from './styledComponents.js'

const buttonStyles = {
  borderColor: '#fff',
  color: '#fff',
}

const Navbar = () => {
  const app = useContext(RealmAppContext)
  const history = useHistory()

  const handleLogout = async (e) => {
    e.preventDefault()
    await app.logOut()
    history.push('/login')
  }

  return (
    <Wrapper>
      <MainText>Melon's Dashboard</MainText>
      <ButtonsWrapper>
        <ActionButton
          text='logout'
          onClick={handleLogout}
          customStyles={buttonStyles}
        />
      </ButtonsWrapper>
    </Wrapper>
  )
}

export default Navbar

import React from 'react'

import Navbar from './Components/Navbar/Navbar.js'
import Orders from './Components/Orders/Orders.js'
import Inventory from './Components/Inventory/Inventory.js'

// Styled components
import { AdminWrapper } from './admin.styled.js'

const Admin = () => {
  return (
    <>
      <Navbar />
      <AdminWrapper>
        <Orders />
        <Inventory />
      </AdminWrapper>
    </>
  )
}

export default Admin

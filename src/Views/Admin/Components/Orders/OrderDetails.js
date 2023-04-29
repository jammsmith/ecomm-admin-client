import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client'
import { Dialog } from '@mui/material'

import DeliverySection from './DeliverySection.js'
import PaymentSection from './PaymentSection.js'
import StatusSection from './StatusSection.js'
import LinkedHeading from '../../../../Components/Headings/LinkedHeading.js'
import { SINGLE_ORDER_DETAILED } from '../../../../graphql/queries.js'

import { DialogHeadingWrapper } from './styledComponents.js'
import { DialogContentWrapper } from '../../admin.styled.js'

const OrderDetails = ({ open, handleClose, orderId }) => {
  const [order, setOrder] = useState()

  const { data, loading } = useQuery(SINGLE_ORDER_DETAILED, {
    variables: { orderId },
    skip: !orderId,
  })

  useEffect(() => {
    if (data && data.order) {
      setOrder(data.order)
    }
  }, [data, loading])

  return (
    <Dialog
      open={open}
      fullScreen
      sx={{
        '.MuiDialog-paper': {
          backgroundColor: 'rgba(63, 81, 181, 1)',
        },
      }}
    >
      <DialogHeadingWrapper>
        <LinkedHeading
          text='Manage Orders'
          onClick={handleClose}
          buttonText='back to dashboard'
          color='white'
        />
      </DialogHeadingWrapper>
      <DialogContentWrapper>
        <DeliverySection order={order || {}} />
        <PaymentSection order={order || {}} />
        <StatusSection order={order || {}} />
      </DialogContentWrapper>
    </Dialog>
  )
}

OrderDetails.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  orderId: PropTypes.string.isRequired,
}

export default OrderDetails

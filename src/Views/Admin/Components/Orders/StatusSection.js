import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import Heading from '../../../../Components/Headings/Heading.js'
import ActionButton from '../../../../Components/ActionButton.js'
import ProgressSpinner from '../../../../Components/ProgressSpinner.js'
import useDDMutation from '../../../../hooks/useDDMutation.js'
import mutations from '../../../../graphql/mutations.js'
import { capitaliseFirstCharacter } from '../../../../helpers/global.js'

// Styled components
import {
  DataSection as Section,
  CurrentStatusRow,
  DataRowLeftItem,
  DataRowRightItem,
  StatusButtons,
  OrderStatusContainer,
} from './styledComponents.js'
import { DataLoading } from '../../admin.styled.js'

const StatusSection = ({ order }) => {
  const [loading, setLoading] = useState({})
  const [status, setStatus] = useState(order ? order.orderStatus : null)

  const [updateOrder] = useDDMutation(mutations.UpdateOrder)

  const updateOrderStatus = async (e, status) => {
    try {
      e.preventDefault()
      setLoading({ button: status, state: true })

      const variables = {
        id: order._id,
        orderStatus: status,
      }
      if (status !== 'archived') {
        const capitalisedStatus = capitaliseFirstCharacter(status)
        const dateUpdatedKey = `date${capitalisedStatus}`
        variables[dateUpdatedKey] = new Date(Date.now())
      }

      await updateOrder({ variables })

      setStatus(status)
      setLoading({ button: status, state: false })
    } catch (err) {
      throw new Error('Failed to update order. Error:', err)
    } finally {
      loading.state === true && setLoading({})
    }
  }

  useEffect(() => {
    if (order && order.orderStatus !== status) {
      setStatus(order.orderStatus)
    }
  }, [order, status])

  return (
    <Section>
      <Heading text='Order Status' size='small' />
      {order && status ? (
        <OrderStatusContainer>
          <CurrentStatusRow>
            <DataRowLeftItem>Current Status</DataRowLeftItem>
            <DataRowRightItem>{_.startCase(status)}</DataRowRightItem>
          </CurrentStatusRow>
          <StatusButtons>
            <ActionButton
              text='Accept Order'
              onClick={(e) => updateOrderStatus(e, 'accepted')}
              fullWidth
              disabled={
                status === 'accepted' ||
                status === 'dispatched' ||
                status === 'archived'
              }
              loading={loading.status === true && loading.button === 'accepted'}
            />
            <ActionButton
              text='Mark as dispatched'
              onClick={(e) => updateOrderStatus(e, 'dispatched')}
              fullWidth
              disabled={status === 'dispatched' || status === 'archived'}
              loading={
                loading.status === true && loading.button === 'dispatched'
              }
            />
            <ActionButton
              text='Archive Order'
              onClick={(e) => updateOrderStatus(e, 'archived')}
              fullWidth
              disabled={status === 'archived'}
              loading={loading.status === true && loading.button === 'archived'}
            />
          </StatusButtons>
        </OrderStatusContainer>
      ) : (
        <DataLoading>
          <ProgressSpinner size='3rem' colour='blue' />
        </DataLoading>
      )}
    </Section>
  )
}

StatusSection.propTypes = {
  order: PropTypes.object.isRequired,
}

export default StatusSection

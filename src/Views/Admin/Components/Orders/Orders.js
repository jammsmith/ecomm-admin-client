import React, { useState, useRef, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import _ from 'lodash'

import OrderDetails from './OrderDetails.js'
import DDTable from '../../../../Components/Table/DDTable.js'
import LinkedHeading from '../../../../Components/Headings/LinkedHeading.js'
import ProgressSpinner from '../../../../Components/ProgressSpinner.js'
import {
  ADMIN_ACTIVE_ORDERS,
  ADMIN_ARCHIVED_ORDERS,
} from '../../../../graphql/queries.js'

// Styled components
import { OrdersWrapper, DataLoading } from '../../admin.styled.js'

const Orders = () => {
  // Dialog state / handlers
  const [dialogOpen, setDialogOpen] = useState(false)
  const [orderType, setOrderType] = useState('active')
  const [rows, setRows] = useState([])

  const selectedOrderId = useRef('')

  const { data: activeOrders, loading, error } = useQuery(ADMIN_ACTIVE_ORDERS)
  const { data: archivedOrders } = useQuery(ADMIN_ARCHIVED_ORDERS)

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }
  const handleOpenDialog = (orderId) => {
    selectedOrderId.current = orderId
    setDialogOpen(true)
  }

  const columns = [
    { name: 'orderId', label: 'Order ID' },
    { name: 'product', label: 'Product' },
    { name: 'paymentStatus', label: 'Payment Status' },
    { name: 'orderStatus', label: 'Order Status' },
  ]

  useEffect(() => {
    try {
      const buildRows = (orderId, product, paymentStatus, orderStatus) => {
        return {
          orderId,
          product,
          paymentStatus: _.startCase(paymentStatus),
          orderStatus: _.startCase(orderStatus),
        }
      }

      const queryData = orderType === 'active' ? activeOrders : archivedOrders

      if (queryData && queryData.orders && queryData.orders.length) {
        const orders = queryData.orders

        const tableRows = orders.map((order) => {
          let product = 'Multiple products'
          if (order.orderItems.length === 1) {
            product = order.orderItems[0].product.name
          }

          return buildRows(
            order.order_id,
            product,
            order.paymentStatus,
            order.orderStatus
          )
        })
        setRows(tableRows)
      } else if (error) {
        throw new Error('Graphql error:', error.message)
      }
    } catch (err) {
      console.error(err)
    }
  }, [orderType, activeOrders, archivedOrders, error])

  const handleSwitchOrderType = () => {
    if (orderType === 'active') setOrderType('archived')
    if (orderType === 'archived') setOrderType('active')
  }

  return (
    <>
      <OrderDetails
        open={dialogOpen}
        handleClose={handleCloseDialog}
        orderId={selectedOrderId.current}
      />
      <OrdersWrapper>
        <LinkedHeading
          text={`${_.startCase(orderType)} Orders`}
          size='small'
          color='white'
          onClick={handleSwitchOrderType}
          buttonText={`View ${
            orderType === 'active' ? 'Archived' : 'Active'
          } Orders`}
        />
        {loading ? (
          <DataLoading>
            <ProgressSpinner size='3rem' colour='white' />
          </DataLoading>
        ) : rows ? (
          <DDTable
            rows={rows}
            columns={columns}
            size='small'
            handleRowClick={handleOpenDialog}
            style={{ marginTop: '1rem' }}
          />
        ) : (
          <p style={{ color: 'white' }}>No active orders</p>
        )}
      </OrdersWrapper>
    </>
  )
}

export default Orders

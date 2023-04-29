import React, { useState, useContext, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { TextField, InputAdornment } from '@mui/material'

import Heading from '../../../../Components/Headings/Heading.js'
import ActionButton from '../../../../Components/ActionButton.js'
import ProgressSpinner from '../../../../Components/ProgressSpinner.js'
import SelectInput from '../../../../Components/Forms/SelectInput.js'
import UserMessage from '../../../../Components/UserMessage.js'
import { RealmAppContext } from '../../../../realmApolloClient.js'
import {
  convertStripeAmountToPrice,
  convertPriceToStripeAmount,
  toTwoDecimalPlaces,
} from '../../../../helpers/price.js'
import {
  getTotalPreviousRefunds,
  verifyRefundAmount,
  checkIsFullRefund,
} from '../../../../helpers/refund.js'

// Styled components
import {
  PaymentSectionWrapper,
  DataSection as Section,
  DataRow,
  DataRowLeftItem,
  DataRowRightItem,
  RefundWrapper,
} from './styledComponents.js'
import { DataLoading } from '../../admin.styled.js'

const PaymentSection = ({ order }) => {
  const app = useContext(RealmAppContext)

  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [paymentIntent, setPaymentIntent] = useState()
  const [existingRefundTotal, setExistingRefundTotal] = useState(0)
  const [pendingRefundTotal, setPendingRefundTotal] = useState(0)
  const [refund, setRefund] = useState({ reason: 'requested_by_customer' })

  useEffect(() => {
    if (order && order.refunds && order.refunds.length) {
      const prevRefunds = getTotalPreviousRefunds(order.refunds)
      setExistingRefundTotal(prevRefunds)
    }
  }, [order])

  const handleRefundSubmit = async () => {
    setLoading(true)
    if (!refund.amount || !refund.reason) {
      setError('Refund must include an amount and reason')
      return
    }

    // Make sure the refund amount doesn't exceed the order amount (including any past partial refunds)
    const verified = verifyRefundAmount(
      refund.amount,
      paymentIntent.amount,
      existingRefundTotal
    )

    if (verified) {
      const refundAmount = toTwoDecimalPlaces(refund.amount) // returns string representation of price to maintain trailing 0's
      const orderTotal = convertStripeAmountToPrice(paymentIntent.amount)
      const isFullRefund = checkIsFullRefund(
        refundAmount,
        orderTotal,
        existingRefundTotal
      )
      const stripeAmount = convertPriceToStripeAmount(refundAmount)

      // refund payment through stripe & add refund to db collection
      const stripeRefund =
        await app.currentUser.functions.stripe_refundPaymentIntent(
          paymentIntent.id,
          stripeAmount,
          refundAmount,
          refund.reason,
          isFullRefund
        )
      if (stripeRefund.status === 'succeeded') {
        setExistingRefundTotal(existingRefundTotal + parseFloat(refundAmount))
      } else if (stripeRefund.status === 'pending') {
        setPendingRefundTotal(pendingRefundTotal + parseFloat(refundAmount))
      } else {
        setError('Refund failed')
        return
      }
    } else {
      setError('Total refund amount exceeds the order amount')
      return
    }

    setLoading(false)
    setError('')
  }

  const handleRefundReasonSelect = (e) => {
    const reason = e.target.value
    setRefund((prev) => ({ ...prev, reason }))
  }
  const handleRefundAmountInput = (e) => {
    const amount = e.target.value
    setRefund((prev) => ({ ...prev, amount }))
  }

  const getPaymentIntent = useCallback(async () => {
    try {
      const paymentIntent =
        await app.currentUser.functions.stripe_retrievePaymentIntent(
          order.paymentIntentId
        )
      setPaymentIntent(paymentIntent)
    } catch (err) {
      console.error('Failed to retrieve payment intent', err)
    }
  }, [app.currentUser, order])

  useEffect(() => {
    if (order && order.paymentIntentId && !paymentIntent) {
      getPaymentIntent()
    }
  }, [order, paymentIntent, getPaymentIntent])

  useEffect(() => {
    if (error && loading) {
      setLoading(false)
    }
  }, [error, loading])

  return (
    <PaymentSectionWrapper>
      <Section>
        <Heading text='Payment Details' size='small' />
        {order && paymentIntent ? (
          <div>
            <DataRow>
              <DataRowLeftItem>Date Paid</DataRowLeftItem>
              <DataRowRightItem>
                {order.datePaid.split('T')[0]}
              </DataRowRightItem>
            </DataRow>
            <DataRow>
              <DataRowLeftItem>Amount Paid</DataRowLeftItem>
              <DataRowRightItem>
                {convertStripeAmountToPrice(paymentIntent.amount)}
              </DataRowRightItem>
            </DataRow>
            <DataRow>
              <DataRowLeftItem>Currency</DataRowLeftItem>
              <DataRowRightItem>
                {paymentIntent.currency.toUpperCase()}
              </DataRowRightItem>
            </DataRow>
            <DataRow>
              <DataRowLeftItem>Pending Refunds</DataRowLeftItem>
              <DataRowRightItem>
                {toTwoDecimalPlaces(pendingRefundTotal)}
              </DataRowRightItem>
            </DataRow>
            <DataRow>
              <DataRowLeftItem>Completed Refunds</DataRowLeftItem>
              <DataRowRightItem>
                {toTwoDecimalPlaces(existingRefundTotal)}
              </DataRowRightItem>
            </DataRow>
          </div>
        ) : (
          <DataLoading>
            <ProgressSpinner size='3rem' colour='blue' />
          </DataLoading>
        )}
      </Section>
      <Section>
        <RefundWrapper>
          <Heading text='Refund' size='small' />
          <SelectInput
            name='refundReason'
            value={refund.reason}
            label='Select a reason for the refund'
            handleChange={handleRefundReasonSelect}
            required
            options={[
              { name: 'Requested by customer', value: 'requested_by_customer' },
              { name: 'Duplicate order', value: 'duplicate' },
              { name: 'Fraudulent', value: 'fraudulent' },
            ]}
            variant='outlined'
            isAdminSelect
          />
          <TextField
            label='Refund amount'
            variant='outlined'
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>£</InputAdornment>
              ),
            }}
            onChange={handleRefundAmountInput}
          />
          <ActionButton
            text='refund order'
            onClick={handleRefundSubmit}
            fullWidth
            loading={loading}
          />
          {error && <UserMessage text={error} type='error' />}
        </RefundWrapper>
      </Section>
    </PaymentSectionWrapper>
  )
}

PaymentSection.propTypes = {
  order: PropTypes.object.isRequired,
}

export default PaymentSection

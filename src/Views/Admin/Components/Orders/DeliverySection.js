import React from 'react'
import PropTypes from 'prop-types'
import { IoCheckmarkCircleSharp } from 'react-icons/io5'

import Heading from '../../../../Components/Headings/Heading.js'
import ProgressSpinner from '../../../../Components/ProgressSpinner.js'

// Styled components
import {
  DataSection as Section,
  DataRow,
  DataRowLeftItem,
  DataRowRightItem,
  DeliveryNotesWrapper,
  DeliveryNotes,
  AddressWrapper,
} from './styledComponents.js'
import { DataLoading } from '../../admin.styled.js'

const DeliverySection = ({ order }) => {
  const { delivery } = order
  return (
    <Section>
      <Heading text='Delivery Details' size='small' />
      {order && delivery ? (
        <div>
          <DataRow>
            <DataRowLeftItem>Name</DataRowLeftItem>
            <DataRowRightItem>
              {delivery.firstName} {delivery.lastName}
            </DataRowRightItem>
          </DataRow>
          <DataRow>
            <DataRowLeftItem>Email</DataRowLeftItem>
            <DataRowRightItem>{delivery.email}</DataRowRightItem>
          </DataRow>
          <DataRow>
            <DataRowLeftItem>Phone</DataRowLeftItem>
            <DataRowRightItem>{delivery.phone}</DataRowRightItem>
          </DataRow>
          <DataRow>
            {delivery.address ? (
              <>
                <DataRowLeftItem>Address</DataRowLeftItem>
                <AddressWrapper>
                  <DataRowRightItem>{delivery.address.line1}</DataRowRightItem>
                  <DataRowRightItem>{delivery.address.line2}</DataRowRightItem>
                  <DataRowRightItem>{delivery.address.city}</DataRowRightItem>
                  <DataRowRightItem>
                    {delivery.address.postcode.toUpperCase()}
                  </DataRowRightItem>
                  <DataRowRightItem>
                    {delivery.address.country.toUpperCase()}
                  </DataRowRightItem>
                </AddressWrapper>
              </>
            ) : (
              <>
                <DataRowLeftItem>Store Pick-up</DataRowLeftItem>
                <IoCheckmarkCircleSharp
                  style={{ fontSize: '1.5rem', color: 'green' }}
                />
              </>
            )}
          </DataRow>
          <DeliveryNotesWrapper>
            <DataRowLeftItem>Notes</DataRowLeftItem>
            <DeliveryNotes>{order.extraInfo}</DeliveryNotes>
          </DeliveryNotesWrapper>
        </div>
      ) : (
        <DataLoading>
          <ProgressSpinner size='3rem' colour='blue' />
        </DataLoading>
      )}
    </Section>
  )
}

DeliverySection.propTypes = {
  order: PropTypes.object.isRequired,
}

export default DeliverySection

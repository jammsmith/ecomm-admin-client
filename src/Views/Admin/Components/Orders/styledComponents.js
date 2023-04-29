import styled from 'styled-components';

import colours from '../../../../styles/colours.js';

export const DataSection = styled.div`
  background-color: #fff;
  border-radius: 6px;
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  flex-direction: column;
  margin: 0;
  justify-content: flex-start;
  padding: 1rem;
  -webkit-box-shadow: -3px -1px 10px 2px rgba(0,0,0,0.2);
  box-shadow: -3px -1px 10px 2px rgba(0,0,0,0.2);
`;
export const DataRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 0.03px solid rgba(0,0,0,0.2);
  margin-bottom: 0.5rem;
  padding-bottom: 0.25rem;
  min-height: 2.5rem;
`;
export const DataRowLeftItem = styled.h6`
  margin: 0 1rem 0 0;
  width: 10rem;
`;
export const DataRowRightItem = styled.h4`
  margin: 0;
  flex-wrap: wrap;
`;

// Delivery details
export const AddressWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;
export const DeliveryNotesWrapper = styled(DataRow)`
  margin-top: 1rem;
  height: 12rem;
`;
export const DeliveryNotes = styled.p`
  font-size: 1.15rem;
  margin: 0;
  line-height: 1.5rem;
  height: 12rem;
  overflow: scroll;
`;

// Payment details
export const PaymentSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 1rem;
`;
export const RefundWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// Order Status
export const OrderStatusContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const CurrentStatusRow = styled(DataRow)`
  background-color: ${colours.green};
  color: ${colours.white};
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  border: none;
  padding: 1rem;
  border-radius: 10px;
`;

export const StatusButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem
`;

export const DialogHeadingWrapper = styled.div`
  margin: 0 1rem;
`;

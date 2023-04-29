import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { IoAlertCircleOutline, IoCheckmarkCircleOutline, IoWarningOutline } from 'react-icons/io5';

const Wrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin: 0.25rem;
`;

const Message = styled.span`
  color: ${props => props.colour};
  font-size: 0.8rem;
  margin: 0;
`;
const TickIcon = styled(IoCheckmarkCircleOutline)`
  color: green;
  font-size: 1.25rem;
`;
const WarningIcon = styled(IoWarningOutline)`
  color: orange;
  font-size: 1.25rem;
`;

const ErrorIcon = styled(IoAlertCircleOutline)`
  color: red; 
  font-size: 1.25rem;
`;

const UserMessage = ({ text, type }) => {
  let icon;
  let colour;
  switch (type) {
    case 'success':
      icon = <TickIcon />;
      colour = 'green';
      break;
    case 'warning':
      icon = <WarningIcon />;
      colour = 'orange';
      break;
    case 'error':
      icon = <ErrorIcon />;
      colour = 'red';
      break;
    default: throw new Error('Invalid user message type');
  }
  return (
    <Wrapper>
      {icon}
      <Message colour={colour}>{text}</Message>
    </Wrapper>
  );
};

UserMessage.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

export default UserMessage;

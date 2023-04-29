import styled from 'styled-components';

export const Wrapper = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
`;

export const Item = styled.div`
  -webkit-box-shadow: -3px -1px 10px 2px rgba(0,0,0,0.2);
  box-shadow: -3px -1px 10px 2px rgba(0,0,0,0.2);
`;

export const SearchWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export const InventorySection = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 1rem;
  min-height: 90vh;
  flex: 0.5;
  -webkit-box-shadow: -3px -1px 10px 2px rgba(0,0,0,0.2);
  box-shadow: -3px -1px 10px 2px rgba(0,0,0,0.2);
  border-radius: 10px;
  position: relative;
`;

export const EditInventorySection = styled(InventorySection)`
  height: 90vh;
`;

export const EditFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
`;

export const SubmitButtons = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  gap: 0.25rem;
  margin-top: 1.5rem;
`;

export const Spacer = styled.div`
  flex: 1;
`;

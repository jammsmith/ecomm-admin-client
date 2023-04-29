import styled from 'styled-components'

// Parent grid wrapper
export const AdminWrapper = styled.div`
  display: grid;
  height: calc(100vh - 97px);
  grid-template-columns: repeat(13, 1fr);
  grid-template-rows: 1fr 1fr;
  column-gap: 2rem;
  row-gap: 2rem;
  margin: 1rem;
`

// Grid children -->
const GridItem = styled.div`
  background-color: rgba(63, 81, 181, 1);
  border-radius: 10px;
  color: white;
  font-weight: bold;
  padding: 1rem;
`
export const OrdersWrapper = styled(GridItem)`
  grid-column: 1 / 7;
  grid-row: 1 / 3;
  display: flex;
  flex-direction: column;
`

export const InventoryWrapper = styled(GridItem)`
  grid-column: 7 / 14;
  grid-row: 1 / 2;
`

export const ArchiveWrapper = styled(GridItem)`
  grid-column: 7 / 14;
  grid-row: 2 / 3;
`

export const InventoryButtonWrapper = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 87%;
`

export const DialogContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin: 1rem;
`

export const DataLoading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`

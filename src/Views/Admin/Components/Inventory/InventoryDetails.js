import React, { useState, useEffect, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Dialog } from '@mui/material'
import _ from 'lodash'
import uniqueString from 'unique-string'

import LinkedHeading from '../../../../Components/Headings/LinkedHeading.js'
import {
  getInitialFormFields,
  validateInventoryFields,
  getTrimmedFormFields,
  getFormattedRow,
} from '../../../../helpers/inventory.js'
import {
  isObjectEmpty,
  capitaliseFirstCharacter,
} from '../../../../helpers/global.js'
import mutations from '../../../../graphql/mutations.js'
import useDDMutation from '../../../../hooks/useDDMutation.js'

import { DialogContentWrapper } from '../../admin.styled.js'

const InventoryDetails = ({
  tableSection,
  editSection,
  inventoryType,
  open,
  handleClose,
}) => {
  // Table state
  const [tableRows, setTableRows] = useState([])
  const [itemToEdit, setItemToEdit] = useState({})
  const lastSelectedItem = useRef({})

  // Form state
  const initialFields = useRef(getInitialFormFields(inventoryType))
  const [fields, setFields] = useState(initialFields.current)
  const [loading, setLoading] = useState({ type: '', state: false })
  const [message, setMessage] = useState({ type: '', text: '' })
  const [deleteRequested, setDeleteRequested] = useState(false)

  useEffect(() => console.log('fields', fields), [fields])

  const inventoryTypeId = `${inventoryType}_id`
  const selectedRowId = useRef(itemToEdit ? itemToEdit[inventoryTypeId] : null)
  const shouldCreateNewItem = !itemToEdit || isObjectEmpty(itemToEdit)
  const capitalisedInventoryType = capitaliseFirstCharacter(inventoryType)

  // Mutations
  const [upsertItem] = useDDMutation(
    mutations[`Upsert${capitalisedInventoryType}`]
  )
  const [deleteItem] = useDDMutation(
    mutations[`Delete${capitalisedInventoryType}`]
  )

  const TableComponent = tableSection
  const EditComponent = editSection

  const handleResetEditForm = () => {
    setItemToEdit({})
    setFields(initialFields.current)
    setLoading({ type: '', state: false })
    setMessage({ type: '', text: '' })
    setDeleteRequested(false)
  }

  const handleCloseAndReset = () => {
    handleResetEditForm()
    setTableRows([])
    handleClose()
  }

  const handleItemSelected = (item) => {
    setItemToEdit(item)
    lastSelectedItem.current = item
  }

  const handleUpsertItem = async () => {
    try {
      setLoading({ type: 'upsert', state: true })

      // Make sure inputted fields are valid and contain all required fields
      const { result, failedItems } = validateInventoryFields(
        fields,
        inventoryType
      )

      if (result === 'failed') {
        console.log('failedItems', failedItems)
        setMessage({
          type: 'error',
          text: 'Some form fields have failed validation, please check and resubmit',
        })
        return
      }

      // Get all fields in proper format for db
      const trimmedFields = getTrimmedFormFields(fields)

      // Build variables object for mutation
      const variables = {
        [inventoryTypeId]: shouldCreateNewItem
          ? `${inventoryType}-${await uniqueString()}`
          : itemToEdit[inventoryTypeId],
        ...trimmedFields,
      }
      if (!shouldCreateNewItem) {
        variables._id = itemToEdit._id
      }

      // Run mutation
      const { data } = await upsertItem({ variables })

      // Get the relevant fields from the upserted document and make sure form fields are the same
      const { __typename, _id, ...upsertedItem } =
        data[`upsert${capitalisedInventoryType}`]
      setFields((prev) => ({ ...prev, upsertedItem }))

      // Do some extra formatting for the table row
      const formattedRow = getFormattedRow(upsertedItem, inventoryType)

      // Replace the old table row with the updated one or add a new row
      const clonedTableRows = JSON.parse(JSON.stringify(tableRows))

      if (!shouldCreateNewItem) {
        const indexOfUpdatedRow = clonedTableRows.findIndex(
          (row) => row.id === itemToEdit[inventoryTypeId]
        )
        clonedTableRows[indexOfUpdatedRow] = formattedRow
      } else {
        clonedTableRows.push(formattedRow)
      }
      setTableRows(clonedTableRows)

      // Show a success message
      setMessage({
        type: 'success',
        text: shouldCreateNewItem
          ? `${capitalisedInventoryType} added!`
          : `${capitalisedInventoryType} updated!`,
      })
    } catch {
      setMessage({
        type: 'error',
        text: shouldCreateNewItem
          ? `Failed to create new ${inventoryType}`
          : `Failed to update ${inventoryType}`,
      })
    } finally {
      setLoading({ type: '', state: false })
    }
  }

  const handleDeleteItemRequest = () => {
    // Make sure an item is selected to delete
    if (!itemToEdit || isObjectEmpty(itemToEdit)) {
      setMessage({
        type: 'error',
        text: `Must select a ${inventoryType} to delete`,
      })
      return
    }
    // If item is category or subCategory - make sure they have no children (must delete/move children first)
    const relatedDocuments = {
      category: 'subCategories',
      subCategory: 'products',
    }
    const relatedDocumentArray = itemToEdit[relatedDocuments[inventoryType]]
    if (relatedDocumentArray && relatedDocumentArray.length) {
      setMessage({
        type: 'error',
        text: `Must move or delete all related ${
          relatedDocuments[inventoryType]
        } before deleting a ${_.kebabCase(inventoryType)}`,
      })
      return
    }
    setDeleteRequested(true)
  }

  const handleDeleteItem = async () => {
    try {
      setLoading({ type: 'delete', state: true })
      const { data } = await deleteItem({
        variables: { [inventoryTypeId]: itemToEdit[inventoryTypeId] },
      })

      const deletedItem = data[`delete${capitalisedInventoryType}`]

      if (deletedItem && deletedItem.isDeleted) {
        const updatedRows = tableRows.filter(
          (row) => row.id !== itemToEdit[inventoryTypeId]
        )
        setTableRows(updatedRows)
        setFields(initialFields.current)
      }
    } catch {
      setMessage({
        type: 'error',
        text: 'Failed to delete item',
      })
    } finally {
      setLoading({ type: '', state: false })
      setDeleteRequested(false)
    }
  }

  // Insert data into edit form on row selection / reset form on 'create new' selection
  const populateFormFields = useCallback(() => {
    const formKeys = Object.keys(initialFields.current)
    const itemFields = {}

    for (const key of formKeys) {
      itemFields[key] =
        key === 'name' ? _.startCase(itemToEdit[key]) : itemToEdit[key]
    }
    itemFields !== fields && setFields(itemFields)
  }, [itemToEdit, fields])

  useEffect(() => {
    if (
      !itemToEdit ||
      (itemToEdit && isObjectEmpty(itemToEdit) && selectedRowId.current)
    ) {
      setFields(initialFields)
      message && setMessage(null)
      deleteRequested && setDeleteRequested(false)
      selectedRowId.current = null
    } else if (
      itemToEdit &&
      itemToEdit[inventoryTypeId] &&
      itemToEdit[inventoryTypeId] !== selectedRowId.current
    ) {
      populateFormFields()
      message && setMessage(null)
      deleteRequested && setDeleteRequested(false)
      selectedRowId.current = itemToEdit[inventoryTypeId]
    }
  }, [
    itemToEdit,
    populateFormFields,
    message,
    deleteRequested,
    inventoryTypeId,
  ])

  // Make sure initial fields stays updated with selected inventory type
  useEffect(() => {
    const updatedInitialFields = getInitialFormFields(inventoryType)
    if (updatedInitialFields !== initialFields.current) {
      initialFields.current = updatedInitialFields
    }
  }, [inventoryType])

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
      <LinkedHeading
        text={
          inventoryType
            ? `Manage ${_.startCase(inventoryType)}`
            : 'Manage Inventory'
        }
        onClick={handleCloseAndReset}
        buttonText='Back to dashboard'
        color='white'
        margin='0 1rem'
      />
      <DialogContentWrapper>
        <TableComponent
          rows={tableRows}
          updateRows={setTableRows}
          selectedRow={itemToEdit}
          reset={!open}
          handleItemSelected={handleItemSelected}
          lastSelectedItem={lastSelectedItem}
        />
        <EditComponent
          fields={fields}
          updateFields={setFields}
          handleUpsertItem={handleUpsertItem}
          handleDeleteItemRequest={handleDeleteItemRequest}
          handleDeleteItem={handleDeleteItem}
          handleResetForm={handleResetEditForm}
          loading={loading}
          message={message}
          deleteRequested={deleteRequested}
          shouldCreateNewItem={shouldCreateNewItem}
        />
      </DialogContentWrapper>
    </Dialog>
  )
}

InventoryDetails.propTypes = {
  tableSection: PropTypes.elementType.isRequired,
  editSection: PropTypes.elementType.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  inventoryType: PropTypes.string,
}

export default InventoryDetails

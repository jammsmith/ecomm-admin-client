import React, { useEffect, useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useLazyQuery } from '@apollo/client'
import _ from 'lodash'
import { TextField } from '@mui/material'

import {
  SUBCATEGORY_SEARCH,
  SINGLE_SUBCATEGORY,
} from '../../../../../graphql/queries'
import PaginatedTable from '../../../../../Components/Table/PaginatedTable.js'
import ActionButton from '../../../../../Components/ActionButton.js'
import UserMessage from '../../../../../Components/UserMessage.js'
import ProgressSpinner from '../../../../../Components/ProgressSpinner.js'

import { SearchWrapper, InventorySection } from '../styledComponents.js'
import { DataLoading } from '../../../admin.styled.js'

const SubCategoryTable = ({
  rows,
  updateRows,
  selectedRow,
  reset,
  handleItemSelected,
  lastSelectedItem,
}) => {
  const [error, setError] = useState('')
  const [subCategoryLoading, setSubCategoryLoading] = useState({
    id: null,
    state: false,
  })

  const searchTerm = useRef('')

  const buildRows = (id, name, category) => ({
    id,
    name: _.startCase(name),
    category: _.startCase(category),
  })

  const [searchFunc] = useLazyQuery(SUBCATEGORY_SEARCH, {
    onCompleted: ({ subCategorySearch }) => {
      if (subCategorySearch.length) {
        const mappedRows = subCategorySearch.map((subCategory) =>
          buildRows(
            subCategory.subCategory_id,
            subCategory.name,
            subCategory.category
          )
        )
        if (rows !== mappedRows) {
          updateRows(mappedRows)
        }
      }
    },
    onError: setError,
  })

  const searchSubCategories = useCallback(searchFunc, [
    searchTerm.current,
    searchFunc,
  ])

  useEffect(() => {
    if (!rows || !rows.length || reset) {
      searchSubCategories()
    }
  }, [rows, reset, searchSubCategories])

  const [getSelectedSubCategory] = useLazyQuery(SINGLE_SUBCATEGORY, {
    onCompleted: ({ subCategory }) => {
      handleItemSelected(subCategory)
      setSubCategoryLoading({
        id: null,
        state: false,
      })
    },
    onError: (err) => {
      setError(err)
      setSubCategoryLoading({
        id: null,
        state: false,
      })
    },
  })
  const handleSubCategorySelection = (subCategoryId) => {
    setSubCategoryLoading({
      id: subCategoryId,
      state: true,
    })
    if (lastSelectedItem.current.subCategory_id === subCategoryId) {
      handleItemSelected(lastSelectedItem.current)
      setSubCategoryLoading({
        id: null,
        state: false,
      })
    } else {
      getSelectedSubCategory({ variables: { subCategoryId } })
    }
  }

  const columns = [
    { name: 'name', label: 'Name' },
    { name: 'category', label: 'Category' },
  ]

  return (
    <InventorySection>
      <SearchWrapper>
        <TextField
          label='Search a sub-category by name'
          variant='outlined'
          onChange={(e) => {
            searchTerm.current = e.target.value
          }}
          fullWidth
        />
        <ActionButton
          text='search'
          onClick={() =>
            searchSubCategories({ variables: { name: searchTerm.current } })
          }
        />
      </SearchWrapper>
      {rows && rows.length ? (
        <PaginatedTable
          name='products table'
          rows={rows}
          columns={columns}
          selectedRow={selectedRow}
          handleRowClick={handleSubCategorySelection}
          size='small'
          rowsNum={8}
          selectionLoading={subCategoryLoading}
        />
      ) : (
        <DataLoading>
          <ProgressSpinner size='3rem' colour='blue' />
        </DataLoading>
      )}
      {error && <UserMessage text={error} type='error' />}
    </InventorySection>
  )
}

SubCategoryTable.propTypes = {
  rows: PropTypes.array.isRequired,
  updateRows: PropTypes.func.isRequired,
  selectedRow: PropTypes.object,
  reset: PropTypes.bool.isRequired,
  handleItemSelected: PropTypes.func.isRequired,
  lastSelectedItem: PropTypes.object.isRequired,
}

export default SubCategoryTable

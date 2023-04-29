import React, { useEffect, useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useLazyQuery } from '@apollo/client'
import _ from 'lodash'
import { TextField } from '@mui/material'

import {
  CATEGORY_SEARCH,
  SINGLE_CATEGORY,
} from '../../../../../graphql/queries'
import PaginatedTable from '../../../../../Components/Table/PaginatedTable.js'
import ActionButton from '../../../../../Components/ActionButton.js'
import UserMessage from '../../../../../Components/UserMessage.js'
import ProgressSpinner from '../../../../../Components/ProgressSpinner.js'

import { SearchWrapper, InventorySection } from '../styledComponents.js'
import { DataLoading } from '../../../admin.styled.js'

const CategoryTable = ({
  rows,
  updateRows,
  selectedRow,
  reset,
  handleItemSelected,
  lastSelectedItem,
}) => {
  const [error, setError] = useState('')
  const [categoryLoading, setCategoryLoading] = useState({
    id: null,
    state: false,
  })

  const searchTerm = useRef('')

  const buildRows = (id, name) => ({
    id,
    name: _.startCase(name),
  })

  const [searchFunc] = useLazyQuery(CATEGORY_SEARCH, {
    onCompleted: ({ categorySearch }) => {
      if (categorySearch.length) {
        const mappedRows = categorySearch.map((category) =>
          buildRows(category.category_id, category.name)
        )
        if (rows !== mappedRows) {
          updateRows(mappedRows)
        }
      }
    },
    onError: setError,
  })

  const searchCategories = useCallback(searchFunc, [
    searchTerm.current,
    searchFunc,
  ])

  useEffect(() => {
    if (!rows || !rows.length || reset) {
      searchCategories()
    }
  }, [rows, reset, searchCategories])

  const [getSelectedCategory] = useLazyQuery(SINGLE_CATEGORY, {
    onCompleted: ({ category }) => {
      handleItemSelected(category)
      setCategoryLoading({
        id: null,
        state: false,
      })
    },
    onError: (err) => {
      setError(err)
      setCategoryLoading({
        id: null,
        state: false,
      })
    },
  })
  const handleCategorySelection = (categoryId) => {
    setCategoryLoading({
      id: categoryId,
      state: true,
    })
    if (lastSelectedItem.current.category_id === categoryId) {
      handleItemSelected(lastSelectedItem.current)
      setCategoryLoading({
        id: null,
        state: false,
      })
    } else {
      getSelectedCategory({ variables: { categoryId } })
    }
  }

  const columns = [{ name: 'name', label: 'Name' }]

  return (
    <InventorySection>
      <SearchWrapper>
        <TextField
          label='Search a category by name'
          variant='outlined'
          onChange={(e) => {
            searchTerm.current = e.target.value
          }}
          fullWidth
        />
        <ActionButton
          text='search'
          onClick={() =>
            searchCategories({ variables: { name: searchTerm.current } })
          }
        />
      </SearchWrapper>
      {rows && rows.length ? (
        <PaginatedTable
          name='products table'
          rows={rows}
          columns={columns}
          selectedRow={selectedRow}
          handleRowClick={handleCategorySelection}
          size='small'
          rowsNum={8}
          selectionLoading={categoryLoading}
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

CategoryTable.propTypes = {
  rows: PropTypes.array.isRequired,
  updateRows: PropTypes.func.isRequired,
  selectedRow: PropTypes.object,
  reset: PropTypes.bool.isRequired,
  handleItemSelected: PropTypes.func.isRequired,
  lastSelectedItem: PropTypes.object.isRequired,
}

export default CategoryTable

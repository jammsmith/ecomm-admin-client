import React, { useState } from 'react'

import Heading from '../../../../Components/Headings/Heading.js'
import BigButton from './BigButton.js'
import InventoryDetails from './InventoryDetails.js'
import CategoryTable from './Categories/CategoryTable.js'
import CategoryEdit from './Categories/CategoryEdit.js'
import SubCategoryTable from './SubCategories/SubCategoryTable.js'
import SubCategoryEdit from './SubCategories/SubCategoryEdit.js'
import ProductTable from './Products/ProductTable.js'
import ProductEdit from './Products/ProductEdit.js'

// Styled components
import { InventoryWrapper, InventoryButtonWrapper } from '../../admin.styled.js'

const Inventory = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedType, setSelectedType] = useState('product')

  const handleSelection = (type) => {
    setSelectedType(type)
    setDialogOpen(true)
  }

  const components = {
    category: { edit: CategoryEdit, table: CategoryTable },
    subCategory: { edit: SubCategoryEdit, table: SubCategoryTable },
    product: { edit: ProductEdit, table: ProductTable },
  }

  return (
    <InventoryWrapper>
      <Heading text='Inventory' size='small' color='white' />
      <InventoryDetails
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        inventoryType={selectedType}
        tableSection={
          selectedType ? components[selectedType].table : ProductTable
        }
        editSection={selectedType ? components[selectedType].edit : ProductEdit}
      />
      <InventoryButtonWrapper>
        <BigButton
          type='products'
          handleSelection={() => handleSelection('product')}
        />
        <BigButton
          type='subcategories'
          handleSelection={() => handleSelection('subCategory')}
        />
        <BigButton
          type='categories'
          handleSelection={() => handleSelection('category')}
        />
      </InventoryButtonWrapper>
    </InventoryWrapper>
  )
}

export default Inventory

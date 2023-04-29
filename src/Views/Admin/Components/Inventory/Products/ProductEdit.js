import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client'
import { TextField, InputAdornment } from '@mui/material'
import _ from 'lodash'

import ActionButton from '../../../../../Components/ActionButton.js'
import ProgressSpinner from '../../../../../Components/ProgressSpinner.js'
import Heading from '../../../../../Components/Headings/Heading.js'
import ImageUploader from '../../../../../Components/ImageUploader.js'
import RowGroup from '../../../../../Components/Forms/RowGroup.js'
import SelectInput from '../../../../../Components/Forms/SelectInput.js'
import UserMessage from '../../../../../Components/UserMessage.js'
import { ALL_CATEGORIES_AND_SUBCATEGORIES } from '../../../../../graphql/queries.js'
import { HeadingWrapper } from '../../../../../Components/Headings/LinkedHeading.js'

import {
  EditInventorySection,
  EditFormContainer,
  SubmitButtons,
  Spacer,
} from '../styledComponents.js'
import { DataLoading } from '../../../admin.styled.js'

const ProductEdit = ({
  fields,
  updateFields,
  handleUpsertItem,
  handleDeleteItemRequest,
  handleDeleteItem,
  handleResetForm,
  loading,
  message,
  deleteRequested,
  shouldCreateNewItem,
}) => {
  const { data } = useQuery(ALL_CATEGORIES_AND_SUBCATEGORIES)

  const hasSelectedCategory = fields.category && fields.category !== ''

  const handleFormChange = (e) => {
    updateFields((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleImageChange = (imageUrl, action) => {
    if (!imageUrl || typeof imageUrl !== 'string') return

    let updatedImages = []
    if (action === 'upload') {
      updatedImages = [...fields.images, imageUrl]
    } else if (action === 'delete') {
      updatedImages = fields.images.filter((image) => image !== imageUrl)
    } else {
      throw new Error(
        `Unknown action of '${action}' supplied to handleImageChange`
      )
    }
    updateFields((prev) => ({ ...prev, images: updatedImages }))
  }

  const getSubCategoryDetails = (selectedCategory, allCategories) => {
    if (
      !selectedCategory ||
      selectedCategory === '' ||
      !allCategories ||
      !allCategories.length
    ) {
      return undefined
    }
    const selected = allCategories.find(
      (category) => category.name === selectedCategory
    )

    return selected.subCategories.map((subCat) => ({
      id: subCat.subCategory_id,
      name: _.startCase(subCat.name),
      value: subCat.name,
    }))
  }

  return (
    <EditInventorySection>
      <HeadingWrapper subHeading>
        <div style={{ flex: 1 }}>
          <Heading
            text={shouldCreateNewItem ? 'Create new product' : 'Edit product'}
            noSpace
            size='small'
          />
        </div>
        {!shouldCreateNewItem && (
          <ActionButton text='create new' onClick={handleResetForm} />
        )}
      </HeadingWrapper>
      {data && data.categories ? (
        <>
          <EditFormContainer>
            <TextField
              name='name'
              label='Name'
              value={fields.name}
              variant='outlined'
              onChange={handleFormChange}
              fullWidth
              required
            />
            <TextField
              name='description'
              label='Description'
              value={fields.description}
              variant='outlined'
              onChange={handleFormChange}
              fullWidth
              multiline
              rows={5}
              required
            />
            <RowGroup>
              <SelectInput
                name='category'
                label='Category*'
                value={fields.category}
                variant='outlined'
                handleChange={handleFormChange}
                required
                options={data.categories.map((category) => ({
                  name: _.startCase(category.name),
                  value: category.name,
                }))}
              />
              <SelectInput
                name='subCategory'
                label='Sub Category*'
                value={fields.subCategory}
                variant='outlined'
                handleChange={handleFormChange}
                required
                disabled={!hasSelectedCategory}
                options={
                  hasSelectedCategory
                    ? getSubCategoryDetails(fields.category, data.categories)
                    : []
                }
              />
              <SelectInput
                name='deliveryLevel'
                label='Delivery Level*'
                value={fields.deliveryLevel}
                variant='outlined'
                handleChange={handleFormChange}
                required
                options={[
                  { name: 'Level 1', value: 1 },
                  { name: 'Level 2', value: 2 },
                  { name: 'Level 3', value: 3 },
                ]}
              />
            </RowGroup>
            <RowGroup>
              <TextField
                name='numInStock'
                label='Quantity'
                value={fields.numInStock}
                variant='outlined'
                onChange={handleFormChange}
                required
                fullWidth
              />
              <TextField
                name='priceGBP'
                label='Price GBP'
                value={fields.priceGBP}
                variant='outlined'
                onChange={handleFormChange}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>£</InputAdornment>
                  ),
                }}
              />
              <TextField
                name='priceUSD'
                label='Price USD'
                value={fields.priceUSD}
                variant='outlined'
                onChange={handleFormChange}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>$</InputAdornment>
                  ),
                }}
              />
              <TextField
                name='priceEUR'
                label='Price EUR'
                value={fields.priceEUR}
                variant='outlined'
                onChange={handleFormChange}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>€</InputAdornment>
                  ),
                }}
              />
            </RowGroup>
            <ImageUploader
              onUpload={(imageUrl) => handleImageChange(imageUrl, 'upload')}
              onDelete={(imageUrl) => handleImageChange(imageUrl, 'delete')}
              images={fields.images}
              placeholderText='No images yet! You must upload at least one image per product'
              reset={message && message.type === 'success'}
            />
          </EditFormContainer>
          <Spacer />
          <SubmitButtons>
            <ActionButton
              text='save'
              onClick={handleUpsertItem}
              loading={loading.state === true && loading.type === 'upsert'}
              customStyles={{
                backgroundColor: 'rgba(63, 81, 181, 1)',
                borderColor: '#fff',
                color: '#fff',
                width: '6rem',
                height: '2.5rem',
              }}
            />
            {!shouldCreateNewItem && (
              <ActionButton
                text={deleteRequested ? 'confirm deletion' : 'delete product'}
                onClick={
                  deleteRequested ? handleDeleteItem : handleDeleteItemRequest
                }
                loading={loading.state === true && loading.type === 'delete'}
                customStyles={{
                  backgroundColor: '#fff',
                  borderColor: 'red',
                  color: 'red',
                  height: '2.5rem',
                }}
              />
            )}
            {message && message.type && (
              <UserMessage text={message.text} type={message.type} />
            )}
          </SubmitButtons>
        </>
      ) : (
        <DataLoading>
          <ProgressSpinner size='3rem' colour='blue' />
        </DataLoading>
      )}
    </EditInventorySection>
  )
}

ProductEdit.propTypes = {
  fields: PropTypes.object.isRequired,
  updateFields: PropTypes.func.isRequired,
  handleUpsertItem: PropTypes.func.isRequired,
  handleDeleteItemRequest: PropTypes.func.isRequired,
  handleDeleteItem: PropTypes.func.isRequired,
  handleResetForm: PropTypes.func.isRequired,
  loading: PropTypes.object.isRequired,
  message: PropTypes.object,
  deleteRequested: PropTypes.bool.isRequired,
  shouldCreateNewItem: PropTypes.bool.isRequired,
}

export default ProductEdit

import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client'
import { TextField } from '@mui/material'
import _ from 'lodash'

import ActionButton from '../../../../../Components/ActionButton.js'
import ProgressSpinner from '../../../../../Components/ProgressSpinner.js'
import Heading from '../../../../../Components/Headings/Heading.js'
import ImageUploader from '../../../../../Components/ImageUploader.js'
import RowGroup from '../../../../../Components/Forms/RowGroup.js'
import SelectInput from '../../../../../Components/Forms/SelectInput.js'
import UserMessage from '../../../../../Components/UserMessage.js'
import { ALL_CATEGORIES } from '../../../../../graphql/queries.js'
import { HeadingWrapper } from '../../../../../Components/Headings/LinkedHeading.js'

import {
  EditInventorySection,
  EditFormContainer,
  SubmitButtons,
  Spacer,
} from '../styledComponents.js'
import { DataLoading } from '../../../admin.styled.js'

const SubCategoryEdit = ({
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
  const { data } = useQuery(ALL_CATEGORIES)

  const handleFormChange = (e) => {
    updateFields((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleImageChange = (imageUrl, action) => {
    if (!imageUrl || typeof imageUrl !== 'string') return

    let updatedImage
    if (action === 'upload') {
      updatedImage = imageUrl
    } else if (action === 'delete') {
      updatedImage = ''
    }
    updateFields((prev) => ({ ...prev, image: updatedImage }))
  }

  return (
    <EditInventorySection>
      <HeadingWrapper subHeading>
        <div style={{ flex: 1 }}>
          <Heading
            text={
              shouldCreateNewItem
                ? 'Create new sub category'
                : 'Edit sub category'
            }
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
            </RowGroup>
            <ImageUploader
              onUpload={(imageUrl) => handleImageChange(imageUrl, 'upload')}
              onDelete={(imageUrl) => handleImageChange(imageUrl, 'delete')}
              images={fields.image ? [fields.image] : null}
              placeholderText='No images yet! You must upload an image for each sub-category'
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
                text={
                  deleteRequested ? 'confirm deletion' : 'delete subcategory'
                }
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

SubCategoryEdit.propTypes = {
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

export default SubCategoryEdit

import React, { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import S3 from 'react-aws-s3'
import styled from 'styled-components'
import { TiDeleteOutline } from 'react-icons/ti'
import uniqueString from 'unique-string'

import ActionButton from './ActionButton.js'
import FileBrowseButton from './FileBrowseButton.js'
import UserMessage from './UserMessage.js'
import Heading from './Headings/Heading.js'
import { RealmAppContext } from '../realmApolloClient.js'

// Styled components
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0;
  gap: 0.25rem;
`
const UploadWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 0.25rem;
`
const MessageWrapper = styled.div`
  align-self: flex-end;
`
const SelectedFile = styled.p`
  margin: 0;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5rem;
  height: 1.5rem;
  width: 18rem;
  white-space: nowrap;
  align-self: flex-end;
`

// All images
const ThumbnailsWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
  flex-wrap: wrap;
  width: 100%;
`

// One image
const ThumbnailWrapper = styled.div`
  position: relative;
`
const ThumbnailImage = styled.img`
  border-radius: 4px;
  height: 50px;
  width: auto;
`
const ThumbnailDeleteIcon = styled(TiDeleteOutline)`
  position: absolute;
  top: -2px;
  right: -2px;
  color: grey;
  :hover {
    color: black;
    cursor: pointer;
  }
`
const ImagePlaceholder = styled.div`
  height: 50px;
`

const ImageUploader = ({
  onUpload,
  onDelete,
  images,
  placeholderText,
  reset,
}) => {
  const app = useContext(RealmAppContext)

  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleFileInput = (e) => {
    setMessage(null)
    setSelectedFile(e.target.files[0])
  }

  const handleUpload = async (e, file) => {
    e.preventDefault()
    setLoading(true)

    try {
      const ReactS3Client = new S3(
        await app.currentUser.functions.helper_getS3Config()
      )
      const imageUpload = await ReactS3Client.uploadFile(file)

      onUpload(imageUpload.location)
      setMessage({
        type: 'success',
        text: 'Image upload successful!',
      })
      setSelectedFile(null)
    } catch (err) {
      console.error(err)
      setMessage({
        type: 'error',
        text: 'Upload failed. Please try again or contact support if the problem persists',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (e, imageUrl) => {
    e.preventDefault()
    setMessage(null)
    onDelete(imageUrl)
  }

  useEffect(() => {
    if (reset) {
      message && message.type && setMessage(null)
    }
  }, [reset, message])

  return (
    <Wrapper>
      <Heading text='Upload an image' size='x-small' />
      <UploadWrapper>
        <FileBrowseButton onChange={handleFileInput} />
        <ActionButton
          text='Upload'
          onClick={(e) => handleUpload(e, selectedFile)}
          disabled={!selectedFile}
          loading={loading}
          customStyles={{
            width: '6rem',
            height: '2.5rem',
          }}
        />
        {selectedFile && <SelectedFile>{selectedFile.name}</SelectedFile>}
        {message && (
          <MessageWrapper>
            <UserMessage type={message.type} text={message.text} />
          </MessageWrapper>
        )}
      </UploadWrapper>
      <ThumbnailsWrapper>
        {images && images.length ? (
          images.map((imageUrl) => (
            <ThumbnailWrapper key={uniqueString()}>
              <ThumbnailDeleteIcon
                size='1.5rem'
                onClick={(e) => handleDelete(e, imageUrl)}
              />
              <ThumbnailImage src={imageUrl} alt='Thumbnail image' />
            </ThumbnailWrapper>
          ))
        ) : (
          <ImagePlaceholder>
            {placeholderText || 'No images yet!'}
          </ImagePlaceholder>
        )}
      </ThumbnailsWrapper>
    </Wrapper>
  )
}

ImageUploader.propTypes = {
  onUpload: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  images: PropTypes.array,
  placeholderText: PropTypes.string,
  reset: PropTypes.bool,
}

export default ImageUploader

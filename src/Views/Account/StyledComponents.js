import styled from 'styled-components'
import ResponsiveTileWrapper from '../../Components/Tiles/ResponsiveTileWrapper.js'

export const Wrapper = styled(ResponsiveTileWrapper)`
  height: auto;
  -webkit-box-shadow: none;
  box-shadow: none;
  width: ${(props) => props.width && props.width};
`

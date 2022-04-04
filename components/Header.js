import React from 'react'
import tw from "tailwind-styled-components"
import ToggleIcon from '../components/ToggleIcon'

const Header = () => {
  return (
    <Wrapper>
            <ToggleIcon/>
    </Wrapper>    
  )
}



export default Header

const Wrapper = tw.div`
    flex
    w-full
    h-14
    bg-rose-500
    border-bg
    border-rose-800
    shadow-md
    fixed
    top-0
    left-0
`

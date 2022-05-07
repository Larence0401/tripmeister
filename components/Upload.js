import React from 'react'
import tw from "tailwind-styled-components";

const Upload = () => {
  return (
    <Wrapper>Upload</Wrapper>
  )
}

export default Upload

const Wrapper = tw.div`
    rounded-lg
    shadow-md
    box-border
    flex
    flex-col
    items-start
    bg-white
    m-8
    mx-0
    mb-4
    p-8
    h-auto
    w-full`;
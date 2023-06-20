import React from 'react'

import { ThreeDots } from  'react-loader-spinner'

const Loader = () => {
  return (
    <ThreeDots 
    height="26" 
    width="26" 
    radius="9"
    color="#000" 
    ariaLabel="three-dots-loading"
    wrapperStyle={{}}
    wrapperClass=""
    visible={true}
    />
  )
}

export default Loader
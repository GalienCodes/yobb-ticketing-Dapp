import React from 'react'

const Footer = () => {
  const date = new Date().getFullYear();
  return (
    <div className='max-w-4xl mx-auto fotter_d pt-4 sm:mb-8 h-20 sm:h-0 text-white font-medium'> 
      <div className="mx-4 sm:mx-6 lg:mx-0  flex flex-col md:flex-row justify-center md:justify-between">
          <h2 className='text-center sm:text-center'> &copy; {date} Yob  </h2>
          <a href="https://www.linkedin.com/in/muhindo-galien/" target='_blank'>
            <h4 className='text-center cursor-pointer '>Designed By Galien.eth </h4>
          </a>
      </div>
    </div>
  )
}

export default Footer
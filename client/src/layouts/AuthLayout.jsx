import React from 'react'
// import authImage from '../assets/auth-image.jpg'
import authImage from '../assets/auth-image-00.jpg'

export default function AuthLayout({ children }) {
  return (
    <div className='flex'>
      <div className='w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12'>
        <h2 className='text-lg font-medium text-black'>Taskpad</h2>
        {children}
      </div>

      <div className='hidden md:flex w-[40vw] h-screen items-center justify-center bg-[url(/auth-image-00.jpg)] bg-cover bg-no-repeat bg-center overflow-hidden p-8'>
        {/* <img src={authImage} alt="auth image" className='w-64 lg:w-[90%]' /> */}
      </div>
    </div>
  )
}

import Navbar from '@/components/Navbar'
import LoginPageComponent from '@/lib/components/auth/login-page'
import React from 'react'

function LoginPage() {
  return (
    <>
    <Navbar />
    <LoginPageComponent/>
    </>
  )
}

export default LoginPage
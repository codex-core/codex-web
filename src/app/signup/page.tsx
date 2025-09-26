import SignUpPage from '@/lib/components/auth/sign-up-page'
import React, { Suspense } from 'react'

function SignUp() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpPage/>
    </Suspense>
  )
}

export default SignUp
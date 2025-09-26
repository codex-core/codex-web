import Navbar from '@/components/Navbar'
import SignUpPage from '@/lib/components/auth/sign-up-page'
import React, { Suspense } from 'react'

function SignUp() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16 flex flex-col lg:flex-row items-center justify-center gap-12">
        {/* Left: Consultant-focused copy */}
        <div className="max-w-xl w-full mb-12 lg:mb-0">
          <h1 className="text-4xl font-bold mb-6 text-blue-700 dark:text-blue-400">Become a Codex Consultant</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Join our elite network of cloud, AI, and full-stack experts. Work on high-impact projects, collaborate with top companies, and grow your career with flexible, rewarding opportunities.
          </p>
          <ul className="space-y-4 text-base text-muted-foreground">
            <li>✔️ Access exclusive consulting projects</li>
            <li>✔️ Flexible remote and on-site roles</li>
            <li>✔️ Competitive compensation</li>
            <li>✔️ Join a community of top-tier professionals</li>
            <li>✔️ No password required—secure magic link sign in</li>
          </ul>
        </div>
        {/* Right: Sign up form */}
        <div className="w-full max-w-md">
          <Suspense fallback={<div>Loading...</div>}>
            <SignUpPage />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default SignUp
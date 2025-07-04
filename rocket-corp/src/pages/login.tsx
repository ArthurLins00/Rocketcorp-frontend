"use client"

import { LoginForm } from "../components/LoginForm"
import { useLoginController } from "../controllers/loginController"

export default function LoginPage() {
  const controller = useLoginController()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          {/* <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div> */}
          <h2 className="text-3xl font-bold text-gray-900">Bem vindo de volta!</h2>
          <p className="mt-2 text-sm text-gray-600">Por favor, entre na sua conta</p>
        </div>

        {/* Form */}
        <LoginForm {...controller} />

        {/* Demo credentials */}
        {/* <div className="text-center">
          <p className="text-xs text-gray-500">Demo credentials: demo@example.com / password</p>
        </div> */}
      </div>
    </div>
  )
}

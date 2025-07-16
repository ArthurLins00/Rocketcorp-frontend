"use client";

import { LoginForm } from "../components/LoginForm";
import { useLoginController } from "../controllers/loginController";

export default function LoginPage() {
  const controller = useLoginController();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F1F1] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white/90 shadow-2xl rounded-2xl p-10 border border-gray-200">
        {/* Logo/Header */}
        <div className="text-center mb-6">
          <div className="mx-auto h-16 w-16 bg-[#08605F] rounded-full flex items-center justify-center mb-4 shadow-lg">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Bem-vindo de volta!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Entre com seu e-mail institucional
          </p>
        </div>
        {/* Form */}
        <LoginForm {...controller} />
        {/* Demo credentials or info */}
        {/* <div className="text-center mt-4">
          <p className="text-xs text-gray-500">Demo: demo@example.com / password</p>
        </div> */}
      </div>
    </div>
  );
}

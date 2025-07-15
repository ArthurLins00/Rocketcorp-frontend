import React from "react";

export default function NotAuthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <h1 className="text-3xl font-bold mb-4 text-red-600">Acesso não autorizado</h1>
      <p className="text-lg text-gray-700 mb-8">Você não tem permissão para acessar esta página.</p>
      <a href="/dashboard" className="px-4 py-2 rounded bg-[#08605F] text-white hover:bg-[#0a7c7b]">Voltar para o início</a>
    </div>
  );
}

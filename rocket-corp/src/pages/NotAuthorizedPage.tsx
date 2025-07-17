import { useNavigate } from "react-router-dom";

export default function NotAuthorizedPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <h1 className="text-3xl font-bold mb-4 text-[#08605F]">Acesso não autorizado</h1>
      <p className="text-lg text-gray-700 mb-8">Você não tem permissão para acessar esta página.</p>
      <button
        className="px-4 py-2 rounded bg-[#08605F] text-white hover:bg-[#0a7c7b]"
        onClick={() => navigate(-1)}
      >
        Voltar
      </button>
    </div>
  );
}

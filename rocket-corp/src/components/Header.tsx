import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";
import ErrorModal from "./ErrorModal";
import SuccessModal from "./SuccessModal";
import { enviarTodasAvaliacoes } from "../services/avaliacaoService";
import { getUsuarioLogado } from '../utils/auth';

export default function Header() {
  const idCiclo = "2025.2"; // mockado
  const location = useLocation();
  const navigate = useNavigate();
  const isAvaliacaoPage = location.pathname.startsWith("/avaliacao");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getPageTitle = (pathname: string) => {
    if (pathname.startsWith("/avaliacao")) return "Avaliação de Desempenho";
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname === "/employee-dashboard") return "Dashboard do Funcionário";
    if (pathname === "/comite-dashboard") return "Dashboard do Comitê";
    if (pathname === "/rh-dashboard") return "Dashboard do RH";
    if (pathname === "/gestor-dashboard") return "Dashboard do Gestor";
    if (pathname === "/cycle-evaluation") return "Avaliação de Ciclo";
    if (pathname.startsWith("/evolution")) return "Evolução";
    if (pathname === "/comite/equalizacoes") return "Equalizações";
    if (pathname === "/gestor/collaborators") return "Colaboradores";
    if (pathname.startsWith("/gestor/collaborator/")) return "Detalhes do Colaborador";
    return "Página Principal";
  };

  const handleConcluirEEnviar = () => {
    setShowConfirmModal(true);
  };

  const handleEnviarTudo = async () => {
    setIsLoading(true);
    setShowConfirmModal(false);
    try {
      console.log('🚀 Iniciando envio unificado...');
      // 🔄 Enviar todas as avaliações (autoavaliação, 360, mentoring)
      const avaliacoesResult = await enviarTodasAvaliacoes();
      console.log('✅ Avaliações enviadas:', avaliacoesResult);
      // 🎉 Sucesso total
      setShowSuccessModal(true);
    } catch (error) {
      console.error('❌ Erro no envio:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Erro desconhecido ao enviar avaliações');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para redirecionar para o dashboard correto
  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    const usuario = getUsuarioLogado();
    const role = usuario?.role;
    let dashboardPath = "/dashboard";
    if (role === "colaborador") dashboardPath = "/employee-dashboard";
    else if (role === "gestor") dashboardPath = "/gestor-dashboard";
    else if (role === "comite") dashboardPath = "/comite-dashboard";
    else if (role === "rh") dashboardPath = "/rh-dashboard";
    navigate(dashboardPath);
  };

  return (
    <header className="bg-white border-b px-6 py-4 shadow-sm">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">
          {getPageTitle(location.pathname)}
        </h1>
        {isAvaliacaoPage && (
          <>
            <button
              onClick={handleConcluirEEnviar}
              disabled={isLoading}
              className={`px-4 py-2 rounded transition ${
                isLoading 
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {isLoading ? 'Enviando...' : 'Concluir e enviar'}
            </button>
            <ConfirmModal
              isOpen={showConfirmModal}
              onClose={() => setShowConfirmModal(false)}
              onConfirm={handleEnviarTudo}
              title="Você está quase lá!"
              description="Você tem certeza que deseja enviar todas as suas avaliações? Isso inclui autoavaliações, avaliações 360, mentoring e referências. Após isso, elas não poderão ser editadas."
            />
            <ErrorModal
              isOpen={showErrorModal}
              onClose={() => setShowErrorModal(false)}
              message={errorMessage}
            />
            <SuccessModal
              isOpen={showSuccessModal}
              onClose={handleSuccessClose}
              title="Sucesso!"
              description="Todas as suas avaliações foram enviadas com sucesso! Obrigado por participar do processo de avaliação."
            />
          </>
        )}
      </div>
    </header>
  );
}

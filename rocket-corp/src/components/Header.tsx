import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";
import ErrorModal from "./ErrorModal";
import SuccessModal from "./SuccessModal";
import { enviarTodasAvaliacoes } from "../services/avaliacaoService";
import { getUsuarioLogado, authenticatedFetch } from '../utils/auth';
import { useCriteriaSave } from "../pages/rh/CriteriaManagementPage";

export default function Header() {
  const [cicleName, setCicleName] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCicleName() {
      const response = await authenticatedFetch("/cicle/current");
      if (response && response.ok) {
        const data = await response.json();
        setCicleName(data.name || "");
      }
    }
    fetchCicleName();
  }, []);
  const { onSave } = useCriteriaSave ? useCriteriaSave() : { onSave: undefined };
  const isCriteriaPage = location.pathname === "/rh/criterios";
  const isCollaboratorsListPage =
    location.pathname === "/rh/collaborators" ||
    location.pathname === "/gestor/collaborators" ||
    /\/gestor\/[^/]+\/collaborators/.test(location.pathname) ||
    location.pathname === "/collaborator-list" ||
    location.pathname.includes("/collaborator-list");
  const [isSaving, setIsSaving] = useState(false);
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
    if (pathname === "/rh/ImportHistoryPage") return "Importar Histórico";
    if (pathname === "/gestor/brutal-facts") return "Brutal Facts";
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
        <p className="text-gray-800 font-bold">
          {isCollaboratorsListPage
            ? "Colaboradores"
            : isCriteriaPage
            ? "Critérios de Avaliação"
            : location.pathname.startsWith("/gestor") || location.pathname === "/gestor" || location.pathname === "/rh/ImportHistoryPage" || location.pathname === "/evolution-page" || location.pathname === "/comite/equalizacoes"
            ? getPageTitle(location.pathname)
            : `Ciclo ${cicleName || "..."}`}
        </p>
        {isCriteriaPage && (
          <button
            onClick={() => {
              setIsSaving(true);
              onSave && onSave();
              setTimeout(() => setIsSaving(false), 2000); // Simula loading, ajuste conforme integração
            }}
            disabled={isSaving}
            className={`px-4 py-2 rounded transition ${
              isSaving
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-[#08605F] text-white hover:bg-[#054845]'
            }`}
          >
            {isSaving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        )}
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

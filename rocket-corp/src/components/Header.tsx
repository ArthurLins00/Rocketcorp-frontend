import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";
import ErrorModal from "./ErrorModal";
import SuccessModal from "./SuccessModal";
import { enviarTodasAvaliacoes } from "../services/avaliacaoService";
import { getUsuarioLogado, authenticatedFetch } from "../utils/auth";
import { useCriteriaSave } from "../contexts/CriteriaSaveContext";

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

  const { onSave } = useCriteriaSave();

  console.log("🔍 [Header] onSave function available:", !!onSave);

  const isCriteriaPage = location.pathname === "/rh/criterios";
  const isCollaboratorsListPage =
    location.pathname === "/rh/colaboradores" ||
    location.pathname === "/gestor/colaboradores" ||
    /\/gestor\/[^/]+\/collaborators/.test(location.pathname) ||
    location.pathname === "/collaborator-list" ||
    location.pathname.includes("/colaboradores");
  const [isSaving, setIsSaving] = useState(false);
  const isAvaliacaoPage = location.pathname.startsWith(
    "/colaborador/avaliacao"
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getPageTitle = (pathname: string) => {
    if (pathname.startsWith("/colaborador/avaliacao"))
      return "Avaliação de Desempenho";
    if (pathname === "/colaborador/dashboard")
      return "Dashboard do Funcionário";
    if (pathname === "/comite/dashboard") return "Dashboard do Comitê";
    if (pathname === "/rh/dashboard") return "Dashboard do RH";
    if (pathname === "/gestor/dashboard") return "Dashboard do Gestor";
    if (pathname === "/colaborador/evolution") return "Evolução";
    if (pathname === "/comite/equalizacoes") return "Equalizações";
    if (pathname.includes("/gestor") && pathname.includes("/colaboradores"))
      return "Colaboradores";
    if (pathname.startsWith("/gestor/colaborador/"))
      return "Detalhes do Colaborador";
    if (pathname === "/rh/import-history") return "Importar Histórico";
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
      console.log("🚀 Iniciando envio unificado...");
      // 🔄 Enviar todas as avaliações (autoavaliação, 360, mentoring)
      const avaliacoesResult = await enviarTodasAvaliacoes();
      console.log("✅ Avaliações enviadas:", avaliacoesResult);
      // 🎉 Sucesso total
      setShowSuccessModal(true);
    } catch (error) {
      console.error("❌ Erro no envio:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao enviar avaliações"
      );
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para redirecionar para o dashboard correto
  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    const usuario = getUsuarioLogado(); // This gets the user object from localStorage
    const roles = Array.isArray(usuario?.role)
      ? usuario.role
      : [usuario?.role].filter(Boolean);
    let dashboardPath = "/dashboard";
    if (roles.includes("colaborador")) dashboardPath = "/colaborador/dashboard";
    else if (roles.includes("gestor")) dashboardPath = "/gestor/dashboard";
    else if (roles.includes("comite")) dashboardPath = "/comite/dashboard";
    else if (roles.includes("rh")) dashboardPath = "/rh/dashboard";
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
            : location.pathname.startsWith("/gestor") ||
              location.pathname === "/gestor" ||
              location.pathname === "/rh/import-history" ||
              location.pathname === "/colaborador/evolution" ||
              location.pathname === "/comite/equalizacoes"
            ? getPageTitle(location.pathname)
            : `Ciclo ${cicleName || "..."}`}
        </p>
        {isCriteriaPage && (
          <button
            onClick={() => {
              console.log("🔘 [Header] Save button clicked");
              console.log("🔍 [Header] onSave function:", onSave);

              setIsSaving(true);

              if (onSave) {
                console.log("✅ [Header] Calling onSave function");
                onSave();
              } else {
                console.warn("⚠️ [Header] onSave function not available");
              }

              setTimeout(() => setIsSaving(false), 2000); // Simula loading, ajuste conforme integração
            }}
            disabled={isSaving}
            className={`px-4 py-2 rounded transition ${
              isSaving
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-[#08605F] text-white hover:bg-[#054845]"
            }`}
          >
            {isSaving ? "Salvando..." : "Salvar alterações"}
          </button>
        )}
        {isAvaliacaoPage && (
          <>
            <button
              onClick={handleConcluirEEnviar}
              disabled={isLoading}
              className={`px-4 py-2 rounded transition ${
                isLoading
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {isLoading ? "Enviando..." : "Concluir e enviar"}
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

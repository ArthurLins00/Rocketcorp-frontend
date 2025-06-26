import { useLocation } from "react-router-dom";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import ErrorModal from "./ErrorModal";

import {
  criteriosAutoavaliacao,
  validarFormulario,
  validarAvaliacao360,
  validarMentoring,
  validarReferencias,
} from "../utils/validations";

import { mensagensErro } from "../utils/errorMessages";
import { enviarAvaliacao } from "../services/avaliacaoService";

export default function Header() {
  const location = useLocation();
  const isAvaliacaoPage = location.pathname.startsWith("/avaliacao");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getPageTitle = (pathname: string) => {
    if (pathname.startsWith("/avaliacao")) {
      return "Avaliação de Ciclo";
    }
    if (pathname === "/dashboard") {
      return "Dashboard";
    }
    if (pathname === "/employee-dashboard") {
      return "Dashboard do Colaborador";
    }
    if (pathname === "/comite-dashboard") {
      return "Dashboard do Comitê";
    }
    if (pathname === "/rh-dashboard") {
      return "Dashboard do RH";
    }
    if (pathname === "/gestor-dashboard") {
      return "Dashboard do Gestor";
    }
    if (pathname === "/cycle-evaluation") {
      return "Avaliação de Ciclo";
    }
    if (pathname.startsWith("/evolution")) {
      return "Evolução";
    }
    return "Página Principal";
  };

  const pageTitle = getPageTitle(location.pathname);

  const handleConcluirEEnviar = () => {
    const autoavaliacao = JSON.parse(
      localStorage.getItem("autoavaliacao") || "{}"
    );
    const avaliacao360 = JSON.parse(
      localStorage.getItem("avaliacao360") || "{}"
    );
    const mentoring = JSON.parse(localStorage.getItem("mentoring") || "{}");
    const referencias = JSON.parse(localStorage.getItem("referencias") || "{}");

    if (!validarFormulario(autoavaliacao, criteriosAutoavaliacao)) {
      setErrorMessage(mensagensErro.autoavaliacaoIncompleta);
      setShowErrorModal(true);
      return;
    }

    if (!validarAvaliacao360(avaliacao360)) {
      setErrorMessage(mensagensErro.avaliacao360Incompleta);
      setShowErrorModal(true);
      return;
    }

    if (!validarMentoring(mentoring)) {
      setErrorMessage(mensagensErro.mentoringIncompleto);
      setShowErrorModal(true);
      return;
    }

    if (!validarReferencias(referencias)) {
      setErrorMessage(mensagensErro.referenciasIncompletas);
      setShowErrorModal(true);
      return;
    }

    setShowConfirmModal(true);
  };

  const handleEnviarAvaliacao = () => {
    const dados = {
      autoavaliacao: JSON.parse(localStorage.getItem("autoavaliacao") || "{}"),
      avaliacao360: JSON.parse(localStorage.getItem("avaliacao360") || "{}"),
      mentoring: JSON.parse(localStorage.getItem("mentoring") || "{}"),
      referencias: JSON.parse(localStorage.getItem("referencias") || "{}"),
    };

    enviarAvaliacao(dados)
      .then(() => {
        alert("Avaliação enviada com sucesso!");
        localStorage.clear();
        window.location.reload();
      })
      .catch((err) => {
        setErrorMessage(err.message);
        setShowErrorModal(true);
      });
  };

  return (
    <header className="bg-white border-b px-6 py-4 shadow-sm">
      <div className="flex justify-between items-center">
        <h1 className="text-gray-800 font-semibold">{pageTitle}</h1>
        {isAvaliacaoPage && (
          <>
            <button
              onClick={handleConcluirEEnviar}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Concluir e enviar
            </button>

            <ConfirmModal
              isOpen={showConfirmModal}
              onClose={() => setShowConfirmModal(false)}
              onConfirm={() => {
                setShowConfirmModal(false);
                handleEnviarAvaliacao();
              }}
              title="Você está quase lá!"
              description="Você tem certeza que deseja enviar sua avaliação? Após isso, ela não poderá ser editada."
            />

            <ErrorModal
              isOpen={showErrorModal}
              onClose={() => setShowErrorModal(false)}
              message={errorMessage}
            />
          </>
        )}
      </div>
    </header>
  );
}

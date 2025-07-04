import Frame from "../assets/Frame.svg";
import Frame1 from "../assets/Frame (1).svg";
import Frame2 from "../assets/Frame (2).svg";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserType } from "../contexts/UserTypeContext";
import React, { useState } from "react";
import PopupLogout from "./PopupLogout";

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userType } = useUserType();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const handleLogout = () => {
    setShowLogoutPopup(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutPopup(false);
    navigate("/login");
  };

  const handleCancelLogout = () => {
    setShowLogoutPopup(false);
  };

  return (
    <aside className="w-[14.5rem] h-full bg-white border-r-2 border-[#CECDCD] flex flex-col">
      {/* Header fixo */}
      <div className="flex items-center justify-center h-16 border-b border-[#CECDCD]">
        <span className="text-2xl font-bold text-[#08605F]">RPE</span>
      </div>

      {/* Navegação com scroll se necessário */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav>
          <ul className="flex flex-col gap-2 pl-5">
            <li>
              <span
                className={`flex items-center text-[#08605F] rounded-lg font-medium py-3 px-2 cursor-pointer block w-[12rem] text-left
                  ${
                    location.pathname === "/employee-dashboard"
                      ? "bg-[#08605F1F] font-bold"
                      : "hover:bg-[#08605F1F]"
                  }`}
                onClick={() => navigate("/employee-dashboard")}
              >
                <img src={Frame} alt="Frame" className="mr-2 w-5 h-5" />
                Dashboard do colaborador
              </span>
            </li>

            {userType.includes("GESTOR") && (
              <li>
                <span
                  className={`flex items-center text-[#08605F] rounded-lg font-medium py-3 px-2 cursor-pointer block w-[12rem] text-left
                    ${
                      location.pathname === "/gestor-dashboard"
                        ? "bg-[#08605F1F] font-bold"
                        : "hover:bg-[#08605F1F]"
                    }`}
                  onClick={() => navigate("/gestor-dashboard")}
                >
                  <img src={Frame} alt="Frame" className="mr-2 w-5 h-5" />
                  Dashboard do gestor
                </span>
              </li>
            )}

            {userType.includes("COMITE") && (
              <li>
                <span
                  className={`flex items-center text-[#08605F] rounded-lg font-medium py-3 px-2 cursor-pointer block w-[12rem] text-left
                    ${
                      location.pathname === "/comite-dashboard"
                        ? "bg-[#08605F1F] font-bold"
                        : "hover:bg-[#08605F1F]"
                    }`}
                  onClick={() => navigate("/comite-dashboard")}
                >
                  <img src={Frame} alt="Frame" className="mr-2 w-5 h-5" />
                  Dashboard do comitê
                </span>
              </li>
            )}

            {userType.includes("RH") && (
              <li>
                <span
                  className={`flex items-center text-[#08605F] rounded-lg font-medium py-3 px-2 cursor-pointer block w-[12rem] text-left
                    ${
                      location.pathname === "/rh-dashboard"
                        ? "bg-[#08605F1F] font-bold"
                        : "hover:bg-[#08605F1F]"
                    }`}
                  onClick={() => navigate("/rh-dashboard")}
                >
                  <img src={Frame} alt="Frame" className="mr-2 w-5 h-5" />
                  Dashboard do RH
                </span>
              </li>
            )}

            <li>
              <span
                className={`flex items-center text-[#08605F] rounded-lg font-medium py-3 px-2 cursor-pointer block w-[12rem] text-left
                  ${
                    location.pathname === "/cycle-evaluation"
                      ? "bg-[#08605F1F] font-bold"
                      : "hover:bg-[#08605F1F]"
                  }`}
                onClick={() => navigate("/cycle-evaluation")}
              >
                <img src={Frame1} alt="Frame 1" className="mr-2 w-5 h-5" />
                Avaliação de ciclo
              </span>
            </li>

            <li>
              <span
                className={`flex items-center text-[#08605F] rounded-lg font-medium py-3 px-2 cursor-pointer block w-[12rem] text-left
                  ${
                    location.pathname === "/gestor/collaborators"
                      ? "bg-[#08605F1F] font-bold"
                      : "hover:bg-[#08605F1F]"
                  }`}
                onClick={() => navigate("/gestor/collaborators")}
              >
                <img src={Frame2} alt="Frame 2" className="mr-2 w-5 h-5" />
                Gestor - Colaboradores
              </span>
            </li>
            <li>
              <span
                className={`flex items-center text-[#08605F] rounded-lg font-medium py-3 px-2 cursor-pointer block w-[12rem] text-left
                  ${
                    location.pathname === "/evolution-page"
                      ? "bg-[#08605F1F] font-bold"
                      : "hover:bg-[#08605F1F]"
                  }
                `}
                onClick={() => navigate("/evolution-page")}
              >
                <img src={Frame2} alt="Frame 2" className="mr-2 w-5 h-5" />
                Colaborador - Evolução
              </span>
            </li>
          </ul>
        </nav>
      </div>

      {/* Footer fixo no rodapé */}
      <div className="border-t border-[#CECDCD] px-5 py-4 bg-white">
        <div className="flex items-center mb-3">
          <span className="bg-[#CECDCD] text-[#1D1D1D] font-bold rounded-full w-8 h-8 flex items-center justify-center mr-2">
            CN
          </span>
          <span className="text-base text-[#1D1D1D]">Colaborador 1</span>
        </div>
        <button
          className="text-[#08605F] text-base hover:underline focus:outline-none"
          onClick={handleLogout}
        >
          Logout
        </button>
        <PopupLogout
          isOpen={showLogoutPopup}
          onConfirm={handleConfirmLogout}
          onCancel={handleCancelLogout}
        />
      </div>
    </aside>
  );
};

import Frame from "../assets/Frame.svg";
import Frame1 from "../assets/Frame (1).svg";
import Frame2 from "../assets/Frame (2).svg";
import Frame3 from "../assets/Frame (7).svg";
import Frame4 from "../assets/Frame (8).svg";
import Frame5 from "../assets/Frame (9).svg";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserType } from "../contexts/UserTypeContext";

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userType } = useUserType();

  return (
    <aside className="w-[14.5rem] h-[64rem] bg-white border-r-2 border-[#CECDCD] flex flex-col justify-between py-8">
      <div>
        <div className="flex items-center justify-center h-16 mb-8">
          <span className="text-2xl font-bold text-[#08605F]">RPE</span>
        </div>
        <nav>
          <ul className="flex flex-col gap-2 pl-5">
            {/* <li>
              <span
                className={`flex items-center text-[#08605F] rounded-lg font-medium py-3 px-2 cursor-pointer block w-[12rem] text-left
                  ${
                    location.pathname === "/dashboard"
                      ? "bg-[#08605F1F] font-bold"
                      : "hover:bg-[#08605F1F]"
                  }
                `}
                onClick={() => navigate("/dashboard")}
              >
                <img src={Frame} alt="Frame" className="mr-2 w-5 h-5" />
                Dashboard
              </span>
            </li> */}

            <li>
              <span
                className={`flex items-center text-[#08605F] rounded-lg font-medium py-3 px-2 cursor-pointer w-[12rem] text-left
                  ${
                    location.pathname === "/employee-dashboard"
                      ? "bg-[#08605F1F] font-bold"
                      : "hover:bg-[#08605F1F]"
                  }
                `}
                onClick={() => navigate("/employee-dashboard")}
              >
                <img src={Frame} alt="Frame" className="mr-2 w-5 h-5" />
                Dashboard do colaborador
              </span>
            </li>
            {userType.includes("GESTOR") && (
              <li>
                <span
                  className={`flex items-center text-[#08605F] rounded-lg font-medium py-3 px-2 cursor-pointer w-[12rem] text-left
                  ${
                    location.pathname === "/gestor-dashboard"
                      ? "bg-[#08605F1F] font-bold"
                      : "hover:bg-[#08605F1F]"
                  }
                `}
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
                  className={`flex items-center text-[#08605F] rounded-lg font-medium py-3 px-2 cursor-pointer w-[12rem] text-left
                  ${
                    location.pathname === "/comite-dashboard"
                      ? "bg-[#08605F1F] font-bold"
                      : "hover:bg-[#08605F1F]"
                  }
                `}
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
                    className={`flex items-center text-[#08605F] rounded-lg font-medium py-3 px-2 cursor-pointer w-[12rem] text-left
                  ${
                    location.pathname === "/rh-dashboard"
                      ? "bg-[#08605F1F] font-bold"
                      : "hover:bg-[#08605F1F]"
                  }
                `}
                  onClick={() => navigate("/rh-dashboard")}
                >
                  <img src={Frame} alt="Frame" className="mr-2 w-5 h-5" />
                  Dashboard do RH
                </span>
              </li>
            )}

            <li>
              <span
                className={`flex items-center text-[#08605F] rounded-lg font-medium py-3 px-2 cursor-pointer w-[12rem] text-left
                  ${
                    location.pathname === "/avaliacao/autoavaliacao"
                      ? "bg-[#08605F1F] font-bold"
                      : "hover:bg-[#08605F1F]"
                  }
                `}
                onClick={() => navigate("/avaliacao/autoavaliacao")}
              >
                <img src={Frame1} alt="Frame 1" className="mr-2 w-5 h-5" />
                Avaliação de ciclo
              </span>
            </li>
            <li>
              <span
                className={`flex items-center text-[#08605F] rounded-lg font-medium py-3 px-2 cursor-pointer w-[12rem] text-left
                  ${
                    location.pathname === "/evolution"
                      ? "bg-[#08605F1F] font-bold"
                      : "hover:bg-[#08605F1F]"
                  }
                `}
                onClick={() => navigate("/evolution")}
              >
                <img src={Frame2} alt="Frame 2" className="mr-2 w-5 h-5" />
                Evolução
              </span>
            </li>
            <li>
              <span
                  className={`flex items-center text-[#08605F] rounded-lg font-medium py-3 px-2 cursor-pointer w-[12rem] text-left
                  ${
                    location.pathname === "/gestor/collaborators"
                      ? "bg-[#08605F1F] font-bold"
                      : "hover:bg-[#08605F1F]"
                  }
                `}
                onClick={() => navigate("/gestor/collaborators")}
              >
                <img src={Frame2} alt="Frame 2" className="mr-2 w-5 h-5" />
                Gestor - Colaboradores
              </span>
            </li>
            <li>
              <span
                className={`flex items-center text-[#08605F] rounded-lg font-medium py-3 px-2 cursor-pointer w-[12rem] text-left
                  ${
                    location.pathname === "/rh/criterios"
                      ? "bg-[#08605F1F] font-bold"
                      : "hover:bg-[#08605F1F]"
                  }
                `}
                onClick={() => navigate("/rh/criterios")}
              >
                <img src={Frame3} alt="Frame 3" className="mr-2 w-5 h-5" />
                Critérios de Avaliação
              </span>
            </li>
            <li>
              <span
                className={`flex items-center text-[#08605F] rounded-lg font-medium py-3 px-2 cursor-pointer w-[12rem] text-left
                  ${
                    location.pathname === "/comite/equalizacoes"
                      ? "bg-[#08605F1F] font-bold"
                      : "hover:bg-[#08605F1F]"
                  }
                `}
                onClick={() => navigate("/comite/equalizacoes")}
              >
                <img src={Frame4} alt="Frame 4" className="mr-2 w-5 h-5" />
                Equalizações
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
            <li>
              <span
                className={`flex items-center text-[#08605F] rounded-lg font-medium py-3 px-2 cursor-pointer block w-[12rem] text-left
                  ${
                    location.pathname === "/rh/ImportHistoryPage"
                      ? "bg-[#08605F1F] font-bold"
                      : "hover:bg-[#08605F1F]"
                  }
                `}
                onClick={() => navigate("/rh/ImportHistoryPage")}
              >
                <img src={Frame5} alt="Frame 2" className="mr-2 w-5 h-5" />
                Importar Histórico
              </span>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex flex-col items-start pl-8">
        <div className="flex items-center mb-4">
          <span className="bg-[#CECDCD] text-[#1D1D1D] font-bold rounded-full w-8 h-8 flex items-center justify-center mr-2">
            CN
          </span>
          <span className="text-base text-[#1D1D1D]">Colaborador 1</span>
        </div>
        <a href="#" className="text-[#08605F] text-base hover:underline">
          Logout
        </a>
      </div>
    </aside>
  );
};

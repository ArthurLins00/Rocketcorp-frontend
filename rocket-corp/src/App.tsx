import "./App.css";
import { Dashboard } from "./pages/dashboard";
import { Evolution } from "./pages/evolution";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import Header from "./components/Header";
import Topbar from "./components/Topbar";
import { UserTypeProvider } from "./contexts/UserTypeContext";

import AutoAvaliacao from "./pages/avaliacao/Autoavaliacao";
import Avaliacao360 from "./pages/avaliacao/Avaliacao360";
import Mentoring from "./pages/avaliacao/Mentoring";
import Referencias from "./pages/avaliacao/Referencias";

import DashboardColaborador from "./pages/dashboard-colaborador";
import DashboardComite from "./pages/dashboard-comite";
import DashboardRH from "./pages/dashboard-rh";
import DashboardGestor from "./pages/dashboard-gestor";

import { RhCollaboratorsListPage } from "./pages/rh/RhListOfCollaborators";
import { GestorCollaboratorsListPage } from "./pages/gestor/GestorListOfCollaborators";

import CriteriaManagementPage from "./pages/rh/CriteriaManagementPage";
import { CollaboratorPage } from "./pages/gestor/CollaboratorPage";
import { EvolutionPage } from "./pages/EvolutionPage";
import LoginPage from "./pages/login";
import EqualizacoesPage from "./pages/comite/EqualizacoesPage";
import ImportHistoryPage from "./pages/rh/ImportHistoryPage";
import BrutalFactsPage from "./pages/gestor/BrutalFactsPage";
import React, { useEffect, useState } from "react";
import NotAuthorizedPage from "./pages/NotAuthorizedPage";
import { authenticatedFetch } from "./utils/auth";

function RequireAuth({ children, requiredRole }: { children: React.ReactElement, requiredRole?: string }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasRole, setHasRole] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authenticatedFetch("/auth/me");
        if (res && res.ok) {
          const data = await res.json();
          if (data.message && data.message.toLowerCase().includes("user details retrieved successfully")) {
            setIsAuthenticated(true);
            if (requiredRole) {
              const userStr = localStorage.getItem("user");
              let userRoles: string[] = [];
              if (userStr) {
                try {
                  const userObj = JSON.parse(userStr);
                  userRoles = userObj.role || [];
                  console.log("User roles from localStorage:", userRoles);
                } catch {}
                // console.log("User roles from localStorage:", userRoles);
              } else {
                console.warn("No user data found in localStorage");
              }
              
              if (Array.isArray(userRoles)) {
                setHasRole(userRoles.includes(requiredRole));
              } else {
                setHasRole(userRoles === requiredRole);
              }
            } else {
              setHasRole(true);
            }
          } else {
            setIsAuthenticated(false);
            setHasRole(false);
          }
        } else {
          setIsAuthenticated(false);
          setHasRole(false);
        }
      } catch {
        setIsAuthenticated(false);
        setHasRole(false);
      }
    };
    checkAuth();
  }, [requiredRole]);

  if (isAuthenticated === null || hasRole === null) {
    return <div>Carregando...</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!hasRole) {
    return <NotAuthorizedPage />;
  }
  return children;
}

export default function App() {
  const location = useLocation();
  const isAvaliacaoRoute = location.pathname.startsWith("/avaliacao");
  const isCollaboratorDetailRoute = location.pathname.startsWith("/gestor/collaborator/");
  const isLoginPage = location.pathname === "/login";

  if (isLoginPage) {
    return (
      <UserTypeProvider>
        <LoginPage />
      </UserTypeProvider>
    );
  }
  {/*
    pra usar o RequireAuth, basta chamar sua tela entre <RequireAuth> </RequireAuth>,
    e se a tela for protegida para certos cargos, use <RequireAuth requiredRole="cargo"> </RequireAuth>
    exemplo:
    <Route path="/gestor/collaborator/:id" element={<RequireAuth requiredRole="manager" ><CollaboratorPage /></RequireAuth>} />
  */}
  return (
    <UserTypeProvider>
      <div className="flex min-h-screen bg-[#F1F1F1] text-gray-800">
        <Sidebar />
        <div className="flex flex-col flex-1">
          {!isCollaboratorDetailRoute && <Header />}
          {isAvaliacaoRoute && <Topbar />}
          <main className="flex-1">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/not-authorized" element={<NotAuthorizedPage />} />
              <Route path="*" element={<Navigate to="/login" replace />} />

              {/* colaborador */}
              <Route path="/employee-dashboard" element={<DashboardColaborador />} />
              <Route path="/avaliacao/autoavaliacao" element={<AutoAvaliacao />} />
              <Route path="/avaliacao/avaliacao360" element={<Avaliacao360 />} />
              <Route path="/avaliacao/mentoring" element={<Mentoring />} />
              <Route path="/avaliacao/referencias" element={<Referencias />} />
              <Route path="/evolution-page" element={<EvolutionPage />} />

              {/* <Route path="/colaborador/dashboard" element={<RequireAuth requiredRole="colaborador" ><DashboardColaborador /></RequireAuth>} />
              <Route path="/colaborador/avaliacao/autoavaliacao" element={<RequireAuth requiredRole="colaborador" ><AutoAvaliacao /></RequireAuth>} />
              <Route path="/colaborador/avaliacao/avaliacao360" element={<RequireAuth requiredRole="colaborador" ><Avaliacao360 /></RequireAuth>} />
              <Route path="/colaborador/avaliacao/mentoring" element={<RequireAuth requiredRole="colaborador" ><Mentoring /></RequireAuth>} />
              <Route path="/colaborador/avaliacao/referencias" element={<RequireAuth requiredRole="colaborador" ><Referencias /></RequireAuth>} />
              <Route path="/colaborador/evolution" element={<RequireAuth requiredRole="colaborador" ><EvolutionPage /></RequireAuth>} /> */}

              {/* gestor */}
              <Route path="/gestor-dashboard" element={<DashboardGestor />} />
              <Route path="/gestor/:gestorId/collaborators" element={<RequireAuth requiredRole="manager" ><GestorCollaboratorsListPage /></RequireAuth>} />
              <Route path="/gestor/colaborador/:id" element={<RequireAuth requiredRole="manager" ><CollaboratorPage /></RequireAuth>} />
              <Route path="/gestor/brutal-facts" element={<BrutalFactsPage />} />

              {/* <Route path="/gestor/dashboard" element={<RequireAuth requiredRole="gestor" ><DashboardGestor /></RequireAuth>} />
              <Route path="/gestor/:gestorId/colaboradores" element={<RequireAuth requiredRole="gestor" ><GestorCollaboratorsListPage /></RequireAuth>} />
              <Route path="/gestor/colaborador/:id" element={<RequireAuth requiredRole="gestor" ><CollaboratorPage /></RequireAuth>} />
              <Route path="/gestor/brutal-facts" element={<RequireAuth requiredRole="gestor" ><BrutalFactsPage /></RequireAuth>} /> */}

              {/* comite */}
              <Route path="/comite-dashboard" element={<DashboardComite />} />
              <Route path="/comite/equalizacoes" element={<EqualizacoesPage />} />

              {/* <Route path="/comite/dashboard" element={<RequireAuth requiredRole="comite" ><DashboardComite /></RequireAuth>} />
              <Route path="/comite/equalizacoes" element={<RequireAuth requiredRole="comite" ><EqualizacoesPage /></RequireAuth>} /> */}

              {/* rh */}
              <Route path="/rh-dashboard" element={<DashboardRH />} />
              <Route path="/rh/criterios" element={<CriteriaManagementPage />} />
              <Route path="/rh/ImportHistoryPage" element={<ImportHistoryPage />} />
              <Route path="/rh/collaborators" element={<RequireAuth requiredRole="rh" ><RhCollaboratorsListPage /></RequireAuth>} />
              
              {/* <Route path="/rh/dashboard" element={<RequireAuth requiredRole="rh" ><DashboardRH /></RequireAuth>} />
              <Route path="/rh/criterios" element={<RequireAuth requiredRole="rh" ><CriteriaManagementPage /></RequireAuth>} />
              <Route path="/rh/import-history" element={<RequireAuth requiredRole="rh" ><ImportHistoryPage /></RequireAuth>} />
              <Route path="/rh/colaboradores" element={<RequireAuth requiredRole="rh" ><RhCollaboratorsListPage /></RequireAuth>} /> */}

            </Routes>
          </main>
        </div>
      </div>
    </UserTypeProvider>
  );
}

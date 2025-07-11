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

import { CollaboratorsPage } from "./pages/gestor/CollaboratorsListPage";

import CriteriaManagementPage from "./pages/rh/CriteriaManagementPage";
import { CollaboratorPage } from "./pages/gestor/CollaboratorPage";
import { EvolutionPage } from "./pages/EvolutionPage";
import LoginPage from "./pages/login";
import EqualizacoesPage from "./pages/comite/EqualizacoesPage";
import React from "react";

// Helper to check auth
function RequireAuth({ children }: { children: React.ReactElement }) {
  const token = localStorage.getItem("access_token");
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
// trocar pra pagina nao autorizada

export default function App() {
  const location = useLocation();
  const isAvaliacaoRoute = location.pathname.startsWith("/avaliacao");
  const isCollaboratorDetailRoute = location.pathname.startsWith("/gestor/collaborator/");
  const isLoginPage = location.pathname === "/login";

  if (isLoginPage) {
    // Only render login page, no sidebar/header/topbar
    return (
      <UserTypeProvider>
        <LoginPage />
      </UserTypeProvider>
    );
  }

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
              {/* To protect routes, wrap with RequireAuth. For now, leave commented for production speed. */}
              {/* <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} /> */}
              <Route path="/dashboard" element={<Dashboard />} />
              {/* <Route path="/employee-dashboard" element={<RequireAuth><DashboardColaborador /></RequireAuth>} /> */}
              <Route path="/employee-dashboard" element={<DashboardColaborador />} />
              {/* <Route path="/comite-dashboard" element={<RequireAuth><DashboardComite /></RequireAuth>} /> */}
              <Route path="/comite-dashboard" element={<DashboardComite />} />
              {/* <Route path="/rh-dashboard" element={<RequireAuth><DashboardRH /></RequireAuth>} /> */}
              <Route path="/rh-dashboard" element={<DashboardRH />} />
              {/* <Route path="/gestor-dashboard" element={<RequireAuth><DashboardGestor /></RequireAuth>} /> */}
              <Route path="/gestor-dashboard" element={<DashboardGestor />} />
              {/* <Route path="/avaliacao/autoavaliacao" element={<RequireAuth><AutoAvaliacao /></RequireAuth>} /> */}
              <Route path="/avaliacao/autoavaliacao" element={<AutoAvaliacao />} />
              {/* <Route path="/avaliacao/avaliacao360" element={<RequireAuth><Avaliacao360 /></RequireAuth>} /> */}
              <Route path="/avaliacao/avaliacao360" element={<Avaliacao360 />} />
              {/* <Route path="/avaliacao/mentoring" element={<RequireAuth><Mentoring /></RequireAuth>} /> */}
              <Route path="/avaliacao/mentoring" element={<Mentoring />} />
              {/* <Route path="/avaliacao/referencias" element={<RequireAuth><Referencias /></RequireAuth>} /> */}
              <Route path="/avaliacao/referencias" element={<Referencias />} />
              {/* <Route path="/evolution-page" element={<RequireAuth><EvolutionPage /></RequireAuth>} /> */}
              <Route path="/evolution-page" element={<EvolutionPage />} />
              {/* <Route path="/rh/criterios" element={<RequireAuth><CriteriaManagementPage /></RequireAuth>} /> */}
              <Route path="/rh/criterios" element={<CriteriaManagementPage />} />
              {/* <Route path="/comite/equalizacoes" element={<RequireAuth><EqualizacoesPage /></RequireAuth>} /> */}
              <Route path="/comite/equalizacoes" element={<EqualizacoesPage />} />
              {/* <Route path="/gestor/collaborators" element={<RequireAuth><CollaboratorsPage /></RequireAuth>} /> */}
              <Route path="/gestor/collaborators" element={<CollaboratorsPage />} />
              {/* <Route path="/gestor/collaborator/:id" element={<RequireAuth><CollaboratorPage /></RequireAuth>} /> */}
              <Route path="/gestor/collaborator/:id" element={<CollaboratorPage />} />
              {/* Default route: redirect to login if not authenticated */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </UserTypeProvider>
  );
}

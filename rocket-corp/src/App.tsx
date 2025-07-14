import "./App.css";
import { Dashboard } from "./pages/dashboard";
import { Evolution } from "./pages/evolution";
import { Routes, Route, useLocation } from "react-router-dom";
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
import AdminCycles from "./pages/admin/admin-cycles";

export default function App() {
  const location = useLocation();
  const isAvaliacaoRoute = location.pathname.startsWith("/avaliacao");
  const isCollaboratorDetailRoute = location.pathname.startsWith(
    "/gestor/collaborator/"
  );

  return (
    <UserTypeProvider>
      <div className="flex min-h-screen bg-[#F1F1F1] text-gray-800">
        <Sidebar />

        <div className="flex flex-col flex-1">
          {!isCollaboratorDetailRoute && <Header />}
          {isAvaliacaoRoute && <Topbar />}

          <main className="flex-1">
            <Routes>
              <Route
                path="/avaliacao/autoavaliacao"
                element={<AutoAvaliacao />}
              />
              <Route
                path="/avaliacao/avaliacao360"
                element={<Avaliacao360 />}
              />
              <Route path="/avaliacao/mentoring" element={<Mentoring />} />
              <Route path="/avaliacao/referencias" element={<Referencias />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/evolution-page" element={<EvolutionPage />} />
              <Route
                path="/employee-dashboard"
                element={<DashboardColaborador />}
              />
              <Route path="/comite-dashboard" element={<DashboardComite />} />
              <Route path="/rh-dashboard" element={<DashboardRH />} />
              <Route path="/gestor-dashboard" element={<DashboardGestor />} />
              <Route
                path="/rh/criterios"
                element={<CriteriaManagementPage />}
              />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/comite/equalizacoes"
                element={<EqualizacoesPage />}
              />

              <Route
                path="/gestor/collaborators"
                element={<CollaboratorsPage />}
              />
              <Route
                path="/gestor/collaborator/:id"
                element={<CollaboratorPage />}
              />
              <Route path="/admin-cycles" element={<AdminCycles />} />
            </Routes>
          </main>
        </div>
      </div>
    </UserTypeProvider>
  );
}

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
import CycleEvaluation from "./pages/cycle-evaluation";
import { CollaboratorsPage } from "./pages/gestor/CollaboratorsListPage";

import CriteriaManagementPage from "./pages/rh/CriteriaManagementPage";
import { CollaboratorPage } from "./pages/gestor/CollaboratorPage";
import LoginPage from "./pages/login";
import EqualizacoesPage from "./pages/comite/EqualizacoesPage";


export default function App() {
  const location = useLocation();
  const isAvaliacaoRoute = location.pathname.startsWith("/avaliacao");

  return (
    <UserTypeProvider>
      <div className="flex min-h-screen text-gray-800">
        <Sidebar />

      <div className="flex flex-col flex-1">
        <Header />
        {isAvaliacaoRoute && <Topbar />}

          <main className="flex-1">
            <Routes>
              <Route path="/avaliacao/autoavaliacao" element={<AutoAvaliacao />} />
              <Route path="/avaliacao/avaliacao360" element={<Avaliacao360 />} />
              <Route path="/avaliacao/mentoring" element={<Mentoring />} />
              <Route path="/avaliacao/referencias" element={<Referencias />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/evolution" element={<Evolution />} />
              <Route path="/employee-dashboard" element={<DashboardColaborador />} />
              <Route path="/comite-dashboard" element={<DashboardComite />} />
              <Route path="/rh-dashboard" element={<DashboardRH />} />
              <Route path="/gestor-dashboard" element={<DashboardGestor />} />
              <Route path="/cycle-evaluation" element={<CycleEvaluation />} />            
              <Route
                path="/gestor/id/colaboradores"
                element={<CollaboratorsPage />}
              />
              <Route path="/criterios" element={<CriteriaManagementPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<CollaboratorPage />} />
              <Route path="/comite/equalizacoes" element={<EqualizacoesPage />} />

              <Route path="/gestor/collaborators" element={<CollaboratorsPage />} />
              <Route path="/gestor/collaborator/:id" element={<CollaboratorPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </UserTypeProvider>
  );
}

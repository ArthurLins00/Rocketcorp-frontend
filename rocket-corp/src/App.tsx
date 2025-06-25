import { Routes, Route, useLocation } from "react-router-dom";
import {Sidebar} from "./components/Sidebar";
import Header from "./components/Header";
import Topbar from "./components/Topbar";

import AutoAvaliacao from "./pages/avaliacao/Autoavaliacao";
import Avaliacao360 from "./pages/avaliacao/Avaliacao360";
import Mentoring from "./pages/avaliacao/Mentoring";
import Referencias from "./pages/avaliacao/Referencias";
import { CollaboratorsPage } from "./pages/gestor/CollaboratorsListPage";

import CriteriaManagementPage from "./pages/rh/CriteriaManagementPage";
import {CollaboratorPage} from "./pages/gestor/CollaboratorPage";

export default function App() {
  const location = useLocation();
  const isAvaliacaoRoute = location.pathname.startsWith("/avaliacao");

  return (
    <div className="flex min-h-screen bg-[#f1f1f1] text-gray-800">
      <Sidebar />

      <div className="flex flex-col flex-1">
        {/* <Header /> */}
        {/* {isAvaliacaoRoute && <Topbar />} */}

        <main className="flex-1">
          <Routes>
            <Route path="/avaliacao/autoavaliacao" element={<AutoAvaliacao />} />
            <Route path="/avaliacao/avaliacao360" element={<Avaliacao360 />} />
            <Route path="/avaliacao/mentoring" element={<Mentoring />} />
            <Route path="/avaliacao/referencias" element={<Referencias />} />
            <Route path="/gestor/id/colaboradores" element={<CollaboratorsPage />} />
            <Route path="/criterios" element={<CriteriaManagementPage />} />
            <Route path="/" element={<CollaboratorPage />} />
            
          </Routes>
        </main>
      </div>
    </div>
  );
}

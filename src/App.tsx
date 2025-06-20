import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Topbar from "./components/Topbar";

import AutoAvaliacao from "./pages/Autoavaliacao";
import Avaliacao360 from "./pages/Avaliacao360";
import Mentoring from "./pages/Mentoring";
import Referencias from "./pages/Referencias";

export default function App() {
  const location = useLocation();
  const isAvaliacaoRoute = location.pathname.startsWith("/avaliacao");

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Header />
        {isAvaliacaoRoute && <Topbar />}

        <main className="flex-1 p-6">
          <Routes>
            <Route path="/avaliacao/autoavaliacao" element={<AutoAvaliacao />} />
            <Route path="/avaliacao/avaliacao360" element={<Avaliacao360 />} />
            <Route path="/avaliacao/mentoring" element={<Mentoring />} />
            <Route path="/avaliacao/referencias" element={<Referencias />} />
            {/* Exemplo de outras páginas possíveis: */}
            {/* <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/evolucao" element={<Evolucao />} />
            <Route path="/perfil" element={<Perfil />} /> */}
          </Routes>
        </main>
      </div>
    </div>
  );
}

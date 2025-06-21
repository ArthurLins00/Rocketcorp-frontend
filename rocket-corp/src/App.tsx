import "./App.css";
import { Dashboard } from "./pages/dashboard";
import { Evolution } from "./pages/evolution";
import { Routes, Route, useLocation } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import Header from "./components/Header";
import Topbar from "./components/Topbar";

import AutoAvaliacao from "./pages/avaliacao/Autoavaliacao";
import Avaliacao360 from "./pages/avaliacao/Avaliacao360";
import Mentoring from "./pages/avaliacao/Mentoring";
import Referencias from "./pages/avaliacao/Referencias";

export default function App() {
  const location = useLocation();
  const isAvaliacaoRoute = location.pathname.startsWith("/avaliacao");

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Header />
        {isAvaliacaoRoute && <Topbar />}

        <main className="flex-1">
          <Routes>
            <Route
              path="/avaliacao/autoavaliacao"
              element={<AutoAvaliacao />}
            />
            <Route path="/avaliacao/avaliacao360" element={<Avaliacao360 />} />
            <Route path="/avaliacao/mentoring" element={<Mentoring />} />
            <Route path="/avaliacao/referencias" element={<Referencias />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/evolution" element={<Evolution />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

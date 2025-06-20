import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Dashboard } from "./pages/dashboard";
import { Evolution } from "./pages/evolution";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/evolution" element={<Evolution />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

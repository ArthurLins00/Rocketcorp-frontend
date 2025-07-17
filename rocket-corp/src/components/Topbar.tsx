import { Link, useLocation } from "react-router-dom";
import { useUserType } from "../contexts/UserTypeContext";

export default function Topbar() {
  const location = useLocation();
  const { userType } = useUserType();

  const isActive = (path: string) =>
    location.pathname === path
      ? "border-b-2 border-green-600 text-green-700 font-medium"
      : "text-gray-600 hover:text-green-700";

  // Check if user is a manager
  const isManager = userType.some(role => role.toLowerCase() === "gestor");

  return (
    <nav className="flex space-x-6 border-b border-gray-200 mb-1 px-6 pt-4 bg-white">
      <Link to="/avaliacao/autoavaliacao" className={`pb-2 ${isActive("/avaliacao/autoavaliacao")}`}>
        Autoavaliação
      </Link>
      {!isManager && (
        <Link to="/avaliacao/avaliacao360" className={`pb-2 ${isActive("/avaliacao/avaliacao360")}`}>
          Avaliação 360°
        </Link>
      )}
      <Link to="/avaliacao/mentoring" className={`pb-2 ${isActive("/avaliacao/mentoring")}`}>
        Mentoring
      </Link>
      <Link to="/avaliacao/referencias" className={`pb-2 ${isActive("/avaliacao/referencias")}`}>
        Referências
      </Link>
    </nav>
  );
}

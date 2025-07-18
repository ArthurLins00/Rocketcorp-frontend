import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUserType } from "../contexts/UserTypeContext";
import { clearAllUserData } from "../utils/auth";
import Frame from "../assets/Frame.svg";
import Frame1 from "../assets/Frame (1).svg";
import Frame2 from "../assets/Frame (2).svg";
import Frame3 from "../assets/Frame (7).svg";
import Frame4 from "../assets/Frame (8).svg";
import Frame5 from "../assets/Frame (9).svg";
import Frame6 from "../assets/Frame (10).svg";

export type SidebarItem = {
  label: string;
  path: string;
  icon: string;
  show: boolean;
  role?: string; // Add role property
};

export function useSidebarController() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLogsPopup, setShowLogsPopup] = useState(false);
  const { user, userType } = useUserType();

  // Get user roles directly from localStorage
  let userRole: string[] = [];
  const userRaw = localStorage.getItem("user");
  if (userRaw) {
    try {
      const userObj = JSON.parse(userRaw);
      if (Array.isArray(userObj.role)) {
        userRole = userObj.role;
      } else if (typeof userObj.role === "string") {
        userRole = [userObj.role];
      }
    } catch (e) {
      userRole = [];
    }
  }

  const handleLogout = async () => {
    // endpoint de logout
    // await apiFetch(import.meta.env.VITE_API_URL + "/auth/logout", {
    //     method: "POST",
    //     credentials: "include", // send cookies
    // });
    clearAllUserData();
    window.location.href = "/login";
  };

  // Get user id from context
  const userId = user?.id?.toString() || null;

  // Check if user has permission to view logs
  const canViewLogs =
    userType.includes("rh") ||
    userType.includes("comite") ||
    userType.includes("admin");

  // Auto-show logs popup for users with permission
  useEffect(() => {
    if (canViewLogs) {
      // Show popup after 2 seconds of page load
      const timer = setTimeout(() => {
        setShowLogsPopup(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [canViewLogs]);

  // Sidebar items logic here
  const sidebarItems: SidebarItem[] = [
    {
      label: "Dashboard do colaborador",
      path: "/colaborador/dashboard",
      icon: Frame,
      show: userType.includes("colaborador"),
      role: "colaborador",
    },
    {
      label: "Dashboard do gestor",
      path: "/gestor/dashboard",
      icon: Frame,
      show: userType.includes("gestor"),
      role: "gestor",
    },
    {
      label: "Dashboard do comitê",
      path: "/comite/dashboard",
      icon: Frame,
      show: userType.includes("comite"),
      role: "comite",
    },
    {
      label: "Dashboard do RH",
      path: "/rh/dashboard",
      icon: Frame,
      show: userType.includes("rh"),
      role: "rh",
    },
    {
      label: "Avaliação de ciclo",
      path: "/colaborador/avaliacao/autoavaliacao",
      icon: Frame1,
      show: userType.includes("colaborador"),
      role: "colaborador",
    },
    {
      label: "Evolução",
      path: "/colaborador/evolution",
      icon: Frame2,
      show: userType.includes("colaborador"),
      role: "colaborador",
    },
    {
      label: "Colaboradores - Gestor",
      path: userId
        ? `/gestor/${userId}/colaboradores`
        : "/gestor/colaboradores",
      icon: Frame2,
      show: userType.includes("gestor"),
      role: "gestor",
    },
    {
      label: "Brutal Facts",
      path: "/gestor/brutal-facts",
      icon: Frame6,
      show: userType.includes("gestor"),
      role: "gestor",
    },
    {
      label: "Critérios de Avaliação",
      path: "/rh/criterios",
      icon: Frame3,
      show: userType.includes("rh"),
      role: "rh",
    },
    {
      label: "Importar Histórico",
      path: "/rh/import-history",
      icon: Frame5,
      show: userType.includes("rh"),
      role: "rh",
    },
    {
      label: "Colaboradores - RH",
      path: "/rh/colaboradores",
      icon: Frame2,
      show: userType.includes("rh"),
      role: "rh",
    },
    {
      label: "Equalizações",
      path: "/comite/equalizacoes",
      icon: Frame4,
      show: userType.includes("comite"),
      role: "comite",
    },
    {
      label: "Administração de Ciclos",
      path: "/admin/cycles",
      icon: Frame3,
      show: userType.includes("admin"),
      role: "admin",
    },
  ];

  return {
    navigate,
    location,
    userType,
    userRole,
    showLogoutConfirm,
    setShowLogoutConfirm,
    showLogsPopup,
    setShowLogsPopup,
    handleLogout,
    userId,
    canViewLogs,
    sidebarItems: sidebarItems.filter((item) => item.show),
  };
}

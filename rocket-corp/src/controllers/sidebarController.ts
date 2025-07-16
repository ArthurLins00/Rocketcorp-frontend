import { useNavigate, useLocation } from "react-router-dom";
import { useUserType } from "../contexts/UserTypeContext";
import { useState } from "react";
import { apiFetch } from "../utils/api";
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
};

export function useSidebarController() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogout = async () => {
        // endpoint de logout
        // await apiFetch(import.meta.env.VITE_API_URL + "/auth/logout", {
        //     method: "POST",
        //     credentials: "include", // send cookies
        // });
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    // Get user id from localStorage
    let userId: string | null = null;
    let userType: string[] = [];
    const userStr = localStorage.getItem("user");
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            userId = user.id || null;
            userType = user.role || [];
        } catch {
            userId = null;
        }
    }

    // Sidebar items logic here
    const sidebarItems: SidebarItem[] = [
        {
            label: "Dashboard do colaborador",
            path: "/employee-dashboard",
            icon: Frame,
            show: true,
        },
        {
            label: "Dashboard do gestor",
            path: "/gestor-dashboard",
            icon: Frame,
            show: userType.includes("manager"),
        },
        {
            label: "Dashboard do comitê",
            path: "/comite-dashboard",
            icon: Frame,
            show: userType.includes("committee"),
        },
        {
            label: "Dashboard do RH",
            path: "/rh-dashboard",
            icon: Frame,
            show: userType.includes("rh"),
        },
        {
            label: "Avaliação de ciclo",
            path: "/avaliacao/autoavaliacao",
            icon: Frame1,
            show: true,
        },
        {
            label: "Evolução",
            path: "/evolution",
            icon: Frame2,
            show: true,
        },
        {
            label: "Colaboradores - Gestor",
            path: userId ? `/gestor/${userId}/collaborators` : "/gestor/collaborators",
            icon: Frame2,
            show: userType.includes("manager"),
        },
        {
            label: "Colaboradores - RH",
            path: "/rh/collaborators",
            icon: Frame2,
            show: userType.includes("rh"),
        },
        {
            label: "Critérios de Avaliação",
            path: "/rh/criterios",
            icon: Frame3,
            show: true,
        },
        {
            label: "Equalizações",
            path: "/comite/equalizacoes",
            icon: Frame4,
            show: true,
        },
        {
            label: "Colaborador - Evolução",
            path: "/evolution-page",
            icon: Frame2,
            show: true,
        },
        {
            label: "Importar Histórico",
            path: "/rh/ImportHistoryPage",
            icon: Frame5,
            show: true,
        },
        {
            label: "Brutal Facts",
            path: "/gestor/brutal-facts",
            icon: Frame6,
            show: true,
        }
    ];

    return {
        navigate,
        location,
        userType,
        showLogoutConfirm,
        setShowLogoutConfirm,
        handleLogout,
        userId,
        sidebarItems: sidebarItems.filter(item => item.show),
    };
}

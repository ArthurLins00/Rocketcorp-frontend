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
    role?: string; // Add role property
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
            label: "Autoavaliação",
            path: "/colaborador/avaliacao/autoavaliacao",
            icon: Frame1,
            show: userType.includes("colaborador"),
            role: "colaborador",
        },
        {
            label: "Avaliação 360",
            path: "/colaborador/avaliacao/avaliacao360",
            icon: Frame1,
            show: userType.includes("colaborador"),
            role: "colaborador",
        },
        {
            label: "Mentoring",
            path: "/colaborador/avaliacao/mentoring",
            icon: Frame1,
            show: userType.includes("colaborador"),
            role: "colaborador",
        },
        {
            label: "Referências",
            path: "/colaborador/avaliacao/referencias",
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
            path: userId ? `/gestor/${userId}/colaboradores` : "/gestor/colaboradores",
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

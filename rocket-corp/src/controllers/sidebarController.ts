import { useNavigate, useLocation } from "react-router-dom";
import { useUserType } from "../contexts/UserTypeContext";
import { useState } from "react";
import { apiFetch } from "../utils/api";

export function useSidebarController() {
    const navigate = useNavigate();
    const location = useLocation();
    const { userType } = useUserType();
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

    return {
        navigate,
        location,
        userType,
        showLogoutConfirm,
        setShowLogoutConfirm,
        handleLogout,
    };
}

import { useNavigate, useLocation } from "react-router-dom";
import { useUserType } from "../contexts/UserTypeContext";
import { useState } from "react";
import { apiFetch } from "../utils/api";

export function useSidebarController() {
    const navigate = useNavigate();
    const location = useLocation();
    // const { userType } = useUserType();
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
            userType = [];
        }
    }

    console.log("User ID from localStorage:", userId);
    console.log("User Type from context:", userType);

    return {
        navigate,
        location,
        userType,
        showLogoutConfirm,
        setShowLogoutConfirm,
        handleLogout,
        userId,
    };
}

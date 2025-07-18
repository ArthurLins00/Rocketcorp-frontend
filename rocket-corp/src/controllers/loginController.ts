import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FormData } from "../models/FormData";
import { authenticatedFetch, clearUserEvaluationData } from "../utils/auth";
import { apiFetch } from "../utils/api";
import { useUserType } from "../contexts/UserTypeContext";

export function useLoginController() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
    });
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (error) setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (!formData.email && !formData.password) {
            setError("Por favor, preencha todos os campos");
            setIsLoading(false);
            return;
        }
        if (!formData.email) {
            setError("Por favor, preencha o campo de e-mail");
            setIsLoading(false);
            return;
        }
        if (!formData.password) {
            setError("Por favor, preencha o campo de senha");
            setIsLoading(false);
            return;
        }

        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
            setError("Por favor, insira um e-mail válido");
            setIsLoading(false);
            return;
        }
        try {
            const response = await apiFetch("/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
                credentials: "include",
            });
            if (!response) return;
            const data = await response.json();
            if (!response.ok) {
                if (
                    data.message === "Invalid credentials" ||
                    data.message === "Login ou senha incorretos"
                ) {
                    setError("Login ou senha incorretos");
                } else if (
                    data.message?.toLowerCase().includes("email must be an email") ||
                    data.message?.toLowerCase().includes("must be an email")
                ) {
                    setError("Por favor, insira um e-mail válido");
                } else if (
                    data.message?.toLowerCase().includes("email should not be empty") ||
                    data.message?.toLowerCase().includes("email is required")
                ) {
                    setError("Por favor, preencha o campo de e-mail");
                } else if (
                    data.message
                        ?.toLowerCase()
                        .includes("password should not be empty") ||
                    data.message?.toLowerCase().includes("password is required")
                ) {
                    setError("Por favor, preencha o campo de senha");
                } else {
                    setError(
                        "Ocorreu um erro ao tentar fazer login. Por favor, tente novamente."
                    );
                }
                setIsLoading(false);
                return;
            }
            localStorage.setItem("access_token", data.access_token);

            const [, payloadBase64] = data.access_token.split(".");
            const payload = JSON.parse(atob(payloadBase64));
            const userId = payload.user?.userId;
            if (!userId) {
                setError("Não foi possível obter o ID do usuário.");
                setIsLoading(false);
                return;
            }
            const userRes = await authenticatedFetch(`/users/${userId}`);
            if (userRes && userRes.ok) {
                const userData = await userRes.json();
                const roles = Array.isArray(userData.role) ? userData.role : [userData.role ?? "user"];
                if ('password' in userData) {
                    delete userData.password;
                }
                localStorage.setItem("user", JSON.stringify(userData));

                let dashboardRoute = "/login";
                if (roles.includes("gestor")) dashboardRoute = "/gestor/dashboard";
                else if (roles.includes("comite")) dashboardRoute = "/comite/dashboard";
                else if (roles.includes("rh")) dashboardRoute = "/rh/dashboard";
                else if (roles.includes("colaborador")) dashboardRoute = "/colaborador/dashboard";
                else if (roles.includes("admin")) dashboardRoute = "/admin/cycles";
                else dashboardRoute = "/login";
                navigate(dashboardRoute);
                window.location.reload();

            } else {
                setError("Erro ao buscar informações do usuário.");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        showPassword,
        isLoading,
        error,
        formData,
        handleInputChange,
        handleSubmit,
        setShowPassword,
        navigate,
    };
}

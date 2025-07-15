import { useState } from "react";
import type { FormData } from "../models/FormData";
import { authenticatedFetch } from "../utils/auth";
import { apiFetch } from "../utils/api";

export function useLoginController() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
    });

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
            const response = await apiFetch(import.meta.env.VITE_API_URL + "/auth/login", {
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
                    data.message?.toLowerCase().includes("password should not be empty") ||
                    data.message?.toLowerCase().includes("password is required")
                ) {
                    setError("Por favor, preencha o campo de senha");
                } else {
                    setError("Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.");
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
            const userRes = await authenticatedFetch(`${import.meta.env.VITE_API_URL}/users/${userId}`);
            if (userRes && userRes.ok) {
                const userData = await userRes.json();
                localStorage.setItem("user", JSON.stringify(userData));
                window.location.href = "/dashboard";
            } else {
                setError("Erro ao buscar informações do usuário.");
            }
        } catch (err) {
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
    };
}

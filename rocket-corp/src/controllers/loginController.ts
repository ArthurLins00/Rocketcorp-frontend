import { useState } from "react";
import type { FormData } from "../models/FormData";

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
        // Manual validation (Portuguese messages)
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
        // Simple email validation
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
            setError("Por favor, insira um e-mail válido");
            setIsLoading(false);
            return;
        }
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + "/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                // Treat backend error messages for known cases
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
            // Save access token in localStorage
            localStorage.setItem("access_token", data.access_token);
            // The refresh token is set in an HTTP-only cookie by the backend for security
            // and should NOT be stored in localStorage.
            // refresh token pra salvar no cookie 
            // Fetch user info
            const meRes = await fetch(import.meta.env.VITE_API_URL + "/auth/me", {
                headers: {
                    "Authorization": `Bearer ${data.access_token}`,
                },
            });
            if (meRes.ok) {
                const user = await meRes.json();
                localStorage.setItem("user", JSON.stringify(user));
            }
            window.location.href = "/dashboard";
        } catch (err) {
            setError("Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        showPassword,
        setShowPassword,
        isLoading,
        error,
        formData,
        handleInputChange,
        handleSubmit,
    };
}

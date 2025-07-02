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
        if (!formData.email || !formData.password) {
            setError("Por favor, preencha todos os campos");
            setIsLoading(false);
            return;
        }
        if (!formData.email.includes("@")) {
            setError("Por favor, insira um email válido");
            setIsLoading(false);
            return;
        }
        try {
            // chamada da API de login aqui
            // simular o login
            await new Promise((resolve) => setTimeout(resolve, 1500));
            if (formData.email === "demo@example.com" && formData.password === "password") {
                alert("Login bem sucedido!");
            } else {
                setError("Login ou senha incorretos");
            }
        } catch (err) {
            setError("Um erro ocorreu ao tentar fazer login. Por favor, tente novamente.");
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

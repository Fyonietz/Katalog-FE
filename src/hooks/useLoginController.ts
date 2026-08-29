// hooks/useLoginController.ts
import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginWithPassword, getRedirectPathByRole } from "../services/authService";

export function useLoginController() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { redirectTo?: string })?.redirectTo;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await loginWithPassword(email, password);
      localStorage.setItem("accessToken", result.token);
      navigate(getRedirectPathByRole(result.role, redirectTo), { replace: true });
    } catch (err) {
      setError("Email atau password salah.");
    } finally {
      setLoading(false);
    }
  }

  return { email, setEmail, password, setPassword, loading, error, handleSubmit };
}

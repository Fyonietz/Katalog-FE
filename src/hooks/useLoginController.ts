// hooks/useLoginController.ts
import { useState, type FormEvent } from "react";
import { loginWithPassword, loginWithGoogle } from "../services/authService";

export function useLoginController() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await loginWithPassword(email, password);
      localStorage.setItem("accessToken", result.accessToken);
      // TODO: redirect ke dashboard
    } catch (err) {
      setError("Email atau password salah.");
    } finally {
      setLoading(false);
    }
  }

function handleGoogleLogin(idToken: string): void {
  setLoading(true);
  loginWithGoogle(idToken)
    .then((result) => {
      localStorage.setItem("accessToken", result.token);
      // TODO: redirect ke dashboard
    })
    .catch(() => setError("Login Google gagal."))
    .finally(() => setLoading(false));
}

  return {
    email, setEmail,
    password, setPassword,
    loading, error,
    handleSubmit, handleGoogleLogin,
  };
}

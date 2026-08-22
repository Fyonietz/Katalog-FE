import {useNavigate,useLocation} from "react-router-dom"
import { useLoginController } from "../hooks/useLoginController";
import { GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "../services/authService";

export default function LoginPage() {
  const {
    email, setEmail,
    password, setPassword,
    loading, error,
    handleSubmit,
  } = useLoginController();

   const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = (location.state as { redirectTo?: string })?.redirectTo ?? "/shopping";
return (
    <div className="min-h-screen flex bg-[#F4F6FB]">

      {/* Panel kiri - brand, sembunyi di mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#1B2A6B] overflow-hidden flex-col justify-between p-12 text-white">
        <div>
          <p className="text-sm tracking-widest text-[#8FC2FA] font-semibold">
            NUSANTARA MANDIRI PRINTING
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-tight">
            Lengkapi Segala<br />Kebutuhan Percetakan<br />dan Digital Printing
          </h1>
          <p className="mt-4 text-[#AEB9E0] max-w-sm">
            Solusi cetak tanpa antri. Kelola order katalog produk kamu dalam satu dashboard.
          </p>
        </div>

        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#2E9DF7] rotate-45 opacity-20 rounded-3xl" />
        <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-[#2E9DF7] rotate-45 opacity-30 rounded-3xl" />

        <p className="relative text-xs text-[#8FA0D0]">
          Printing Expert Nomor 1 di Pekanbaru
        </p>
      </div>

      {/* Panel kanan - form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-[#1B2A6B]">Masuk</h2>
          <p className="mt-1 text-sm text-gray-500">Masuk untuk kelola katalog percetakan kamu.</p>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johndoe@email.com"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-[#2E9DF7] focus:border-[#2E9DF7]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-[#2E9DF7] focus:border-[#2E9DF7]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#1B2A6B] py-2.5 text-sm font-semibold text-white
                         hover:bg-[#15205A] transition disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">atau</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                if (!credentialResponse.credential) return;

                try {
                  const result = await loginWithGoogle(credentialResponse.credential);
                  localStorage.setItem("accessToken", result.token);
                  navigate(redirectTo,{replace : true})
                } catch {
                  // TODO: tampilkan error, sesuaikan pola error state kamu
                }
              }}
              onError={() => {
                console.error("Google login gagal di sisi client");
              }}
              theme="outline"
              shape="pill"
              text="signin_with"
              width="320"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

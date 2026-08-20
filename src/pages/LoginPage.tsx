// pages/LoginPage.tsx
import { useLoginController } from "../hooks/useLoginController";

export default function LoginPage() {
  const {
    email, setEmail,
    password, setPassword,
    loading, error,
    handleSubmit, handleGoogleLogin,
  } = useLoginController();

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
                placeholder="nama@perusahaan.com"
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

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="mt-6 w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300
                       py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 3l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.1 8.1 3l5.7-5.7C34.5 6.1 29.5 4 24 4c-7.4 0-13.7 4.2-16.9 10.4l-.8.3z"/>
              <path fill="#4CAF50" d="M24 44c5.4 0 10.3-2.1 13.9-5.5l-6.4-5.4c-2 1.4-4.6 2.3-7.5 2.3-5.2 0-9.7-3.3-11.3-8l-6.6 5.1C9.9 39.6 16.4 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.7l6.4 5.4C40.7 36.4 44 30.7 44 24c0-1.3-.1-2.7-.4-3.5z"/>
            </svg>
            Masuk dengan Google
          </button>
        </div>
      </div>
    </div>
  );
}

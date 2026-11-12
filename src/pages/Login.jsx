import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <div className="flex min-h-screen items-center justify-center text-slate-600">You are already signed in. <button className="ml-2 text-blue-700 underline" onClick={() => navigate("/")}>Continue</button></div>;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "We couldn't sign you in. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <Link to="/" className="mb-8 flex items-center justify-center gap-3" aria-label="EROH Shop home">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-700 text-lg font-bold text-white">ES</span>
          <span><span className="block text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">ERoh Shop</span><span className="block text-lg font-bold text-slate-900">Welcome back</span></span>
        </Link>
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-bold text-slate-950">Sign in to your account</h1>
          <p className="mt-2 text-sm text-slate-600">Access your cart, wishlist and shopping dashboard.</p>
        </div>
        {error && <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-medium text-slate-700">Username</label>
            <input id="username" name="username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" placeholder="Enter your username" required />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" placeholder="Enter your password" required />
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Signing in…" : "Sign in"}</button>
        </form>
        <p className="mt-7 text-center text-xs text-slate-500">Demo authentication is provided by DummyJSON. This is not production account security.</p>
        <p className="mt-4 text-center text-xs text-slate-400">© {new Date().getFullYear()} EROH Shop</p>
      </section>
    </main>
  );
};

export default LoginPage;

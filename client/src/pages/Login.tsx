import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import http from "../api/http";

// IMAGE
import bg from "../images/background.jpeg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Please enter a valid email.");
    setSubmitting(true);
    try {
      const { data } = await http.post("/users/sign-in", { email, password });
      localStorage.setItem("token", data.token);
      nav("/gallery");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (Array.isArray(err?.response?.data?.errors) && err.response.data.errors[0]?.msg) ||
        "Login failed. Check your email/password.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

return (
  <div className="relative min-h-screen flex items-center justify-center  w-screen px-4">
    {/* Background */}
    <img
      src={bg}
      alt=""
      className="pointer-events-none select-none absolute inset-0 -z-10 h-full w-screen  object-cover"
    />
  
    <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/20 via-black/20 to-black/40" />

    {/* Glass card */}
    <div className="absolute inset-0 grid place-items-center backdrop-blur-sm">
      <div className=" w-[480px] rounded-2xl p-8 bg-black/20 text-white ring-1 ring-white/10 shadow-xl">
        <h2 className="text-4xl font-semibold mb-6">Sign in</h2>
        {error && (
          <div className="mb-4 rounded-lg border border-rose-300/40 bg-rose-500/15 text-rose-200 px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/90">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-xl border-0
                         bg-white/10 px-3 py-2 text-white placeholder-white/60
                         shadow-sm focus:outline-none focus:ring-2 focus:ring-white/40"
              placeholder="mrmaki@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-xl border-0
                         bg-white/10 px-3 py-2 text-white placeholder-white/60
                         shadow-sm focus:outline-none focus:ring-2 focus:ring-white/40"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className=" w-[180px] inline-flex items-center justify-center rounded-2xl
                       bg-black/25 px-4 py-2.5 font-medium text-white
                       hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/40
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-sm text-white/80">
          Don’t have an account?{" "}
          <Link to="/sign-up" className="underline underline-offset-4 hover:text-white">
            Create one
          </Link>
        </p>
      </div>
    </div>
  </div>
);
}
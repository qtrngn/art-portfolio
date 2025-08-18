import { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import http from "../api/http";
import bg from "../images/background.jpeg";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const errorTimer = useRef<number | null>(null);
  const successTimer = useRef<number | null>(null);
  const nav = useNavigate();

  const pickSignupError = (err: any): string => {
    const status = err?.response?.status;
    const data = err?.response?.data;
    const errors = Array.isArray(data?.errors) ? data.errors : [];
    const first = errors[0];

    if (status === 409) return "This email is already registered.";

    if (typeof data?.message === "string" && data.message && data.message !== "Invalid value") {
      return data.message;
    }
    if (first?.msg && first.msg !== "Invalid value") return first.msg;

    switch (first?.param) {
      case "email":
        return "Please enter a valid email address.";
      case "password":
        return "Password must be at least 8 characters.";
      default:
        break;
    }


    if (err?.message === "Network Error") return "Network error. Please check your connection and try again.";
    return "Create account failed! Please check your details and try again.";
  };

  const showError = (msg: string, ms = 6000) => {
    setError(msg);
    if (errorTimer.current) clearTimeout(errorTimer.current);
    errorTimer.current = window.setTimeout(() => setError(null), ms);
  };

  const showSuccess = (msg: string, ms = 3000) => {
    setSuccess(msg);
    if (successTimer.current) clearTimeout(successTimer.current);
    successTimer.current = window.setTimeout(() => setSuccess(null), ms);
  };

  useEffect(() => {
    return () => {
      if (errorTimer.current) clearTimeout(errorTimer.current);
      if (successTimer.current) clearTimeout(successTimer.current);
    };
  }, []);


  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!/^\S+@\S+\.\S+$/.test(email)) return showError("Please enter a valid email.");
    if (password.length < 8) return showError("Password must be at least 8 characters.");
    if (password !== confirm) return showError("Passwords do not match.");

    setSubmitting(true);
    try {
      await http.post("/users", { email, password });
      showSuccess("Account created! Redirecting to login…");
      setTimeout(() => nav("/login", { replace: true }), 1000);
    } catch (err: any) {
      showError(pickSignupError(err));
    } finally {
      setSubmitting(false);
    }
  };

 
  return (
    <div className="relative min-h-screen flex items-center justify-center w-full px-4">
      {/* Background */}
      <img
        src={bg}
        alt=""
        className="pointer-events-none select-none absolute inset-0 -z-20 w-full h-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/20 via-black/20 to-black/40" />

      
      <div className="absolute inset-0 grid place-items-center backdrop-blur-sm">
        {/* Card */}
        <div className="w-[480px] rounded-2xl p-8 bg-black/20 text-white ring-1 ring-white/10 shadow-xl  ">
          <h2 className="text-4xl font-semibold mb-6">Create account...</h2>

          {success && (
            <div
              aria-live="polite"
              className="mb-4 rounded-lg border border-emerald-300/40 bg-emerald-500/15 text-emerald-200 px-3 py-2"
            >
              {success}
            </div>
          )}
          {error && (
            <div
              aria-live="polite"
              className="mb-4 rounded-lg border border-rose-300/40 bg-rose-500/15 text-rose-200 px-3 py-2"
            >
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/90">Email</label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-xl border-0 bg-white/10 px-3 py-2 text-white placeholder-white/60 shadow-sm focus:outline-none focus:ring-2 focus:ring-white/40"
                placeholder="mrmaki@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90">Password</label>
              <input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-xl border-0 bg-white/10 px-3 py-2 text-white placeholder-white/60 shadow-sm focus:outline-none focus:ring-2 focus:ring-white/40"
                placeholder="At least 8 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90">Confirm Password</label>
              <input
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="mt-1 block w-full rounded-xl border-0 bg-white/10 px-3 py-2 text-white placeholder-white/60 shadow-sm focus:outline-none focus:ring-2 focus:ring-white/40"
                placeholder="Repeat your password"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-[180px] items-center justify-center rounded-2xl
                         bg-black/25 px-4 py-2.5 font-medium text-white
                         hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40
                         disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {submitting ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-white/80">
            Already have an account?{" "}
            <Link to="/login" className="underline underline-offset-4 hover:text-black">
              Sign In!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

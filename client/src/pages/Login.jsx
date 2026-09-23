import { useState } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] =
    useState(false);

  /* =====================================================
     FORM UPDATE
  ===================================================== */
  const update = (event) => {
    const { name, value } =
      event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /* =====================================================
     LOGIN
  ===================================================== */
  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError('');

    if (
      !form.email.trim() ||
      !form.password
    ) {
      setError(
        'Please enter your email and password.'
      );
      return;
    }

    try {
      setLoading(true);

      await login({
        email: form.email.trim(),
        password: form.password,
      });

      navigate(
        location.state?.from
          ?.pathname || '/',
        {
          replace: true,
        }
      );
    } catch (err) {
      setError(
        err?.response?.data
          ?.message ||
          err?.message ||
          'Unable to sign in. Please check your details.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* =================================================
            LEFT DARK PANEL
        ================================================== */}
        <section className="relative hidden min-h-screen overflow-hidden bg-[#0d1b33] lg:flex lg:flex-col">

          {/* Background glow */}
          <div className="pointer-events-none absolute -left-28 -top-28 h-[420px] w-[420px] rounded-full bg-[#2563eb]/15 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-32 -right-24 h-[430px] w-[430px] rounded-full bg-[#60a5fa]/10 blur-3xl" />

          {/* =================================================
              BRAND
          ================================================== */}
          <div className="relative z-10 flex items-center px-12 pt-10 xl:px-16">
            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563eb] text-sm font-bold text-white shadow-lg shadow-blue-950/20">
                C
              </div>

              <span className="text-[20px] font-bold tracking-[-0.025em] text-white">
                CodeAlpha Store
              </span>
            </Link>
          </div>

          {/* =================================================
              MAIN LEFT CONTENT
          ================================================== */}
          <div className="relative z-10 flex flex-1 items-start px-12 pb-10 pt-16 xl:px-16 xl:pt-20">
            <div className="w-full max-w-[520px]">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-[12px] font-semibold text-blue-200">
                <span className="h-2 w-2 rounded-full bg-blue-400" />

                Modern technology,
                simplified
              </div>

              {/* Heading */}
              <h1 className="mt-7 text-[46px] font-bold leading-[1.08] tracking-[-0.04em] text-white xl:text-[50px]">
                Your technology.
                <br />
                Your orders.
                <br />
                One simple store.
              </h1>

              {/* Description */}
              <p className="mt-6 max-w-[470px] text-[16px] leading-7 text-slate-300">
                Sign in to browse the
                CodeAlpha collection,
                manage your cart, place
                orders and keep track of
                your purchases.
              </p>

              {/* =================================================
                  FEATURE CARDS
              ================================================== */}
              <div className="mt-10 grid max-w-[500px] gap-3 sm:grid-cols-2">

                {/* Shop Products */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M4 7h16v13H4z" />
                      <path d="M8 7a4 4 0 0 1 8 0" />
                    </svg>
                  </div>

                  <p className="mt-3 text-[13px] font-semibold text-white">
                    Shop products
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-slate-400">
                    Browse real products,
                    stock and pricing.
                  </p>
                </div>

                {/* Track Orders */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M5 4h14v16H5z" />
                      <path d="M8 8h8" />
                      <path d="M8 12h8" />
                      <path d="M8 16h5" />
                    </svg>
                  </div>

                  <p className="mt-3 text-[13px] font-semibold text-white">
                    Track orders
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-slate-400">
                    Access your real
                    purchase history.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              LEFT FOOTER
          ================================================== */}
          <div className="relative z-10 flex items-center justify-between border-t border-white/10 px-12 py-6 text-[11px] text-slate-500 xl:px-16">
            <p>
              Full-Stack E-commerce Project
            </p>

            <p>
              CodeAlpha Internship
            </p>
          </div>
        </section>

        {/* =================================================
            RIGHT LOGIN AREA
        ================================================== */}
        <main className="flex min-h-screen items-center justify-center bg-[#f8f9ff] px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-[460px]">

            {/* =================================================
                MOBILE BRAND
            ================================================== */}
            <div className="mb-10 lg:hidden">
              <Link
                to="/"
                className="flex items-center gap-2.5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563eb] text-sm font-bold text-white">
                  C
                </div>

                <span className="text-[20px] font-bold tracking-[-0.025em] text-[#0b1c30]">
                  CodeAlpha Store
                </span>
              </Link>
            </div>

            {/* =================================================
                LOGIN CARD
            ================================================== */}
            <section className="rounded-3xl border border-[rgba(195,198,215,0.55)] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)] sm:p-9">

              {/* Heading */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#e9f0ff] px-3 py-1 text-[11px] font-bold text-[#004ac6]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2563eb]" />

                  Member access
                </div>

                <h2 className="mt-5 text-[32px] font-bold leading-[1.15] tracking-[-0.03em] text-[#0b1c30]">
                  Welcome back
                </h2>

                <p className="mt-2 text-[14px] leading-6 text-[#565e74]">
                  Sign in with the email
                  and password you
                  registered with.
                </p>
              </div>

              {/* =================================================
                  ERROR MESSAGE
              ================================================== */}
              {error && (
                <div
                  role="alert"
                  className="mt-6 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5"
                >
                  <div className="mt-0.5 shrink-0 text-red-600">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                      />

                      <path d="M12 8v5" />
                      <path d="M12 16h.01" />
                    </svg>
                  </div>

                  <p className="text-[12px] leading-5 text-red-700">
                    {error}
                  </p>
                </div>
              )}

              {/* =================================================
                  LOGIN FORM
              ================================================== */}
              <form
                onSubmit={handleSubmit}
                className="mt-7"
                noValidate
              >

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[13px] font-semibold text-[#0b1c30]"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <svg
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737686]"
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="2"
                      />

                      <path d="m3 7 9 6 9-6" />
                    </svg>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={update}
                      autoComplete="email"
                      placeholder="you@example.com"
                      required
                      className="
                        h-12 w-full

                        rounded-xl

                        border
                        border-[rgba(195,198,215,0.75)]

                        bg-white

                        pl-11 pr-4

                        text-[14px]
                        text-[#0b1c30]

                        outline-none

                        transition

                        placeholder:text-[#9ca3af]

                        focus:border-[#2563eb]
                        focus:ring-2
                        focus:ring-blue-100
                      "
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mt-5">
                  <label
                    htmlFor="password"
                    className="mb-2 block text-[13px] font-semibold text-[#0b1c30]"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <svg
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737686]"
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <rect
                        x="5"
                        y="10"
                        width="14"
                        height="11"
                        rx="2"
                      />

                      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    </svg>

                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={update}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      required
                      className="
                        h-12 w-full

                        rounded-xl

                        border
                        border-[rgba(195,198,215,0.75)]

                        bg-white

                        pl-11 pr-4

                        text-[14px]
                        text-[#0b1c30]

                        outline-none

                        transition

                        placeholder:text-[#9ca3af]

                        focus:border-[#2563eb]
                        focus:ring-2
                        focus:ring-blue-100
                      "
                    />
                  </div>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    mt-7

                    flex h-12 w-full
                    items-center
                    justify-center
                    gap-2

                    rounded-xl

                    bg-[#2563eb]

                    px-5

                    text-[14px]
                    font-bold
                    text-white

                    shadow-[0_8px_20px_rgba(37,99,235,0.18)]

                    transition

                    hover:bg-[#1d4ed8]

                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <span>→</span>
                    </>
                  )}
                </button>
              </form>

              {/* =================================================
                  REGISTER LINK
              ================================================== */}
              <div className="mt-7 border-t border-[rgba(195,198,215,0.4)] pt-6 text-center">
                <p className="text-[13px] text-[#565e74]">
                  New to CodeAlpha Store?{' '}

                  <Link
                    to="/register"
                    className="font-bold text-[#004ac6] transition hover:text-[#003ca1]"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </section>

            {/* =================================================
                RIGHT FOOTNOTE
            ================================================== */}
            <p className="mt-6 text-center text-[11px] text-[#8b8e99]">
              CodeAlpha Store · Full-Stack
              E-commerce Project
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
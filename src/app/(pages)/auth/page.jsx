"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthPage = () => {
  const router = useRouter();
  const [mode, setMode] = useState("login"); // "login" | "signup"

  // loading / error states
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // shared
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // signup only
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touchedConfirm, setTouchedConfirm] = useState(false);

  // Check if user is already logged in with valid token
  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const localToken = typeof window !== "undefined" ? localStorage.getItem("job_portal_token") : null;
        
        const res = await fetch("/api/auth", {
          headers: localToken ? { Authorization: `Bearer ${localToken}` } : {},
        });
        const data = await res.json();

        if (isMounted) {
          if (data.authenticated && data.user) {
            // Already logged in! Redirect to /home
            router.replace("/home");
            return;
          }
          setIsCheckingSession(false);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        if (isMounted) setIsCheckingSession(false);
      }
    }

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const criteria = useMemo(() => {
    return {
      length: password.length >= 6 && password.length <= 12,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
    };
  }, [password]);

  const passwordValid =
    criteria.length && criteria.upper && criteria.lower;

  const passwordsMatch =
    confirmPassword.length > 0 && confirmPassword === password;

  const signupEnabled =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    passwordValid &&
    passwordsMatch;

  const switchMode = (next) => {
    if (next === mode) return;
    setMode(next);
    setPassword("");
    setConfirmPassword("");
    setTouchedConfirm(false);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const payload = {
        action: mode,
        email: email.trim(),
        password,
        ...(mode === "signup" ? { name: name.trim() } : {}),
      };

      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Authentication failed. Please try again.");
        setIsLoading(false);
        return;
      }

      // Save token to localStorage for client-side API requests
      if (data.token) {
        localStorage.setItem("job_portal_token", data.token);
        localStorage.setItem("job_portal_user", JSON.stringify(data.user));
      }

      setSuccessMessage(mode === "signup" ? "Account created! Redirecting..." : "Logged in! Redirecting...");

      // Redirect to home page
      setTimeout(() => {
        router.push("/home");
      }, 500);
    } catch (err) {
      console.error("Auth error:", err);
      setErrorMessage("Network error or server unreachable. Please try again.");
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="auth-splash">
        <style>{splashStyles}</style>
        <div className="splash-card">
          <div className="splash-spinner" />
          <p>Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="authpage">
      <style>{styles}</style>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <div className="authpage__grid">
        {/* Left brand panel */}
        <div className="brand">
          <span className="brand__mark">
            North<span className="brand__mark-dot">beam</span>
          </span>

          <div className="brand__body">
            <h1 className="brand__title">
              Find jobs not posted
              <br />
              on LinkedIn or Indeed
            </h1>
            <p className="brand__subtitle">
              Company career pages and hiring team posts, scanned daily —
              days before they reach the big job boards.
            </p>
          </div>

          <div className="brand__proof">
            <div className="brand__proof-item">
              <span className="brand__proof-num">38,000+</span>
              <span className="brand__proof-label">unlisted roles found</span>
            </div>
            <span className="brand__proof-divider" />
            <div className="brand__proof-item">
              <span className="brand__proof-num">2,600</span>
              <span className="brand__proof-label">companies scanned daily</span>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="formside">
          <div className="formcard">
            <div className="toggle" role="tablist" aria-label="Auth mode">
              <button
                type="button"
                role="tab"
                aria-selected={mode === "login"}
                className={
                  "toggle__btn" + (mode === "login" ? " toggle__btn--active" : "")
                }
                onClick={() => switchMode("login")}
              >
                Log in
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "signup"}
                className={
                  "toggle__btn" + (mode === "signup" ? " toggle__btn--active" : "")
                }
                onClick={() => switchMode("signup")}
              >
                Sign up
              </button>
              <span
                className={
                  "toggle__thumb" +
                  (mode === "signup" ? " toggle__thumb--right" : "")
                }
              />
            </div>

            {errorMessage && (
              <div className="alert alert--error">
                <span className="alert__icon">⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="alert alert--success">
                <span className="alert__icon">✓</span>
                <span>{successMessage}</span>
              </div>
            )}

            {mode === "login" ? (
              <>
                <div className="formcard__head">
                  <h2 className="formcard__title">Welcome back</h2>
                  <p className="formcard__subtitle">
                    Log in to keep tracking your matches.
                  </p>
                </div>

                <form className="form" onSubmit={handleSubmit}>
                  <label className="field">
                    <span className="field__label">Email</span>
                    <input
                      type="email"
                      className="field__input"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </label>

                  <label className="field">
                    <span className="field__label">Password</span>
                    <input
                      type="password"
                      className="field__input"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                  </label>

                  <button
                    type="submit"
                    className="submit"
                    disabled={isLoading || !email || !password}
                  >
                    {isLoading ? "Signing in..." : "Log in"}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="formcard__head">
                  <h2 className="formcard__title">Create your account</h2>
                  <p className="formcard__subtitle">
                    Start seeing roles before they're listed anywhere.
                  </p>
                </div>

                <form className="form" onSubmit={handleSubmit}>
                  <label className="field">
                    <span className="field__label">Name</span>
                    <input
                      type="text"
                      className="field__input"
                      placeholder="Jordan Casey"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      required
                    />
                  </label>

                  <label className="field">
                    <span className="field__label">Email</span>
                    <input
                      type="email"
                      className="field__input"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </label>

                  <label className="field">
                    <span className="field__label">Password</span>
                    <input
                      type="password"
                      className="field__input"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                    />
                  </label>

                  <ul className="criteria">
                    <li
                      className={
                        "criteria__item" +
                        (criteria.length ? " criteria__item--pass" : "")
                      }
                    >
                      <span className="criteria__mark" />
                      6–12 characters
                    </li>
                    <li
                      className={
                        "criteria__item" +
                        (criteria.upper ? " criteria__item--pass" : "")
                      }
                    >
                      <span className="criteria__mark" />
                      One uppercase letter
                    </li>
                    <li
                      className={
                        "criteria__item" +
                        (criteria.lower ? " criteria__item--pass" : "")
                      }
                    >
                      <span className="criteria__mark" />
                      One lowercase letter
                    </li>
                  </ul>

                  <label className="field">
                    <span className="field__label">Confirm password</span>
                    <input
                      type="password"
                      className={
                        "field__input" +
                        (touchedConfirm && confirmPassword.length > 0
                          ? passwordsMatch
                            ? " field__input--ok"
                            : " field__input--error"
                          : "")
                      }
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => setTouchedConfirm(true)}
                      autoComplete="new-password"
                      required
                    />
                    {touchedConfirm &&
                      confirmPassword.length > 0 &&
                      !passwordsMatch && (
                        <span className="field__hint field__hint--error">
                          Passwords don't match
                        </span>
                      )}
                  </label>

                  <button
                    type="submit"
                    className="submit"
                    disabled={!signupEnabled || isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create account"}
                  </button>
                </form>
              </>
            )}

            <p className="formcard__switch">
              {mode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="formcard__switch-link"
                    onClick={() => switchMode("signup")}
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="formcard__switch-link"
                    onClick={() => switchMode("login")}
                  >
                    Log in
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;


const styles = `
  * {
    box-sizing: border-box;
  }

  .authpage {
    --paper: #FBFBFD;
    --panel: #FFFFFF;
    --ink: #14121C;
    --ink-soft: #5B5867;
    --ink-faint: #8B889A;
    --blue: #3B6FE0;
    --blue-soft: #EAF0FE;
    --violet: #7C5CFF;
    --violet-soft: #F1EDFF;
    --line: #E4E1EC;
    --line-strong: #D4D0E0;
    --blue-dot: rgba(255, 255, 255, 0.22);
    --on-blue-soft: rgba(255, 255, 255, 0.78);
    --on-blue-faint: rgba(255, 255, 255, 0.6);
    --on-blue-line: rgba(255, 255, 255, 0.28);
    --error: #D64545;
    --success: #2E9E63;

    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--paper);
    color: var(--ink);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  .authpage__grid {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  /* ---------- Left brand panel ---------- */

  .brand {
    background-color: var(--blue);
    background-image: radial-gradient(var(--blue-dot) 1.5px, transparent 1.5px);
    background-size: 22px 22px;
    color: #FFFFFF;
    padding: 48px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .brand__mark {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  .brand__mark-dot {
    color: var(--violet-soft);
  }

  .brand__body {
    max-width: 420px;
  }

  .brand__title {
    font-size: 38px;
    line-height: 1.14;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin: 0 0 16px;
  }

  .brand__subtitle {
    font-size: 16px;
    line-height: 1.6;
    color: var(--on-blue-soft);
    margin: 0;
  }

  .brand__proof {
    display: flex;
    align-items: center;
    gap: 24px;
    padding-top: 28px;
    border-top: 1px solid var(--on-blue-line);
    max-width: 420px;
  }

  .brand__proof-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .brand__proof-num {
    font-size: 19px;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  .brand__proof-label {
    font-size: 12.5px;
    color: var(--on-blue-faint);
  }

  .brand__proof-divider {
    width: 1px;
    height: 30px;
    background: var(--on-blue-line);
  }

  /* ---------- Right form panel ---------- */

  .formside {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 32px;
  }

  .formcard {
    width: 100%;
    max-width: 380px;
  }

  /* Toggle */

  .toggle {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: var(--blue-soft);
    border-radius: 10px;
    padding: 4px;
    margin-bottom: 32px;
  }

  .toggle__thumb {
    position: absolute;
    top: 4px;
    left: 4px;
    width: calc(50% - 4px);
    height: calc(100% - 8px);
    background: #FFFFFF;
    border-radius: 7px;
    border: 1px solid var(--line);
    transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .toggle__thumb--right {
    transform: translateX(100%);
  }

  .toggle__btn {
    position: relative;
    z-index: 1;
    background: transparent;
    border: none;
    padding: 10px 0;
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    color: var(--ink-faint);
    cursor: pointer;
    border-radius: 7px;
    transition: color 0.18s ease;
  }

  .toggle__btn--active {
    color: var(--ink);
  }

  /* Head */

  .formcard__head {
    margin-bottom: 28px;
  }

  .formcard__title {
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.015em;
    margin: 0 0 6px;
  }

  .formcard__subtitle {
    font-size: 14.5px;
    color: var(--ink-soft);
    margin: 0;
  }

  /* Form */

  .form {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .field__label {
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
  }

  .field__input {
    font-family: inherit;
    font-size: 14.5px;
    padding: 11px 14px;
    border-radius: 9px;
    border: 1px solid var(--line-strong);
    background: var(--panel);
    color: var(--ink);
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  .field__input::placeholder {
    color: var(--ink-faint);
  }

  .field__input:focus {
    border-color: var(--blue);
  }

  .field__input--ok {
    border-color: var(--success);
  }

  .field__input--error {
    border-color: var(--error);
  }

  .field__hint {
    font-size: 12.5px;
  }

  .field__hint--error {
    color: var(--error);
  }

  .form__forgot {
    align-self: flex-end;
    font-size: 13px;
    font-weight: 500;
    color: var(--blue);
    margin-top: -6px;
  }

  .form__forgot:hover {
    color: var(--violet);
  }

  /* Password criteria */

  .criteria {
    list-style: none;
    margin: -6px 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .criteria__item {
    display: flex;
    align-items: center;
    gap: 9px;
    font-size: 13px;
    color: var(--ink-faint);
    transition: color 0.18s ease;
  }

  .criteria__mark {
    width: 15px;
    height: 15px;
    flex-shrink: 0;
    border-radius: 50%;
    border: 1.5px solid var(--line-strong);
    background: var(--panel);
    position: relative;
    transition: background 0.18s ease, border-color 0.18s ease;
  }

  .criteria__mark::after {
    content: "";
    position: absolute;
    left: 4.5px;
    top: 1.5px;
    width: 4px;
    height: 8px;
    border-right: 1.5px solid #FFFFFF;
    border-bottom: 1.5px solid #FFFFFF;
    transform: rotate(45deg);
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  .criteria__item--pass {
    color: var(--ink);
  }

  .criteria__item--pass .criteria__mark {
    background: var(--success);
    border-color: var(--success);
  }

  .criteria__item--pass .criteria__mark::after {
    opacity: 1;
  }

  /* Submit */

  .submit {
    font-family: inherit;
    font-size: 15px;
    font-weight: 600;
    padding: 12px 0;
    margin-top: 4px;
    border-radius: 9px;
    border: none;
    background: var(--blue);
    color: #FFFFFF;
    cursor: pointer;
    transition: background 0.15s ease, opacity 0.15s ease;
  }

  .submit:hover:not(:disabled) {
    background: #2F5BC4;
  }

  .submit:disabled {
    background: var(--line-strong);
    color: var(--ink-faint);
    cursor: not-allowed;
  }

  .formcard__switch {
    text-align: center;
    font-size: 13.5px;
    color: var(--ink-soft);
    margin: 26px 0 0;
  }

  .formcard__switch-link {
    font-family: inherit;
    font-size: inherit;
    font-weight: 600;
    color: var(--blue);
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
  }

  .formcard__switch-link:hover {
    color: var(--violet);
  }

  /* Alert messages */
  .alert {
    padding: 12px 14px;
    border-radius: 9px;
    font-size: 13.5px;
    font-weight: 500;
    line-height: 1.4;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    animation: fadeIn 0.2s ease;
  }

  .alert--error {
    background: #FEECEB;
    color: #C02C2C;
    border: 1px solid #F8BEBD;
  }

  .alert--success {
    background: #EDF9F0;
    color: #1E7E45;
    border: 1px solid #B8E8C8;
  }

  .alert__icon {
    font-size: 15px;
    flex-shrink: 0;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* ---------- Responsive ---------- */

  @media (max-width: 900px) {
    .authpage__grid {
      grid-template-columns: 1fr;
    }

    .brand {
      padding: 36px 32px;
    }

    .brand__title {
      font-size: 28px;
    }

    .brand__body {
      max-width: none;
    }
  }

  @media (max-width: 520px) {
    .formside {
      padding: 40px 24px;
    }
  }
`;

const splashStyles = `
  .auth-splash {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #FBFBFD;
    font-family: 'Inter', -apple-system, sans-serif;
  }

  .splash-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    color: #5B5867;
    font-size: 14px;
    font-weight: 500;
  }

  .splash-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #E4E1EC;
    border-top-color: #3B6FE0;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
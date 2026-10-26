
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { loginUser } from "../../services/authService";
import "./login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email address and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(email, password);

      console.log("Login response:", data);

      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
      localStorage.setItem("role", data.role);

      if (data.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (data.role === "TEACHER") {
        navigate("/teacher/dashboard");
      } else if (data.role === "STUDENT") {
        navigate("/student/dashboard");
      } else if (data.role === "PARENT") {
        navigate("/parent/dashboard");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error("Login error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Invalid email address or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* =========================================
          LEFT BRAND SECTION
      ========================================= */}

      <div className="login-left">

        <div className="login-brand">

          <span className="login-brand-label">
            ACADEMIC MANAGEMENT PLATFORM
          </span>

          <h1>
            Academic Scheduling
            <br />
            &amp; Management
          </h1>

          <p>
            Simplify academic planning, scheduling,
            and everyday school operations through
            one centralized platform.
          </p>

          <div className="login-features">

            <div className="login-feature">
              <span>✓</span>
              <p>Centralized academic management</p>
            </div>

            <div className="login-feature">
              <span>✓</span>
              <p>Efficient timetable scheduling</p>
            </div>

            <div className="login-feature">
              <span>✓</span>
              <p>Connected school administration</p>
            </div>

          </div>

        </div>

      </div>


      {/* =========================================
          RIGHT LOGIN SECTION
      ========================================= */}

      <div className="login-right">

        <div className="login-card">

          {/* BRAND ICON */}

          <div className="login-logo">
            <span>◆</span>
          </div>


          {/* HEADING */}

          <div className="login-heading">

            <h2>
              Welcome back
            </h2>

            <p>
              Sign in to access your academic workspace.
            </p>

          </div>


          {/* ERROR */}

          {error && (
            <div className="login-error">
              <span className="login-error-icon">
                !
              </span>

              <span>
                {error}
              </span>
            </div>
          )}


          {/* LOGIN FORM */}

          <form onSubmit={handleLogin}>

            {/* EMAIL */}

            <div className="form-group">

              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />

            </div>


            {/* PASSWORD */}

            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign in to your workspace"}
            </button>

          </form>


          {/* REGISTER */}

          <div className="register-link">

            <span>
              New to the platform?
            </span>

            <Link to="/register">
              Create an account
            </Link>

          </div>


          {/* FOOTER */}

          <div className="login-footer">
            Academic Scheduling &amp; Management
          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;
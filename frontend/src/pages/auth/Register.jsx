import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, saveAuthData } from "../../services/authService";
import "./register.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Full name validation
    if (formData.fullName.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    // Email validation
    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    // Phone validation
    if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      setError("Phone number must contain exactly 10 digits.");
      return;
    }

    // Password validation
    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const data = await registerUser(
        formData.fullName,
        formData.email,
        formData.password,
        formData.phoneNumber,
        formData.role
      );

      // Backend returns JWT after registration
      saveAuthData(data);

      // Redirect based on role
      if (data.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (data.role === "TEACHER") {
        navigate("/teacher/dashboard");
      } else if (data.role === "PARENT") {
        navigate("/parent/dashboard");
      } else {
        navigate("/student/dashboard");
      }

    } catch (err) {
      console.error(err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-container">

        {/* Logo */}
        <div className="register-logo">

          <div className="register-logo-box">
            ST
          </div>

          <div>
            <h1>Schedule</h1>
            <span>Timetable</span>
          </div>

        </div>


        {/* Card */}
        <div className="register-card">

          <div className="register-heading">
            <h2>Create Account</h2>

            <p>
              Create your account to manage your timetable
            </p>
          </div>


          {/* Error */}
          {error && (
            <div className="register-error">
              {error}
            </div>
          )}


          <form onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className="form-group">

              <label>
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />

            </div>


            {/* Email */}
            <div className="form-group">

              <label>
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>


            {/* Phone */}
            <div className="form-group">

              <label>
                Phone Number
              </label>

              <input
                type="tel"
                name="phoneNumber"
                placeholder="Enter 10 digit phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
                maxLength="10"
                required
              />

            </div>


            {/* Role */}
            <div className="form-group">

              <label>
                Role
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="STUDENT">
                  Student
                </option>

                <option value="TEACHER">
                  Teacher
                </option>

                <option value="PARENT">
                  Parent
                </option>
              </select>

            </div>


            {/* Password */}
            <div className="form-group">

              <label>
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />

            </div>


            {/* Confirm Password */}
            <div className="form-group">

              <label>
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

            </div>


            {/* Submit */}
            <button
              type="submit"
              className="register-btn"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>


          {/* Login */}
          <div className="login-link">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Login
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Register;
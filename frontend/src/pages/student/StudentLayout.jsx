import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./student-layout.css";

const StudentLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const studentName =
    localStorage.getItem("studentName") || "Student";

  const email =
    localStorage.getItem("email") || "prabha@gmail.com";

  const getInitial = () => {
    return studentName
      ? studentName.charAt(0).toUpperCase()
      : "S";
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("studentName");
    localStorage.removeItem("email");
    localStorage.removeItem("studentId");

    navigate("/login");
  };

  return (
    <div className="student-layout">

      {/* ================= SIDEBAR ================= */}

      <aside className="student-sidebar">

        {/* BRAND */}

        <div className="student-brand">

          <div className="student-brand-logo">
            ST
          </div>

          <div className="student-brand-text">

            <h2>
              ScheduleTimeTable
            </h2>

            <span>
              Student Portal
            </span>

          </div>

        </div>


        {/* MENU */}

        <div className="student-menu">

          <div className="student-menu-title">
            MAIN MENU
          </div>


          <Link
            to="/student/dashboard"
            className={
              `student-menu-item ${
                isActive("/student/dashboard")
                  ? "active"
                  : ""
              }`
            }
          >

            <span className="student-menu-icon">
              ⌂
            </span>

            <span>
              Dashboard
            </span>

          </Link>


          <Link
            to="/student/timetable"
            className={
              `student-menu-item ${
                isActive("/student/timetable")
                  ? "active"
                  : ""
              }`
            }
          >

            <span className="student-menu-icon">
              ▦
            </span>

            <span>
              My Timetable
            </span>

          </Link>


          <Link
            to="/student/subjects"
            className={
              `student-menu-item ${
                isActive("/student/subjects")
                  ? "active"
                  : ""
              }`
            }
          >

            <span className="student-menu-icon">
              📚
            </span>

            <span>
              My Subjects
            </span>

          </Link>


          <Link
            to="/student/calendar"
            className={
              `student-menu-item ${
                isActive("/student/calendar")
                  ? "active"
                  : ""
              }`
            }
          >

            <span className="student-menu-icon">
              □
            </span>

            <span>
              Academic Calendar
            </span>

          </Link>


          <Link
            to="/student/profile"
            className={
              `student-menu-item ${
                isActive("/student/profile")
                  ? "active"
                  : ""
              }`
            }
          >

            <span className="student-menu-icon">
              👤
            </span>

            <span>
              My Profile
            </span>

          </Link>

        </div>


        {/* SIDEBAR BOTTOM */}

        <div className="student-sidebar-bottom">

          <div className="student-user-card">

            <div className="student-avatar">
              {getInitial()}
            </div>

            <div className="student-user-info">

              <strong>
                {studentName}
              </strong>

              <span>
                {email}
              </span>

            </div>

          </div>


          <button
            className="student-logout-button"
            onClick={handleLogout}
          >

            <span>
              ↪
            </span>

            Logout

          </button>

        </div>

      </aside>


      {/* ================= MAIN ================= */}

      <div className="student-main">

        {/* TOP HEADER */}

        <header className="student-topbar">

          <div className="student-page-title">

            {location.pathname ===
              "/student/dashboard"
              ? "Student Dashboard"
              : location.pathname ===
                "/student/timetable"
              ? "My Timetable"
              : "Student Portal"}

          </div>


          <div className="student-topbar-right">

            <button className="student-notification">
              🔔
            </button>

            <div className="student-top-avatar">
              {getInitial()}
            </div>

          </div>

        </header>


        {/* ================= PAGE CONTENT ================= */}

        <main className="student-content">

          {children}

        </main>

      </div>

    </div>
  );
};

export default StudentLayout;
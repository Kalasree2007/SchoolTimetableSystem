import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/authService";
import "./teacher-layout.css";

const TeacherLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const teacherName =
    localStorage.getItem("teacherName") || "Teacher";

  const teacherEmail =
    localStorage.getItem("email") || "";

  return (
    <div className="teacher-layout">

      {/* ================= SIDEBAR ================= */}

      <aside className="teacher-sidebar">

        {/* BRAND */}

        <div className="teacher-sidebar-brand">

          <div className="teacher-sidebar-logo">
            ST
          </div>

          <div>
            <h2>ScheduleTimeTable</h2>
            <span>Teacher Portal</span>
          </div>

        </div>


        {/* NAVIGATION */}

        <nav className="teacher-sidebar-nav">

          <p className="teacher-nav-title">
            MAIN MENU
          </p>

          <NavLink
            to="/teacher/dashboard"
            className={({ isActive }) =>
              `teacher-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span>⌂</span>
            <span>Dashboard</span>
          </NavLink>


          <NavLink
            to="/teacher/timetable"
            className={({ isActive }) =>
              `teacher-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span>▦</span>
            <span>My Timetable</span>
          </NavLink>


          <NavLink
            to="/teacher/schedule"
            className={({ isActive }) =>
              `teacher-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span>◷</span>
            <span>My Schedule</span>
          </NavLink>


          <NavLink
            to="/teacher/calendar"
            className={({ isActive }) =>
              `teacher-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span>□</span>
            <span>Academic Calendar</span>
          </NavLink>

        </nav>


        {/* BOTTOM USER AREA */}

        <div className="teacher-sidebar-bottom">

          <div className="teacher-sidebar-user">

            <div className="teacher-sidebar-avatar">
              {teacherName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>

              <strong>
                {teacherName}
              </strong>

              <span>
                {teacherEmail}
              </span>

            </div>

          </div>


          <button
            className="teacher-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </aside>


      {/* ================= MAIN ================= */}

      <div className="teacher-main">

        {/* TOPBAR */}

        <header className="teacher-topbar">

          <div>
            <span>
              Teacher Dashboard
            </span>
          </div>


          <div className="teacher-topbar-right">

            <div className="teacher-notification">
              🔔
            </div>

            <div className="teacher-topbar-avatar">

              {teacherName
                .charAt(0)
                .toUpperCase()}

            </div>

            <div className="teacher-topbar-user">

              <strong>
                {teacherName}
              </strong>

              <span>
                Teacher
              </span>

            </div>

          </div>

        </header>


        {/* PAGE CONTENT */}

        <main className="teacher-content">
          {children}
        </main>

      </div>

    </div>
  );
};

export default TeacherLayout;
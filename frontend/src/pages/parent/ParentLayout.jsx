import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./parent-layout.css";

const ParentLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="parent-layout">

      {/* ================= SIDEBAR ================= */}

      <aside className="parent-sidebar">

        <div className="parent-sidebar-logo">

          <div className="parent-logo-icon">
            ST
          </div>

          <div>
            <h2>School Timetable</h2>
            <span>Parent Portal</span>
          </div>

        </div>


        {/* ================= NAVIGATION ================= */}

        <nav className="parent-navigation">

          <span className="parent-nav-title">
            MAIN MENU
          </span>

          <NavLink
            to="/parent/dashboard"
            className={({ isActive }) =>
              `parent-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span>🏠</span>
            <span>Dashboard</span>
          </NavLink>


          <NavLink
            to="/parent/child"
            className={({ isActive }) =>
              `parent-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span>👨‍🎓</span>
            <span>My Child</span>
          </NavLink>


          <NavLink
            to="/parent/timetable"
            className={({ isActive }) =>
              `parent-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span>🗓️</span>
            <span>Timetable</span>
          </NavLink>


          <NavLink
            to="/parent/subjects"
            className={({ isActive }) =>
              `parent-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span>📚</span>
            <span>Subjects</span>
          </NavLink>


          <NavLink
            to="/parent/calendar"
            className={({ isActive }) =>
              `parent-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span>📅</span>
            <span>Academic Calendar</span>
          </NavLink>


          <NavLink
            to="/parent/profile"
            className={({ isActive }) =>
              `parent-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span>👤</span>
            <span>My Profile</span>
          </NavLink>

        </nav>


        {/* ================= SIDEBAR FOOTER ================= */}

        <div className="parent-sidebar-footer">

          <button
            className="parent-logout-button"
            onClick={handleLogout}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>

        </div>

      </aside>


      {/* ================= MAIN AREA ================= */}

      <main className="parent-main">

        {/* TOP BAR */}

        <header className="parent-topbar">

          <div className="parent-topbar-left">

            <span className="parent-topbar-label">
              PARENT PORTAL
            </span>

          </div>


          <div className="parent-topbar-right">

            <button className="parent-notification">
              🔔
            </button>

            <div className="parent-user">

              <div className="parent-user-avatar">
                P
              </div>

              <div className="parent-user-info">
                <strong>Parent</strong>
                <span>Parent Account</span>
              </div>

            </div>

          </div>

        </header>


        {/* PAGE CONTENT */}

        <section className="parent-content">

          {children}

        </section>

      </main>

    </div>
  );
};

export default ParentLayout;
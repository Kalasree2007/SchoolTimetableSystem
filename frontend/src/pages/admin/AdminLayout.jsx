import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/authService";
import api from "../../services/api";
import "./AdminLayout.css";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const loadAdmin = async () => {
      try {
        const response = await api.get("/users/me");

        setAdmin(response.data);
      } catch (error) {
        console.error(
          "Unable to load admin profile:",
          error
        );
      }
    };

    loadAdmin();
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

const menuItems = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: "🏠",
  },
  {
    name: "Departments",
    path: "/admin/departments",
    icon: "🏢",
  },
  {
    name: "Teachers",
    path: "/admin/teachers",
    icon: "👨‍🏫",
  },
  {
    name: "Students",
    path: "/admin/students",
    icon: "🎓",
  },
  {
    name: "Parents",
    path: "/admin/parents",
    icon: "👨‍👩‍👧",
  },
  {
    name: "Subjects",
    path: "/admin/subjects",
    icon: "📚",
  },
  {
    name: "Classes",
    path: "/admin/classes",
    icon: "🏫",
  },
  {
    name: "TimeSlots",
    path: "/admin/timeslots",
    icon: "⏰",
  },
  {
    name: "Timetable",
    path: "/admin/timetable",
    icon: "📋",
  },
  {
    name: "Rooms",
    path: "/admin/rooms",
    icon: "🚪",
  },
  {
    name: "Academic Calendar",
    path: "/admin/calendar",
    icon: "📅",
  },
];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const adminName =
    admin?.fullName || admin?.username || "";

  const adminRole =
    admin?.role || "";

  const adminInitial =
    adminName
      ? adminName.charAt(0).toUpperCase()
      : "";

  return (
    <div className="admin-layout">

      <aside className="admin-sidebar">

        {/* LOGO */}

        <div className="admin-logo">

          <div className="admin-logo-box">
            ST
          </div>

          <div className="admin-logo-text">

            <h2>
              Schedule
            </h2>

            <span>
              Timetable
            </span>

          </div>

        </div>

        <nav className="admin-navigation">

          <p className="nav-title">
            MAIN MENU
          </p>

          {menuItems.map((item) => (

            <Link
              key={item.path}
              to={item.path}
              className={
                isActive(item.path)
                  ? "admin-nav-item active"
                  : "admin-nav-item"
              }
            >

              <span className="nav-icon">
                {item.icon}
              </span>

              <span>
                {item.name}
              </span>

            </Link>

          ))}

        </nav>

        <div className="sidebar-bottom">

          <button
            className="logout-button"
            onClick={handleLogout}
          >

            <span className="nav-icon">
              ↪
            </span>

            Logout

          </button>

        </div>

      </aside>

      <div className="admin-main">

        <header className="admin-topbar">

          <div>

            <h3>
              School Timetable Management
            </h3>

            <span>
              Administration Panel
            </span>

          </div>



          <div className="admin-profile">

            <div className="notification">
              🔔
            </div>

            <div className="profile-avatar">
              {adminInitial}
            </div>

            <div className="profile-info">

              <strong>
                {adminName}
              </strong>

              <span>
                {adminRole}
              </span>

            </div>

          </div>

        </header>


        {/* PAGE CONTENT */}

        <main className="admin-content">

          {children}

        </main>

      </div>

    </div>
  );
};

export default AdminLayout;

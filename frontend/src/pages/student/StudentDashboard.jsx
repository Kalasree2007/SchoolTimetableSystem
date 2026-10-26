import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./student-dashboard.css";

const StudentDashboard = () => {
  const [studentName, setStudentName] = useState("Student");
  const [email, setEmail] = useState("-");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const response = await api.get("/users/me");

        console.log("Current student:", response.data);

        const user = response.data;

        if (user.fullName) {
          setStudentName(user.fullName);
          localStorage.setItem("studentName", user.fullName);
        }

        if (user.email) {
          setEmail(user.email);
          localStorage.setItem("studentEmail", user.email);
        }
      } catch (error) {
        console.error(
          "Unable to load student information:",
          error
        );

        const savedName =
          localStorage.getItem("studentName");

        const savedEmail =
          localStorage.getItem("studentEmail");

        if (savedName) {
          setStudentName(savedName);
        }

        if (savedEmail) {
          setEmail(savedEmail);
        }
      } finally {
        setLoading(false);
      }
    };

    loadStudentData();
  }, []);

  const today = new Date();

  const formattedDate = today.toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );

  if (loading) {
    return (
      <div className="student-dashboard-loading">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="student-dashboard-page">

      {/* ================= HEADER ================= */}

      <div className="student-dashboard-header">

        <div>
          <span className="student-page-label">
            STUDENT PORTAL
          </span>

          <h2>
            Student Dashboard
          </h2>

          <p>
            Welcome back,{" "}
            <strong>{studentName}</strong> 👋
          </p>
        </div>

        <div className="student-dashboard-date">

          <div className="student-date-icon">
            📅
          </div>

          <div>
            <small>TODAY</small>

            <strong>
              {formattedDate}
            </strong>
          </div>

        </div>

      </div>


      {/* ================= WELCOME CARD ================= */}

      <div className="student-welcome-card">

        <div className="student-welcome-content">

          <span className="welcome-small">
            GOOD TO SEE YOU
          </span>

          <h1>
            Hello, {studentName}! 👋
          </h1>

          <p>
            Stay organized, keep track of your classes,
            and make the most of your academic journey.
          </p>

          <Link
            to="/student/timetable"
            className="student-primary-button"
          >
            View My Timetable
          </Link>

        </div>

        <div className="student-welcome-illustration">
          🎓
        </div>

      </div>


      {/* ================= STATISTICS ================= */}

      <div className="student-stat-grid">

        <div className="student-stat-card">

          <div className="student-stat-icon blue">
            📚
          </div>

          <div>
            <span>Today's Classes</span>
            <strong>0</strong>
            <small>Classes today</small>
          </div>

        </div>


        <div className="student-stat-card">

          <div className="student-stat-icon purple">
            🗓️
          </div>

          <div>
            <span>Weekly Classes</span>
            <strong>0</strong>
            <small>This week</small>
          </div>

        </div>


        <div className="student-stat-card">

          <div className="student-stat-icon green">
            📖
          </div>

          <div>
            <span>My Subjects</span>
            <strong>0</strong>
            <small>Enrolled subjects</small>
          </div>

        </div>


        <div className="student-stat-card">

          <div className="student-stat-icon orange">
            📅
          </div>

          <div>
            <span>Upcoming Events</span>
            <strong>0</strong>
            <small>Academic events</small>
          </div>

        </div>

      </div>


      {/* ================= MAIN GRID ================= */}

      <div className="student-dashboard-grid">

        {/* TODAY'S CLASSES */}

        <div className="student-dashboard-card">

          <div className="student-card-header">

            <div>
              <h3>
                Today's Classes
              </h3>

              <span>
                Your class schedule for today
              </span>
            </div>

            <Link
              to="/student/timetable"
              className="student-view-link"
            >
              View Timetable →
            </Link>

          </div>


          <div className="student-empty-state">

            <div className="student-empty-icon">
              📚
            </div>

            <h4>
              No classes scheduled
            </h4>

            <p>
              Your classes for today will appear here.
            </p>

            <Link
              to="/student/timetable"
              className="student-outline-button"
            >
              Open Timetable
            </Link>

          </div>

        </div>


        {/* STUDENT INFORMATION */}

        <div className="student-dashboard-card">

          <div className="student-card-header">

            <div>
              <h3>
                My Information
              </h3>

              <span>
                Your account information
              </span>
            </div>

            <Link
              to="/student/profile"
              className="student-view-link"
            >
              Profile →
            </Link>

          </div>


          <div className="student-info-list">

            <div className="student-info-item">

              <div className="info-item-icon">
                👤
              </div>

              <div>
                <span>Name</span>
                <strong>{studentName}</strong>
              </div>

            </div>


            <div className="student-info-item">

              <div className="info-item-icon">
                ✉️
              </div>

              <div>
                <span>Email</span>
                <strong>{email}</strong>
              </div>

            </div>


            <div className="student-info-item">

              <div className="info-item-icon">
                🎓
              </div>

              <div>
                <span>Role</span>
                <strong>Student</strong>
              </div>

            </div>


            <div className="student-info-item">

              <div className="info-item-icon">
                🟢
              </div>

              <div>
                <span>Account Status</span>
                <strong className="active-text">
                  Active
                </strong>
              </div>

            </div>

          </div>

        </div>

      </div>


      {/* ================= QUICK ACCESS ================= */}

      <div className="student-dashboard-card student-quick-section">

        <div className="student-card-header">

          <div>
            <h3>
              Quick Access
            </h3>

            <span>
              Frequently used student features
            </span>
          </div>

        </div>


        <div className="student-quick-actions">

          <Link
            to="/student/timetable"
            className="student-quick-card"
          >

            <div className="quick-icon blue">
              🗓️
            </div>

            <div>
              <strong>
                My Timetable
              </strong>

              <small>
                View weekly class schedule
              </small>
            </div>

            <span className="quick-arrow">
              →
            </span>

          </Link>


          <Link
            to="/student/subjects"
            className="student-quick-card"
          >

            <div className="quick-icon purple">
              📚
            </div>

            <div>
              <strong>
                My Subjects
              </strong>

              <small>
                View enrolled subjects
              </small>
            </div>

            <span className="quick-arrow">
              →
            </span>

          </Link>


          <Link
            to="/student/calendar"
            className="student-quick-card"
          >

            <div className="quick-icon green">
              📅
            </div>

            <div>
              <strong>
                Academic Calendar
              </strong>

              <small>
                View important academic events
              </small>
            </div>

            <span className="quick-arrow">
              →
            </span>

          </Link>


          <Link
            to="/student/profile"
            className="student-quick-card"
          >

            <div className="quick-icon orange">
              👤
            </div>

            <div>
              <strong>
                My Profile
              </strong>

              <small>
                View your student profile
              </small>
            </div>

            <span className="quick-arrow">
              →
            </span>

          </Link>

        </div>

      </div>

    </div>
  );
};

export default StudentDashboard;

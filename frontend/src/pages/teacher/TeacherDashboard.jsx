import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./teacher-dashboard.css";

const TeacherDashboard = () => {

  const [teacherName, setTeacherName] = useState("Teacher");
  const [email, setEmail] = useState("-");
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadTeacherData = async () => {

      try {

        const response = await api.get("/users/me");

        console.log("Current user:", response.data);

        const user = response.data;

        /*
         * UserResponse should contain fullName and email
         */

        if (user.fullName) {
          setTeacherName(user.fullName);

          // Save it for other teacher pages
          localStorage.setItem("teacherName", user.fullName);
        }

        if (user.email) {
          setEmail(user.email);
          localStorage.setItem("email", user.email);
        }

      } catch (error) {

        console.error("Unable to load teacher information:", error);

        /*
         * Fallback to localStorage if API fails
         */
        const savedName =
          localStorage.getItem("teacherName");

        const savedEmail =
          localStorage.getItem("email");

        if (savedName) {
          setTeacherName(savedName);
        }

        if (savedEmail) {
          setEmail(savedEmail);
        }

      } finally {

        setLoading(false);

      }

    };

    loadTeacherData();

  }, []);


  const today = new Date();

  const formattedDate =
    today.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });


  if (loading) {
    return (
      <div className="teacher-dashboard-loading">
        Loading dashboard...
      </div>
    );
  }


  return (
    <div className="teacher-dashboard-page">

      {/* ================= HEADER ================= */}

      <div className="teacher-dashboard-header">

        <div>

          <h2>
            Welcome, {teacherName}
          </h2>

          <p>
            Here's an overview of your teaching activities.
          </p>

        </div>


        <div className="teacher-dashboard-date">

          <div className="date-icon">
            📅
          </div>

          <div>

            <small>
              TODAY
            </small>

            <strong>
              {formattedDate}
            </strong>

          </div>

        </div>

      </div>


      {/* ================= PROFILE ================= */}

      <div className="teacher-profile-card">

        <div className="teacher-profile-avatar">

          {teacherName
            ? teacherName.charAt(0).toUpperCase()
            : "T"}

        </div>


        <div className="teacher-profile-info">

          <h3>
            {teacherName}
          </h3>

          <span>
            Teacher
          </span>

          <small>
            {email}
          </small>

        </div>


        <div className="teacher-profile-status">
          Active
        </div>

      </div>


      {/* ================= STATISTICS ================= */}

      <div className="teacher-stat-grid">

        <div className="teacher-stat-card">

          <div className="teacher-stat-icon blue">
            📚
          </div>

          <div>

            <span>
              Today's Classes
            </span>

            <strong>
              0
            </strong>

          </div>

        </div>


        <div className="teacher-stat-card">

          <div className="teacher-stat-icon green">
            🗓
          </div>

          <div>

            <span>
              Weekly Classes
            </span>

            <strong>
              0
            </strong>

          </div>

        </div>


        <div className="teacher-stat-card">

          <div className="teacher-stat-icon purple">
            📖
          </div>

          <div>

            <span>
              Subjects
            </span>

            <strong>
              0
            </strong>

          </div>

        </div>


        <div className="teacher-stat-card">

          <div className="teacher-stat-icon red">
            🏫
          </div>

          <div>

            <span>
              Classes Assigned
            </span>

            <strong>
              0
            </strong>

          </div>

        </div>

      </div>


      {/* ================= MAIN GRID ================= */}

      <div className="teacher-dashboard-grid">


        {/* TODAY'S CLASSES */}

        <div className="teacher-dashboard-card">

          <div className="teacher-card-header">

            <div>

              <h3>
                Today's Classes
              </h3>

              <span>
                Your teaching schedule for today
              </span>

            </div>

            <Link
              to="/teacher/timetable"
              className="teacher-view-link"
            >
              View Timetable
            </Link>

          </div>


          <div className="teacher-dashboard-empty">

            <div className="teacher-empty-icon">
              📚
            </div>

            <h4>
              No classes available
            </h4>

            <p>
              Your classes will appear here once
              the timetable is assigned.
            </p>

          </div>

        </div>


        {/* TEACHER INFORMATION */}
            
        <div className="teacher-dashboard-card">

          <div className="teacher-card-header">

            <div>

              <h3>
                My Information
              </h3>

              <span>
                Account information
              </span>

            </div>

          </div>


          <div className="teacher-info-list">

            <div className="teacher-info-item">

              <span>
                Name
              </span>

              <strong>
                {teacherName}
              </strong>

            </div>


            <div className="teacher-info-item">

              <span>
                Email
              </span>

              <strong>
                {email}
              </strong>

            </div>


            <div className="teacher-info-item">

              <span>
                Role
              </span>

              <strong>
                Teacher
              </strong>

            </div>


            <div className="teacher-info-item">

              <span>
                Account Status
              </span>

              <strong>
                Active
              </strong>

            </div>

          </div>

        </div>

      </div>


      {/* ================= QUICK ACCESS ================= */}

      <div className="teacher-dashboard-card upcoming-card">

        <div className="teacher-card-header">

          <div>

            <h3>
              Quick Access
            </h3>

            <span>
              Frequently used teacher features
            </span>

          </div>

        </div>


        <div className="teacher-quick-actions">

          <Link
            to="/teacher/timetable"
            className="teacher-quick-card"
          >

            <span>
              ▦
            </span>

            <div>

              <strong>
                My Timetable
              </strong>

              <small>
                View weekly timetable
              </small>

            </div>

          </Link>


          <Link
            to="/teacher/schedule"
            className="teacher-quick-card"
          >

            <span>
              ◷
            </span>

            <div>

              <strong>
                My Schedule
              </strong>

              <small>
                View teaching schedule
              </small>

            </div>

          </Link>


          <Link
            to="/teacher/calendar"
            className="teacher-quick-card"
          >

            <span>
              □
            </span>

            <div>

              <strong>
                Academic Calendar
              </strong>

              <small>
                View academic events
              </small>

            </div>

          </Link>

        </div>

      </div>

    </div>
  );
};

export default TeacherDashboard;
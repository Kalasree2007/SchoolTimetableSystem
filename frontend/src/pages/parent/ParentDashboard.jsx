import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./parent-dashboard.css";

const ParentDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadParentDashboard();
  }, []);

  const loadParentDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * Do NOT call /parents here.
       *
       * /users/me is available to the logged-in user
       * and does not require ADMIN role.
       */
      const response = await api.get("/users/me");

      console.log("Logged-in parent:", response.data);

      if (!response.data) {
        throw new Error("Unable to identify logged-in parent.");
      }

      setUser(response.data);

      /*
       * Store basic parent information.
       */
      if (response.data.fullName) {
        localStorage.setItem(
          "parentName",
          response.data.fullName
        );
      }

      if (response.data.email) {
        localStorage.setItem(
          "parentEmail",
          response.data.email
        );
      }

      /*
       * The studentId should already be stored when the
       * parent is linked to a student.
       */
      const savedStudentId =
        localStorage.getItem("studentId");

      if (!savedStudentId) {
        console.warn(
          "No linked studentId found in localStorage."
        );
      }

    } catch (err) {
      console.error(
        "Unable to load parent dashboard:",
        err
      );

      console.error(
        "Status:",
        err.response?.status
      );

      console.error(
        "Backend response:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Unable to load parent dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

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

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="parent-dashboard-loading">

        <div className="parent-loading-icon">
          👨‍👩‍👧
        </div>

        <h3>Loading dashboard...</h3>

        <p>
          Please wait while we load your information.
        </p>

      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="parent-dashboard-page">

        <div className="parent-dashboard-header">

          <div>
            <span className="parent-page-label">
              PARENT PORTAL
            </span>

            <h2>
              Parent Dashboard
            </h2>

            <p>
              Manage and monitor your child's
              academic information.
            </p>
          </div>

          <div className="parent-dashboard-date-box">

            <div className="parent-date-icon">
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

        <div className="parent-dashboard-error">

          <div className="parent-error-icon">
            ⚠️
          </div>

          <h3>
            Unable to load dashboard
          </h3>

          <p>
            {error}
          </p>

          <button
            className="parent-retry-button"
            onClick={loadParentDashboard}
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // USER INFORMATION
  // =====================================================

  const parentName =
    user?.fullName ||
    localStorage.getItem("parentName") ||
    "Parent";

  const parentEmail =
    user?.email ||
    localStorage.getItem("parentEmail") ||
    "-";

  /*
   * These values come from the local browser state.
   *
   * They should have been saved when the admin linked
   * this parent to a student.
   */
  const studentId =
    localStorage.getItem("studentId") || "-";

  const studentName =
    localStorage.getItem("studentName") ||
    "My Child";

  const relationship =
    localStorage.getItem("parentRelationship") ||
    "Parent";

  const occupation =
    localStorage.getItem("parentOccupation") ||
    "Not provided";

  const address =
    localStorage.getItem("parentAddress") ||
    "Not provided";

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="parent-dashboard-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="parent-dashboard-header">

        <div>

          <span className="parent-page-label">
            PARENT PORTAL
          </span>

          <h2>
            Parent Dashboard
          </h2>

          <p>
            Welcome back,{" "}
            <strong>{parentName}</strong> 👋
          </p>

        </div>

        <div className="parent-dashboard-date-box">

          <div className="parent-date-icon">
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


      {/* =================================================
          WELCOME CARD
      ================================================= */}

      <div className="parent-welcome-card">

        <div className="parent-welcome-content">

          <span className="parent-welcome-small">
            WELCOME BACK
          </span>

          <h1>
            Hello, {parentName}! 👋
          </h1>

          <p>
            Stay connected with your child's
            academic journey. View their timetable,
            subjects, and important academic events
            from one place.
          </p>

          <Link
            to="/parent/timetable"
            className="parent-primary-button"
          >
            View Child Timetable
          </Link>

        </div>

        <div className="parent-welcome-illustration">
          👨‍👩‍👧
        </div>

      </div>


      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="parent-stat-grid">

        {/* CHILD */}

        <div className="parent-stat-card">

          <div className="parent-stat-icon blue">
            👨‍🎓
          </div>

          <div>

            <span>
              My Child
            </span>

            <strong>
              {studentId !== "-" ? "1" : "0"}
            </strong>

            <small>
              Linked student
            </small>

          </div>

        </div>


        {/* TIMETABLE */}

        <div className="parent-stat-card">

          <div className="parent-stat-icon purple">
            🗓️
          </div>

          <div>

            <span>
              Timetable
            </span>

            <strong>
              ✓
            </strong>

            <small>
              View weekly schedule
            </small>

          </div>

        </div>


        {/* SUBJECTS */}

        <div className="parent-stat-card">

          <div className="parent-stat-icon green">
            📚
          </div>

          <div>

            <span>
              Subjects
            </span>

            <strong>
              ✓
            </strong>

            <small>
              View child subjects
            </small>

          </div>

        </div>


        {/* CALENDAR */}

        <div className="parent-stat-card">

          <div className="parent-stat-icon orange">
            📅
          </div>

          <div>

            <span>
              Calendar
            </span>

            <strong>
              ✓
            </strong>

            <small>
              Academic events
            </small>

          </div>

        </div>

      </div>


      {/* =================================================
          MAIN GRID
      ================================================= */}

      <div className="parent-dashboard-grid">


        {/* =================================================
            CHILD CARD
        ================================================= */}

        <div className="parent-dashboard-card">

          <div className="parent-card-header">

            <div>

              <h3>
                My Child
              </h3>

              <span>
                Linked student information
              </span>

            </div>

            <Link
              to="/parent/child"
              className="parent-view-link"
            >
              View Details →
            </Link>

          </div>


          <div className="parent-child-profile">

            <div className="parent-child-avatar">
              🎓
            </div>

            <div className="parent-child-info">

              <span>
                STUDENT
              </span>

              <h3>
                {studentName}
              </h3>

              <p>
                Student ID: {studentId}
              </p>

            </div>

            <div className="parent-active-badge">
              Active
            </div>

          </div>


          {/* CHILD ACTIONS */}

          <div className="parent-child-actions">

            <Link
              to="/parent/timetable"
              className="parent-child-action"
            >

              <span>
                🗓️
              </span>

              <div>

                <strong>
                  Timetable
                </strong>

                <small>
                  View weekly classes
                </small>

              </div>

              <span>
                →
              </span>

            </Link>


            <Link
              to="/parent/subjects"
              className="parent-child-action"
            >

              <span>
                📚
              </span>

              <div>

                <strong>
                  Subjects
                </strong>

                <small>
                  View academic subjects
                </small>

              </div>

              <span>
                →
              </span>

            </Link>

          </div>

        </div>


        {/* =================================================
            PARENT INFORMATION
        ================================================= */}

        <div className="parent-dashboard-card">

          <div className="parent-card-header">

            <div>

              <h3>
                My Information
              </h3>

              <span>
                Your parent profile
              </span>

            </div>

            <Link
              to="/parent/profile"
              className="parent-view-link"
            >
              Profile →
            </Link>

          </div>


          <div className="parent-info-list">


            {/* NAME */}

            <div className="parent-info-item">

              <div className="parent-info-icon">
                👤
              </div>

              <div>

                <span>
                  Name
                </span>

                <strong>
                  {parentName}
                </strong>

              </div>

            </div>


            {/* EMAIL */}

            <div className="parent-info-item">

              <div className="parent-info-icon">
                ✉️
              </div>

              <div>

                <span>
                  Email
                </span>

                <strong>
                  {parentEmail}
                </strong>

              </div>

            </div>


            {/* RELATIONSHIP */}

            <div className="parent-info-item">

              <div className="parent-info-icon">
                👨‍👩‍👧
              </div>

              <div>

                <span>
                  Relationship
                </span>

                <strong>
                  {relationship}
                </strong>

              </div>

            </div>


            {/* OCCUPATION */}

            <div className="parent-info-item">

              <div className="parent-info-icon">
                💼
              </div>

              <div>

                <span>
                  Occupation
                </span>

                <strong>
                  {occupation}
                </strong>

              </div>

            </div>


            {/* ADDRESS */}

            <div className="parent-info-item">

              <div className="parent-info-icon">
                📍
              </div>

              <div>

                <span>
                  Address
                </span>

                <strong>
                  {address}
                </strong>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          QUICK ACCESS
      ================================================= */}

      <div className="parent-dashboard-card parent-quick-section">

        <div className="parent-card-header">

          <div>

            <h3>
              Quick Access
            </h3>

            <span>
              Frequently used parent features
            </span>

          </div>

        </div>


        <div className="parent-quick-actions">


          {/* CHILD */}

          <Link
            to="/parent/child"
            className="parent-quick-card"
          >

            <div className="parent-quick-icon blue">
              🎓
            </div>

            <div>

              <strong>
                My Child
              </strong>

              <small>
                View student information
              </small>

            </div>

            <span>
              →
            </span>

          </Link>


          {/* TIMETABLE */}

          <Link
            to="/parent/timetable"
            className="parent-quick-card"
          >

            <div className="parent-quick-icon purple">
              🗓️
            </div>

            <div>

              <strong>
                Child Timetable
              </strong>

              <small>
                View weekly class schedule
              </small>

            </div>

            <span>
              →
            </span>

          </Link>


          {/* SUBJECTS */}

          <Link
            to="/parent/subjects"
            className="parent-quick-card"
          >

            <div className="parent-quick-icon green">
              📚
            </div>

            <div>

              <strong>
                Child Subjects
              </strong>

              <small>
                View enrolled subjects
              </small>

            </div>

            <span>
              →
            </span>

          </Link>


          {/* CALENDAR */}

          <Link
            to="/parent/calendar"
            className="parent-quick-card"
          >

            <div className="parent-quick-icon orange">
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

            <span>
              →
            </span>

          </Link>

        </div>

      </div>

    </div>
  );
};

export default ParentDashboard;

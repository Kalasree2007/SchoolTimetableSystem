import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./parent-child.css";

const ParentChild = () => {
  const [user, setUser] = useState(null);
  const [parent, setParent] = useState(null);
  const [student, setStudent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD PARENT + CHILD INFORMATION
  // =====================================================

  const getParentData = async () => {
    try {
      setLoading(true);
      setError("");

      // -------------------------------------------------
      // 1. GET LOGGED-IN USER
      // -------------------------------------------------

      const userResponse = await api.get("/users/me");

      const loggedInUser = userResponse.data;

      console.log("Logged-in user:", loggedInUser);

      if (!loggedInUser || !loggedInUser.id) {
        throw new Error("Unable to identify the logged-in user.");
      }

      if (loggedInUser.role !== "PARENT") {
        throw new Error(
          "This page is available only for parent accounts."
        );
      }

      setUser(loggedInUser);

      // -------------------------------------------------
      // 2. FIND PARENT RECORD USING USER ID
      // -------------------------------------------------

      const parentResponse = await api.get(
        `/parents/user/${loggedInUser.id}`
      );

      const parentData = parentResponse.data;

      console.log("Parent record:", parentData);

      if (!parentData) {
        throw new Error(
          "Parent account is not linked to a parent record."
        );
      }

      setParent(parentData);

      // -------------------------------------------------
      // 3. GET LINKED STUDENT
      // -------------------------------------------------

      let studentData = parentData.student;

      const studentId =
        parentData.studentId ||
        parentData.student?.id;

      if (!studentData && studentId) {
        const studentResponse = await api.get(
          `/students/${studentId}`
        );

        studentData = studentResponse.data;
      }

      if (!studentData) {
        throw new Error(
          "No student is linked to this parent account."
        );
      }

      console.log("Linked student:", studentData);

      setStudent(studentData);

    } catch (err) {
      console.error(
        "Unable to load parent/child information:",
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
          err.message ||
          "Unable to load parent/child information."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    getParentData();
  }, []);

  // =====================================================
  // HELPERS
  // =====================================================

  const getStudentName = () => {
    return (
      student?.studentName ||
      student?.userFullName ||
      student?.fullName ||
      student?.user?.fullName ||
      student?.name ||
      "Not available"
    );
  };

  const getStudentEmail = () => {
    return (
      student?.userEmail ||
      student?.email ||
      student?.user?.email ||
      "Not available"
    );
  };

  const getParentName = () => {
    return (
      parent?.parentName ||
      parent?.userFullName ||
      parent?.fullName ||
      parent?.user?.fullName ||
      user?.fullName ||
      "Not available"
    );
  };

  const getParentEmail = () => {
    return (
      parent?.userEmail ||
      parent?.email ||
      parent?.user?.email ||
      user?.email ||
      "Not available"
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="parent-child-page">
        <div className="parent-child-card">

          <h1>Parent - Child Information</h1>

          <div className="loading-container">
            <div className="loading-spinner"></div>

            <p>
              Loading child information...
            </p>
          </div>

        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="parent-child-page">

        <div className="parent-child-card">

          <div className="page-header">

            <div>
              <span className="page-label">
                PARENT PORTAL
              </span>

              <h1>
                Parent - Child Information
              </h1>

              <p>
                View your registered parent and child information
              </p>
            </div>

          </div>

          <div className="error-box">

            <h3>
              Unable to Load Information
            </h3>

            <p>
              {error}
            </p>

          </div>

          <button
            className="retry-button"
            onClick={getParentData}
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // NO DATA
  // =====================================================

  if (!parent || !student) {
    return (
      <div className="parent-child-page">

        <div className="parent-child-card">

          <h1>
            Parent - Child Information
          </h1>

          <div className="empty-box">
            No parent or child information available.
          </div>

          <button
            className="retry-button"
            onClick={getParentData}
          >
            Refresh
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="parent-child-page">

      <div className="parent-child-card">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="page-header">

          <div>

            <span className="page-label">
              PARENT PORTAL
            </span>

            <h1>
              Parent - Child Information
            </h1>

            <p>
              View your registered parent and child information
            </p>

          </div>

          <div className="account-status">

            <span
              className={
                parent.active !== false
                  ? "status-dot active"
                  : "status-dot inactive"
              }
            ></span>

            <span>
              {parent.active !== false
                ? "Active"
                : "Inactive"}
            </span>

          </div>

        </div>

        {/* =================================================
            PARENT INFORMATION
        ================================================= */}

        <div className="information-section">

          <div className="section-title">

            <div className="section-icon parent-icon">
              👨‍👩‍👦
            </div>

            <div>

              <h2>
                Parent Information
              </h2>

              <p>
                Your registered parent details
              </p>

            </div>

          </div>

          <div className="information-grid">

            {/* Parent Name */}

            <div className="information-item">

              <span className="information-label">
                Parent Name
              </span>

              <span className="information-value">
                {getParentName()}
              </span>

            </div>

            {/* Relationship */}

            <div className="information-item">

              <span className="information-label">
                Relationship
              </span>

              <span className="information-value">
                {parent.relationship || "Not available"}
              </span>

            </div>

            {/* Occupation */}

            <div className="information-item">

              <span className="information-label">
                Occupation
              </span>

              <span className="information-value">
                {parent.occupation || "Not available"}
              </span>

            </div>

            {/* Address */}

            <div className="information-item">

              <span className="information-label">
                Address
              </span>

              <span className="information-value">
                {parent.address || "Not available"}
              </span>

            </div>

          </div>

        </div>

        {/* =================================================
            CHILD INFORMATION
        ================================================= */}

        <div className="information-section">

          <div className="section-title">

            <div className="section-icon child-icon">
              🎓
            </div>

            <div>

              <h2>
                Child Information
              </h2>

              <p>
                Information about your child
              </p>

            </div>

          </div>

          <div className="information-grid">

            {/* Student Name */}

            <div className="information-item">

              <span className="information-label">
                Student Name
              </span>

              <span className="information-value">
                {getStudentName()}
              </span>

            </div>

            {/* Student Email */}

            <div className="information-item">

              <span className="information-label">
                Student Email
              </span>

              <span className="information-value">
                {getStudentEmail()}
              </span>

            </div>

          </div>

        </div>

        {/* =================================================
            ACCOUNT INFORMATION
        ================================================= */}

        <div className="information-section">

          <div className="section-title">

            <div className="section-icon contact-icon">
              📧
            </div>

            <div>

              <h2>
                Account Information
              </h2>

              <p>
                Your registered parent account
              </p>

            </div>

          </div>

          <div className="information-grid">

            {/* Email */}

            <div className="information-item">

              <span className="information-label">
                Email
              </span>

              <span className="information-value">
                {getParentEmail()}
              </span>

            </div>

            {/* Role */}

            <div className="information-item">

              <span className="information-label">
                Role
              </span>

              <span className="information-value">
                {user?.role || "PARENT"}
              </span>

            </div>

            {/* Status */}

            <div className="information-item">

              <span className="information-label">
                Account Status
              </span>

              <span
                className={
                  parent.active !== false
                    ? "status-badge active-badge"
                    : "status-badge inactive-badge"
                }
              >
                {parent.active !== false
                  ? "Active"
                  : "Inactive"}
              </span>

            </div>

          </div>

        </div>

        {/* =================================================
            REFRESH
        ================================================= */}

        <div className="action-section">

          <button
            className="refresh-button"
            onClick={getParentData}
          >
            🔄 Refresh Information
          </button>

        </div>

      </div>

    </div>
  );
};

export default ParentChild;

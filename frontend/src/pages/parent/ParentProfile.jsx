import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./parent-profile.css";

const ParentProfile = () => {
  const [user, setUser] = useState(null);
  const [parent, setParent] = useState(null);
  const [student, setStudent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD PARENT PROFILE
  // =====================================================

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      // =====================================================
      // 1. GET LOGGED-IN USER
      // =====================================================

      const userResponse = await api.get("/users/me");

      const loggedInUser = userResponse.data;

      console.log("Logged-in user:", loggedInUser);

      if (!loggedInUser || !loggedInUser.id) {
        throw new Error(
          "Unable to identify logged-in user. Please login again."
        );
      }

      if (
        loggedInUser.role &&
        loggedInUser.role.toUpperCase() !== "PARENT"
      ) {
        throw new Error(
          "This profile page is available only for parent accounts."
        );
      }

      setUser(loggedInUser);

      // =====================================================
      // 2. GET PARENT USING USER ID
      // =====================================================

      const parentResponse = await api.get(
        `/parents/user/${loggedInUser.id}`
      );

      const parentData = parentResponse.data;

      console.log("Parent record:", parentData);

      if (!parentData) {
        throw new Error(
          "Parent record not found for this account."
        );
      }

      setParent(parentData);

      // =====================================================
      // 3. GET CHILD INFORMATION
      // =====================================================

      const childId =
        parentData.studentId ||
        parentData.student?.id ||
        parentData.childId ||
        parentData.child?.id;

      console.log("Child ID:", childId);

      if (childId) {
        try {
          const studentResponse = await api.get(
            `/students/${childId}`
          );

          console.log(
            "Child/student:",
            studentResponse.data
          );

          setStudent(studentResponse.data);
        } catch (studentError) {
          console.log(
            "Unable to load child information:",
            studentError
          );

          // If child details are already inside parent response
          setStudent(
            parentData.student ||
            parentData.child ||
            null
          );
        }
      } else {
        setStudent(
          parentData.student ||
          parentData.child ||
          null
        );
      }

    } catch (err) {
      console.error(
        "Unable to load parent profile:",
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
        "Unable to load profile."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadProfile();
  }, []);

  // =====================================================
  // HELPERS
  // =====================================================

  const getParentName = () => {
    return (
      parent?.parentName ||
      parent?.name ||
      user?.fullName ||
      "Parent"
    );
  };

  const getEmail = () => {
    return (
      user?.email ||
      parent?.email ||
      "-"
    );
  };

  const getPhone = () => {
    return (
      parent?.phoneNumber ||
      parent?.phone ||
      user?.phoneNumber ||
      user?.phone ||
      "-"
    );
  };

  const getRelationship = () => {
    return (
      parent?.relationship ||
      parent?.relation ||
      "-"
    );
  };

  const getOccupation = () => {
    return (
      parent?.occupation ||
      "-"
    );
  };

  const getAddress = () => {
    return (
      parent?.address ||
      "-"
    );
  };

  const getChildName = () => {
    return (
      student?.studentName ||
      student?.name ||
      student?.user?.fullName ||
      parent?.studentName ||
      parent?.student?.studentName ||
      parent?.student?.user?.fullName ||
      "Not Assigned"
    );
  };

  const getChildId = () => {
    return (
      student?.id ||
      student?.studentId ||
      parent?.studentId ||
      parent?.student?.id ||
      "-"
    );
  };

  const getUserId = () => {
    return (
      user?.id ||
      parent?.userId ||
      "-"
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="parent-profile-page">

        <div className="parent-profile-loading">

          <div className="parent-loading-icon">
            👤
          </div>

          <h3>
            Loading profile...
          </h3>

          <p>
            Fetching your parent account information.
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="parent-profile-page">

        <div className="parent-profile-error">

          <div className="parent-error-icon">
            ⚠️
          </div>

          <h2>
            Unable to load profile
          </h2>

          <p>
            {error}
          </p>

          <button
            className="parent-retry-button"
            onClick={loadProfile}
          >
            🔄 Try Again
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="parent-profile-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="parent-profile-header">

        <div>

          <span className="parent-profile-label">
            PARENT PORTAL
          </span>

          <h1>
            My Profile
          </h1>

          <p>
            View and manage your parent account information.
          </p>

        </div>

        <div className="parent-profile-header-icon">
          👤
        </div>

      </div>


      {/* =================================================
          PROFILE HERO
      ================================================= */}

      <div className="parent-profile-hero">

        <div className="parent-profile-avatar">
          {getParentName()
            .charAt(0)
            .toUpperCase()}
        </div>

        <div className="parent-profile-hero-content">

          <span>
            PARENT ACCOUNT
          </span>

          <h2>
            {getParentName()}
          </h2>

          <p>
            {getEmail()}
          </p>

          <div className="parent-profile-status">
            <span className="parent-status-dot"></span>
            {parent?.active === false ||
            parent?.status === "INACTIVE"
              ? "Inactive"
              : "Active"}
          </div>

        </div>

      </div>


      {/* =================================================
          INFORMATION GRID
      ================================================= */}

      <div className="parent-profile-grid">

        {/* =================================================
            PERSONAL INFORMATION
        ================================================= */}

        <div className="parent-profile-card">

          <div className="parent-card-header">

            <div className="parent-card-icon">
              👤
            </div>

            <div>
              <h3>
                Personal Information
              </h3>

              <p>
                Your registered parent details
              </p>
            </div>

          </div>


          <div className="parent-profile-details">

            <div className="parent-detail-item">

              <span>
                Full Name
              </span>

              <strong>
                {getParentName()}
              </strong>

            </div>


            <div className="parent-detail-item">

              <span>
                Email
              </span>

              <strong>
                {getEmail()}
              </strong>

            </div>


            <div className="parent-detail-item">

              <span>
                Phone
              </span>

              <strong>
                {getPhone()}
              </strong>

            </div>


            <div className="parent-detail-item">

              <span>
                Relationship
              </span>

              <strong>
                {getRelationship()}
              </strong>

            </div>


            <div className="parent-detail-item">

              <span>
                Occupation
              </span>

              <strong>
                {getOccupation()}
              </strong>

            </div>


            <div className="parent-detail-item full-width">

              <span>
                Address
              </span>

              <strong>
                {getAddress()}
              </strong>

            </div>

          </div>

        </div>


        {/* =================================================
            ACCOUNT INFORMATION
        ================================================= */}

        <div className="parent-profile-card">

          <div className="parent-card-header">

            <div className="parent-card-icon">
              🔐
            </div>

            <div>
              <h3>
                Account Information
              </h3>

              <p>
                Your account details
              </p>
            </div>

          </div>


          <div className="parent-profile-details">

            <div className="parent-detail-item">

              <span>
                User ID
              </span>

              <strong>
                {getUserId()}
              </strong>

            </div>


            <div className="parent-detail-item">

              <span>
                Parent ID
              </span>

              <strong>
                {parent?.id || "-"}
              </strong>

            </div>


            <div className="parent-detail-item">

              <span>
                Role
              </span>

              <strong>
                {user?.role || "PARENT"}
              </strong>

            </div>


            <div className="parent-detail-item">

              <span>
                Account Status
              </span>

              <strong className="parent-account-active">
                {parent?.active === false ||
                parent?.status === "INACTIVE"
                  ? "Inactive"
                  : "Active"}
              </strong>

            </div>

          </div>

        </div>


        {/* =================================================
            CHILD INFORMATION
        ================================================= */}

        <div className="parent-profile-card parent-child-card">

          <div className="parent-card-header">

            <div className="parent-card-icon">
              👨‍👩‍👦
            </div>

            <div>
              <h3>
                Child Information
              </h3>

              <p>
                Student linked to your account
              </p>
            </div>

          </div>


          <div className="parent-profile-details">

            <div className="parent-detail-item">

              <span>
                Student ID
              </span>

              <strong>
                {getChildId()}
              </strong>

            </div>


            <div className="parent-detail-item">

              <span>
                Student Name
              </span>

              <strong>
                {getChildName()}
              </strong>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          REFRESH
      ================================================= */}

      <div className="parent-profile-actions">

        <button
          className="parent-refresh-button"
          onClick={loadProfile}
        >
          🔄 Refresh Profile
        </button>

      </div>

    </div>
  );
};

export default ParentProfile;

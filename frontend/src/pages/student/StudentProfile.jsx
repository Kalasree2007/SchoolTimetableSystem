import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./student-profile.css";

const StudentProfile = () => {
  const [profile, setProfile] = useState({
    id: null,
    fullName: "Student",
    email: "-",
    phoneNumber: "-",
    admissionNumber: "-",
    admissionDate: "-",
    rollNumber: "-",
    semester: "-",
    className: "-",
    active: true,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        // ---------------------------------------------
        // 1. Get logged-in user
        // ---------------------------------------------
        const userResponse = await api.get("/users/me");

        const user = userResponse.data;

        console.log("Logged-in user:", user);

        if (!user) {
          throw new Error("Unable to identify logged-in user.");
        }

        // ---------------------------------------------
        // 2. Basic user information
        // ---------------------------------------------
        let profileData = {
          id: user.id,
          fullName: user.fullName || "Student",
          email: user.email || "-",
          phoneNumber: user.phoneNumber || "-",
          admissionNumber: "-",
          admissionDate: "-",
          rollNumber: "-",
          semester: "-",
          className: "-",
          active: user.status
            ? user.status === "ACTIVE"
            : true,
        };

        // ---------------------------------------------
        // 3. Student information
        // ---------------------------------------------
        //
        // User object may already contain student data.
        //
        if (user.student) {
          profileData = {
            ...profileData,

            admissionNumber:
              user.student.admissionNumber || "-",

            admissionDate:
              user.student.admissionDate || "-",

            rollNumber:
              user.student.rollNumber || "-",

            semester:
              user.student.semester || "-",

            className:
              user.student.className ||
              user.student.classEntity?.className ||
              "-",

            active:
              user.student.active !== undefined
                ? user.student.active
                : profileData.active,
          };
        }

        // ---------------------------------------------
        // 4. Fallback using saved student ID
        // ---------------------------------------------
        //
        // If /users/me does not serialize student data,
        // try the saved student ID.
        //
        const savedStudentId =
          localStorage.getItem("studentId");

        if (
          savedStudentId &&
          profileData.admissionNumber === "-"
        ) {
          try {
            const studentResponse =
              await api.get(
                `/students/${savedStudentId}`
              );

            const student =
              studentResponse.data;

            console.log(
              "Student profile:",
              student
            );

            if (student) {
              profileData = {
                ...profileData,

                id:
                  student.id ||
                  profileData.id,

                admissionNumber:
                  student.admissionNumber ||
                  "-",

                admissionDate:
                  student.admissionDate ||
                  "-",

                rollNumber:
                  student.rollNumber ||
                  "-",

                semester:
                  student.semester ||
                  "-",

                className:
                  student.className ||
                  student.classEntity?.className ||
                  "-",

                fullName:
                  student.fullName ||
                  student.userName ||
                  profileData.fullName,

                email:
                  student.email ||
                  profileData.email,

                active:
                  student.active !== undefined
                    ? student.active
                    : profileData.active,
              };
            }
          } catch (studentError) {
            console.warn(
              "Student profile endpoint unavailable:",
              studentError
            );
          }
        }

        // ---------------------------------------------
        // 5. Save useful information
        // ---------------------------------------------

        localStorage.setItem(
          "studentName",
          profileData.fullName
        );

        localStorage.setItem(
          "studentEmail",
          profileData.email
        );

        if (profileData.id) {
          localStorage.setItem(
            "studentId",
            String(profileData.id)
          );
        }

        setProfile(profileData);

      } catch (err) {
        console.error(
          "Unable to load student profile:",
          err
        );

        setError(
          err.response?.data?.message ||
          err.message ||
          "Unable to load student profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const formatDate = (date) => {
    if (!date || date === "-") {
      return "-";
    }

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      );
    } catch {
      return date;
    }
  };

  if (loading) {
    return (
      <div className="student-profile-page">
        <div className="student-profile-loading">
          <div className="profile-loading-icon">
            👤
          </div>

          <h3>
            Loading profile...
          </h3>

          <p>
            Please wait while we load your
            student information.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-profile-page">

        <div className="student-profile-header">
          <div>
            <span className="student-profile-label">
              STUDENT PORTAL
            </span>

            <h2>
              My Profile
            </h2>

            <p>
              View your student account information.
            </p>
          </div>

          <div className="profile-header-icon">
            👤
          </div>
        </div>

        <div className="student-profile-error">

          <div className="profile-error-icon">
            ⚠️
          </div>

          <h3>
            Unable to load profile
          </h3>

          <p>
            {error}
          </p>

          <button
            className="profile-retry-button"
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="student-profile-page">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="student-profile-header">

        <div>
          <span className="student-profile-label">
            STUDENT PORTAL
          </span>

          <h2>
            My Profile
          </h2>

          <p>
            View your personal and academic
            information.
          </p>
        </div>

        <div className="profile-header-icon">
          👤
        </div>

      </div>


      {/* =========================================
          PROFILE HERO
      ========================================= */}

      <div className="student-profile-hero">

        <div className="student-avatar">
          {profile.fullName
            ?.charAt(0)
            ?.toUpperCase() || "S"}
        </div>

        <div className="student-profile-hero-info">

          <span>
            STUDENT
          </span>

          <h1>
            {profile.fullName}
          </h1>

          <p>
            {profile.email}
          </p>

        </div>

        <div
          className={
            profile.active
              ? "profile-status active"
              : "profile-status inactive"
          }
        >
          <span className="status-dot"></span>

          {profile.active
            ? "Active"
            : "Inactive"}
        </div>

      </div>


      {/* =========================================
          INFORMATION GRID
      ========================================= */}

      <div className="student-profile-sections">

        {/* PERSONAL INFORMATION */}

        <div className="student-profile-card">

          <div className="profile-card-heading">

            <div className="profile-section-icon blue">
              👤
            </div>

            <div>
              <h3>
                Personal Information
              </h3>

              <p>
                Your registered account details
              </p>
            </div>

          </div>


          <div className="profile-info-grid">

            <div className="profile-info-item">
              <span>
                Full Name
              </span>

              <strong>
                {profile.fullName}
              </strong>
            </div>


            <div className="profile-info-item">
              <span>
                Email Address
              </span>

              <strong>
                {profile.email}
              </strong>
            </div>


            <div className="profile-info-item">
              <span>
                Phone Number
              </span>

              <strong>
                {profile.phoneNumber}
              </strong>
            </div>


            <div className="profile-info-item">
              <span>
                Role
              </span>

              <strong>
                Student
              </strong>
            </div>

          </div>

        </div>


        {/* ACADEMIC INFORMATION */}

        <div className="student-profile-card">

          <div className="profile-card-heading">

            <div className="profile-section-icon purple">
              🎓
            </div>

            <div>
              <h3>
                Academic Information
              </h3>

              <p>
                Your student academic details
              </p>
            </div>

          </div>


          <div className="profile-info-grid">

            <div className="profile-info-item">
              <span>
                Admission Number
              </span>

              <strong>
                {profile.admissionNumber}
              </strong>
            </div>


            <div className="profile-info-item">
              <span>
                Admission Date
              </span>

              <strong>
                {formatDate(
                  profile.admissionDate
                )}
              </strong>
            </div>


            <div className="profile-info-item">
              <span>
                Roll Number
              </span>

              <strong>
                {profile.rollNumber}
              </strong>
            </div>


            <div className="profile-info-item">
              <span>
                Semester
              </span>

              <strong>
                {profile.semester}
              </strong>
            </div>


            <div className="profile-info-item">
              <span>
                Class
              </span>

              <strong>
                {profile.className}
              </strong>
            </div>


            <div className="profile-info-item">
              <span>
                Account Status
              </span>

              <strong
                className={
                  profile.active
                    ? "profile-active-text"
                    : "profile-inactive-text"
                }
              >
                {profile.active
                  ? "Active"
                  : "Inactive"}
              </strong>
            </div>

          </div>

        </div>

      </div>


      {/* =========================================
          PROFILE FOOTER
      ========================================= */}

      <div className="student-profile-note">

        <div className="profile-note-icon">
          🔒
        </div>

        <div>
          <strong>
            Profile Information
          </strong>

          <p>
            Your profile information is managed
            by the school administration. Contact
            the administrator if any information
            needs to be updated.
          </p>
        </div>

      </div>

    </div>
  );
};

export default StudentProfile;
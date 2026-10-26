import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./academic-calendar.css";

const TeacherAcademicCalendar = () => {
  const [events, setEvents] = useState([]);
  const [teacherName, setTeacherName] = useState("Teacher");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD ACADEMIC CALENDAR
  // ==========================================

  const loadCalendar = async () => {
    try {
      setLoading(true);
      setError("");

      // ==========================================
      // GET LOGGED-IN TEACHER
      // ==========================================

      try {
        const userResponse = await api.get("/users/me");

        console.log(
          "Logged-in teacher:",
          userResponse.data
        );

        const user = userResponse.data;

        const name =
          user?.fullName ||
          user?.name ||
          user?.username ||
          localStorage.getItem("teacherName") ||
          "Teacher";

        setTeacherName(name);

        localStorage.setItem(
          "teacherName",
          name
        );

        if (user?.email) {
          localStorage.setItem(
            "email",
            user.email
          );
        }
      } catch (userError) {
        console.log(
          "Unable to load teacher information:",
          userError
        );

        const savedName =
          localStorage.getItem("teacherName");

        if (savedName) {
          setTeacherName(savedName);
        }
      }

      // ==========================================
      // GET ACADEMIC CALENDAR
      //
      // Same endpoint used by StudentCalendar
      // Backend: /api/calendar
      // api.js already contains /api
      // ==========================================

      const response = await api.get("/calendar");

      console.log(
        "Academic calendar:",
        response.data
      );

      // ==========================================
      // VALIDATE RESPONSE
      // ==========================================

      if (!Array.isArray(response.data)) {
        throw new Error(
          "Invalid academic calendar data received."
        );
      }

      setEvents(response.data);

    } catch (err) {
      console.error(
        "Unable to load academic calendar:",
        err
      );

      if (err.response) {
        console.error(
          "Status:",
          err.response.status
        );

        console.error(
          "Server response:",
          err.response.data
        );
      }

      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to load academic calendar."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadCalendar();
  }, []);

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    try {
      const parsedDate = new Date(date);

      if (isNaN(parsedDate.getTime())) {
        return date;
      }

      return parsedDate.toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );

    } catch {
      return date;
    }
  };

  // ==========================================
  // EVENT ICON
  // ==========================================

  const getEventIcon = (eventType) => {
    const type =
      eventType?.toLowerCase() || "";

    if (type.includes("holiday")) {
      return "🏖️";
    }

    if (type.includes("exam")) {
      return "📝";
    }

    if (type.includes("semester")) {
      return "🎓";
    }

    if (type.includes("event")) {
      return "🎉";
    }

    return "📅";
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="academic-calendar-page">

        <div className="academic-calendar-loading">

          <div className="calendar-loading-icon">
            📅
          </div>

          <h3>
            Loading academic calendar...
          </h3>

          <p>
            Please wait while we load
            your academic events.
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="academic-calendar-page">

        <div className="academic-calendar-header">

          <div>

            <span className="calendar-label">
              TEACHER PORTAL
            </span>

            <h2>
              Academic Calendar
            </h2>

            <p>
              View important academic events,{" "}
              <strong>
                {teacherName}
              </strong>.
            </p>

          </div>

          <div className="academic-calendar-icon">
            📅
          </div>

        </div>

        <div className="academic-calendar-error">

          <div className="calendar-error-icon">
            ⚠️
          </div>

          <h3>
            Unable to load academic calendar
          </h3>

          <p>
            {error}
          </p>

          <button
            className="calendar-retry-btn"
            onClick={loadCalendar}
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (
    <div className="academic-calendar-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="academic-calendar-header">

        <div>

          <span className="calendar-label">
            TEACHER PORTAL
          </span>

          <h2>
            Academic Calendar
          </h2>

          <p>
            View important academic events,{" "}
            <strong>
              {teacherName}
            </strong>.
          </p>

        </div>

        <div className="academic-calendar-icon">
          📅
        </div>

      </div>


      {/* ======================================
          SUMMARY
      ====================================== */}

      <div className="calendar-summary">

        <div className="calendar-summary-icon">
          📅
        </div>

        <div>

          <span>
            ACADEMIC EVENTS
          </span>

          <strong>
            {events.length}
          </strong>

        </div>

      </div>


      {/* ======================================
          EMPTY
      ====================================== */}

      {events.length === 0 ? (

        <div className="academic-calendar-empty">

          <div className="calendar-empty-icon">
            📅
          </div>

          <h3>
            No academic events available
          </h3>

          <p>
            Academic events will appear here
            once they are added by the
            administrator.
          </p>

        </div>

      ) : (

        /* ====================================
           EVENTS
        ==================================== */

        <div className="academic-events-card">

          {/* CARD HEADER */}

          <div className="academic-events-header">

            <div>

              <h3>
                Academic Events
              </h3>

              <span>
                Important academic dates and events
              </span>

            </div>

            <div className="academic-events-count">

              {events.length}{" "}

              {events.length === 1
                ? "Event"
                : "Events"}

            </div>

          </div>


          {/* EVENT LIST */}

          <div className="academic-events-list">

            {events.map((event) => (

              <div
                className="academic-event-card"
                key={event.id}
              >

                {/* ICON */}

                <div className="academic-event-icon">

                  {getEventIcon(
                    event.eventType
                  )}

                </div>


                {/* DATE */}

                <div className="academic-event-date">

                  <span>
                    START DATE
                  </span>

                  <strong>
                    {formatDate(
                      event.startDate
                    )}
                  </strong>

                  {event.endDate &&
                    event.endDate !==
                      event.startDate && (

                    <>
                      <small>
                        END DATE
                      </small>

                      <strong>
                        {formatDate(
                          event.endDate
                        )}
                      </strong>
                    </>

                  )}

                </div>


                {/* DETAILS */}

                <div className="academic-event-details">

                  <h3>
                    {event.title ||
                      "Academic Event"}
                  </h3>

                  <p>
                    {event.description ||
                      "No description available."}
                  </p>

                  <div className="academic-event-meta">

                    <span>
                      📌{" "}
                      {event.eventType ||
                        "Academic Event"}
                    </span>

                  </div>

                </div>


                {/* STATUS */}

                <div className="academic-event-status">

                  {event.active !== false ? (

                    <span className="calendar-active">
                      Active
                    </span>

                  ) : (

                    <span className="calendar-inactive">
                      Inactive
                    </span>

                  )}

                </div>

              </div>

            ))}

          </div>

        </div>

      )}

    </div>
  );
};

export default TeacherAcademicCalendar;
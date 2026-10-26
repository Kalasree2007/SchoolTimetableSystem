import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./student-calendar.css";

const StudentCalendar = () => {
  const [events, setEvents] = useState([]);
  const [studentName, setStudentName] = useState("Student");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCalendar = async () => {
    try {
      setLoading(true);
      setError("");

      // ==========================================
      // GET LOGGED-IN STUDENT
      // ==========================================

      try {
        const userResponse = await api.get("/users/me");

        console.log(
          "Logged-in student:",
          userResponse.data
        );

        const user = userResponse.data;

        if (user?.fullName) {
          setStudentName(user.fullName);

          localStorage.setItem(
            "studentName",
            user.fullName
          );
        }
      } catch (userError) {
        console.log(
          "Unable to load student information:",
          userError
        );

        const savedName =
          localStorage.getItem("studentName");

        if (savedName) {
          setStudentName(savedName);
        }
      }

      // ==========================================
      // GET ACADEMIC CALENDAR
      //
      // Backend:
      // @RequestMapping("/api/calendar")
      // @GetMapping
      //
      // api.js already contains /api
      //
      // Therefore:
      // /calendar
      // ==========================================

      const response = await api.get("/calendar");

      console.log(
        "Academic calendar:",
        response.data
      );

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
      return new Date(date).toLocaleDateString(
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
      <div className="student-calendar-page">

        <div className="student-calendar-loading">

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
      <div className="student-calendar-page">

        <div className="student-calendar-header">

          <div>

            <span className="student-calendar-label">
              STUDENT PORTAL
            </span>

            <h2>
              Academic Calendar
            </h2>

            <p>
              View important academic events,{" "}
              <strong>
                {studentName}
              </strong>.
            </p>

          </div>

          <div className="student-calendar-header-icon">
            📅
          </div>

        </div>

        <div className="student-calendar-error">

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
            className="calendar-retry-button"
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
    <div className="student-calendar-page">

      {/* ======================================
          HEADER
      ======================================= */}

      <div className="student-calendar-header">

        <div>

          <span className="student-calendar-label">
            STUDENT PORTAL
          </span>

          <h2>
            Academic Calendar
          </h2>

          <p>
            View important academic events,{" "}
            <strong>
              {studentName}
            </strong>.
          </p>

        </div>

        <div className="student-calendar-header-icon">
          📅
        </div>

      </div>


      {/* ======================================
          SUMMARY
      ======================================= */}

      <div className="student-calendar-summary">

        <div className="calendar-summary-card">

          <div className="calendar-summary-icon blue">
            📅
          </div>

          <div>

            <span>
              Total Events
            </span>

            <strong>
              {events.length}
            </strong>

            <small>
              Academic events
            </small>

          </div>

        </div>


        <div className="calendar-summary-card">

          <div className="calendar-summary-icon green">
            🟢
          </div>

          <div>

            <span>
              Active Events
            </span>

            <strong>
              {
                events.filter(
                  event =>
                    event.active !== false
                ).length
              }
            </strong>

            <small>
              Currently active
            </small>

          </div>

        </div>


        <div className="calendar-summary-card">

          <div className="calendar-summary-icon orange">
            📌
          </div>

          <div>

            <span>
              Event Types
            </span>

            <strong>
              {
                new Set(
                  events.map(
                    event =>
                      event.eventType
                  )
                ).size
              }
            </strong>

            <small>
              Categories
            </small>

          </div>

        </div>

      </div>


      {/* ======================================
          EMPTY
      ======================================= */}

      {events.length === 0 ? (

        <div className="student-calendar-empty">

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
        ===================================== */

        <div className="student-events-section">

          <div className="student-events-section-header">

            <div>

              <h3>
                Academic Events
              </h3>

              <span>
                Important dates and events
              </span>

            </div>

            <div className="events-count">
              {events.length} Events
            </div>

          </div>


          <div className="student-events-list">

            {events.map((event) => (

              <div
                className="student-event-card"
                key={event.id}
              >

                {/* ICON */}

                <div className="student-event-icon">

                  {getEventIcon(
                    event.eventType
                  )}

                </div>


                {/* DATE */}

                <div className="student-event-date">

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

                <div className="student-event-details">

                  <h3>
                    {event.title ||
                      "Academic Event"}
                  </h3>

                  <p>
                    {event.description ||
                      "No description available."}
                  </p>

                  <div className="student-event-meta">

                    <span>
                      📌{" "}
                      {event.eventType ||
                        "Academic Event"}
                    </span>

                  </div>

                </div>


                {/* STATUS */}

                <div className="student-event-status">

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

export default StudentCalendar;

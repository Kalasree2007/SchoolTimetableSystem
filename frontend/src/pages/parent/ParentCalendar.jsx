import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./parent-calendar.css";

const ParentCalendar = () => {
  const [events, setEvents] = useState([]);
  const [parentName, setParentName] = useState("Parent");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD ACADEMIC CALENDAR
  // =====================================================

  const loadCalendar = async () => {
    try {
      setLoading(true);
      setError("");

      // =====================================================
      // 1. GET LOGGED-IN PARENT
      // =====================================================

      const userResponse = await api.get("/users/me");

      const user = userResponse.data;

      console.log("Logged-in parent:", user);

      if (!user || !user.id) {
        throw new Error(
          "Unable to identify the logged-in parent."
        );
      }

      if (user.role !== "PARENT") {
        throw new Error(
          "This page is available only for parent accounts."
        );
      }

      setParentName(
        user.fullName || "Parent"
      );

      // =====================================================
      // 2. GET ACADEMIC CALENDAR
      // =====================================================

      const calendarResponse =
        await api.get("/calendar");

      const calendarData =
        calendarResponse.data;

      console.log(
        "Academic calendar:",
        calendarData
      );

      if (!Array.isArray(calendarData)) {
        throw new Error(
          "Invalid academic calendar data received."
        );
      }

      setEvents(calendarData);

    } catch (err) {

      console.error(
        "Unable to load academic calendar:",
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
        "Unable to load academic calendar."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadCalendar();
  }, []);

  // =====================================================
  // FORMAT DATE
  // =====================================================

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
          year: "numeric"
        }
      );

    } catch {

      return date;

    }
  };

  // =====================================================
  // EVENT ICON
  // =====================================================

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

    if (type.includes("meeting")) {
      return "👥";
    }

    return "📅";
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="parent-calendar-page">

        <div className="parent-calendar-loading">

          <div className="parent-calendar-loading-icon">
            📅
          </div>

          <h3>
            Loading academic calendar...
          </h3>

          <p>
            Please wait while we load
            important academic dates.
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
      <div className="parent-calendar-page">

        <div className="parent-calendar-header">

          <div>

            <span className="parent-calendar-label">
              PARENT PORTAL
            </span>

            <h1>
              Academic Calendar
            </h1>

            <p>
              View important academic events
              and dates.
            </p>

          </div>

          <div className="parent-calendar-header-icon">
            📅
          </div>

        </div>

        <div className="parent-calendar-error">

          <div className="parent-calendar-error-icon">
            ⚠️
          </div>

          <h3>
            Unable to load academic calendar
          </h3>

          <p>
            {error}
          </p>

          <button
            className="parent-calendar-retry-button"
            onClick={loadCalendar}
          >
            🔄 Try Again
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // COUNTS
  // =====================================================

  const activeEvents =
    events.filter(
      event => event.active !== false
    ).length;

  const eventTypes =
    new Set(
      events
        .map(event => event.eventType)
        .filter(Boolean)
    ).size;

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="parent-calendar-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="parent-calendar-header">

        <div>

          <span className="parent-calendar-label">
            PARENT PORTAL
          </span>

          <h1>
            Academic Calendar
          </h1>

          <p>
            View important academic events
            and dates for your child.
          </p>

        </div>

        <div className="parent-calendar-header-icon">
          📅
        </div>

      </div>

      {/* =================================================
          PARENT SUMMARY
      ================================================= */}

      <div className="parent-calendar-user-card">

        <div className="parent-calendar-avatar">

          {parentName
            .charAt(0)
            .toUpperCase()}

        </div>

        <div>

          <span>
            PARENT PORTAL
          </span>

          <h2>
            {parentName}
          </h2>

          <p>
            Academic Calendar
          </p>

        </div>

      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="parent-calendar-summary">

        <div className="parent-calendar-summary-card">

          <div className="parent-summary-icon">
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

        <div className="parent-calendar-summary-card">

          <div className="parent-summary-icon">
            🟢
          </div>

          <div>

            <span>
              Active Events
            </span>

            <strong>
              {activeEvents}
            </strong>

            <small>
              Currently active
            </small>

          </div>

        </div>

        <div className="parent-calendar-summary-card">

          <div className="parent-summary-icon">
            📌
          </div>

          <div>

            <span>
              Event Types
            </span>

            <strong>
              {eventTypes}
            </strong>

            <small>
              Categories
            </small>

          </div>

        </div>

      </div>

      {/* =================================================
          EMPTY
      ================================================= */}

      {events.length === 0 ? (

        <div className="parent-calendar-empty">

          <div className="parent-calendar-empty-icon">
            📅
          </div>

          <h3>
            No academic events available
          </h3>

          <p>
            Academic events will appear here
            once they are added by the administrator.
          </p>

        </div>

      ) : (

        /* =================================================
           EVENTS
        ================================================= */

        <div className="parent-events-section">

          <div className="parent-events-header">

            <div>

              <h2>
                Academic Events
              </h2>

              <p>
                Important dates and events
              </p>

            </div>

            <span className="parent-events-count">
              {events.length} Events
            </span>

          </div>

          <div className="parent-events-list">

            {events.map((event) => (

              <div
                className="parent-event-card"
                key={event.id}
              >

                {/* EVENT ICON */}

                <div className="parent-event-icon">

                  {getEventIcon(
                    event.eventType
                  )}

                </div>

                {/* DATE */}

                <div className="parent-event-date">

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

                <div className="parent-event-details">

                  <h3>
                    {event.title ||
                      "Academic Event"}
                  </h3>

                  <p>
                    {event.description ||
                      "No description available."}
                  </p>

                  <div className="parent-event-meta">

                    <span>
                      📌{" "}
                      {event.eventType ||
                        "Academic Event"}
                    </span>

                  </div>

                </div>

                {/* STATUS */}

                <div className="parent-event-status">

                  {event.active !== false ? (

                    <span className="parent-calendar-active">
                      Active
                    </span>

                  ) : (

                    <span className="parent-calendar-inactive">
                      Inactive
                    </span>

                  )}

                </div>

              </div>

            ))}

          </div>

        </div>

      )}

      {/* =================================================
          REFRESH
      ================================================= */}

      <div className="parent-calendar-actions">

        <button
          className="parent-calendar-refresh-button"
          onClick={loadCalendar}
        >
          🔄 Refresh Calendar
        </button>

      </div>

    </div>
  );
};

export default ParentCalendar;

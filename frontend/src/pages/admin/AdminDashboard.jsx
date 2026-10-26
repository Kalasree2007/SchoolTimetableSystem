import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./adminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [timetables, setTimetables] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD DASHBOARD DATA
  // =====================================================

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        departmentsResponse,
        teachersResponse,
        studentsResponse,
        classesResponse,
        timetableResponse,
        calendarResponse,
      ] = await Promise.all([
        api.get("/departments"),
        api.get("/teachers"),
        api.get("/students"),
        api.get("/classes"),
        api.get("/timetables"),
        api.get("/calendar"),
      ]);

      setDepartments(
        Array.isArray(departmentsResponse.data)
          ? departmentsResponse.data
          : []
      );

      setTeachers(
        Array.isArray(teachersResponse.data)
          ? teachersResponse.data
          : []
      );

      setStudents(
        Array.isArray(studentsResponse.data)
          ? studentsResponse.data
          : []
      );

      setClasses(
        Array.isArray(classesResponse.data)
          ? classesResponse.data
          : []
      );

      setTimetables(
        Array.isArray(timetableResponse.data)
          ? timetableResponse.data
          : []
      );

      setCalendarEvents(
        Array.isArray(calendarResponse.data)
          ? calendarResponse.data
          : []
      );

    } catch (err) {
      console.error("Dashboard loading error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // =====================================================
  // TODAY
  // =====================================================

  const today = new Date()
    .toLocaleDateString("en-US", {
      weekday: "long",
    })
    .toUpperCase();

  const todaysTimetable = timetables
    .filter(
      (item) =>
        item.dayOfWeek?.toUpperCase() === today &&
        item.active !== false
    )
    .sort((a, b) =>
      (a.startTime || "").localeCompare(
        b.startTime || ""
      )
    );

  // =====================================================
  // UPCOMING CALENDAR EVENTS
  // =====================================================

  const upcomingEvents = calendarEvents
    .filter(
      (event) =>
        event.active !== false &&
        event.startDate
    )
    .filter(
      (event) =>
        new Date(event.startDate) >= new Date()
    )
    .sort(
      (a, b) =>
        new Date(a.startDate) -
        new Date(b.startDate)
    )
    .slice(0, 2);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-loading">
          Loading dashboard...
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard-error">
          <h3>Unable to load dashboard</h3>

          <p>{error}</p>

          <button onClick={loadDashboard}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="dashboard">

      {/* ================= HEADER ================= */}

      <div className="dashboard-heading">

        <div>
          <h2>Dashboard Overview</h2>

          <p>
            Overview of the school management system.
          </p>
        </div>

        <button className="today-btn">
          📅 Today
        </button>

      </div>


      {/* ================= STATISTICS ================= */}

      <div className="stats-grid">

        <div className="stat-card">

          <div className="stat-top">
            <div className="stat-icon">
              ▤
            </div>

            <span className="stat-label">
              Overview
            </span>
          </div>

          <h3>
            {departments.length}
          </h3>

          <p>
            Total Departments
          </p>

        </div>


        <div className="stat-card">

          <div className="stat-top">
            <div className="stat-icon">
              ◉
            </div>

            <span className="stat-label">
              Overview
            </span>
          </div>

          <h3>
            {teachers.length}
          </h3>

          <p>
            Total Teachers
          </p>

        </div>


        <div className="stat-card">

          <div className="stat-top">
            <div className="stat-icon">
              ◎
            </div>

            <span className="stat-label">
              Overview
            </span>
          </div>

          <h3>
            {students.length}
          </h3>

          <p>
            Total Students
          </p>

        </div>


        <div className="stat-card">

          <div className="stat-top">
            <div className="stat-icon">
              ▥
            </div>

            <span className="stat-label">
              Overview
            </span>
          </div>

          <h3>
            {classes.length}
          </h3>

          <p>
            Total Classes
          </p>

        </div>

      </div>


      {/* ================= MAIN GRID ================= */}

      <div className="dashboard-grid">

        {/* ================= TIMETABLE ================= */}

        <div className="dashboard-card timetable-card">

          <div className="card-header">

            <div>
              <h3>
                Today's Timetable
              </h3>

              <p>
                Class schedule for today
              </p>
            </div>

            <button
              className="view-btn"
              onClick={() =>
                navigate("/admin/timetable")
              }
            >
              View All
            </button>

          </div>


          {todaysTimetable.length === 0 ? (

            <div className="dashboard-empty">
              No classes scheduled for today.
            </div>

          ) : (

            <div className="table-wrapper">

              <table>

                <thead>
                  <tr>
                    <th>TIME</th>
                    <th>SUBJECT</th>
                    <th>TEACHER</th>
                    <th>ROOM</th>
                    <th>CLASS</th>
                  </tr>
                </thead>

                <tbody>

                  {todaysTimetable
                    .slice(0, 5)
                    .map((item) => (

                      <tr key={item.id}>

                        <td>
                          <span className="time-text">
                            {item.startTime || "-"}
                            {" - "}
                            {item.endTime || "-"}
                          </span>
                        </td>

                        <td>
                          <strong>
                            {item.subjectName || "-"}
                          </strong>
                        </td>

                        <td>
                          {item.teacherName || "-"}
                        </td>

                        <td>
                          <span className="room-badge">
                            {item.roomNumber || "-"}
                          </span>
                        </td>

                        <td>
                          <span className="class-badge">
                            {item.className || "-"}
                          </span>
                        </td>

                      </tr>

                    ))}

                </tbody>

              </table>

            </div>

          )}

        </div>


        {/* ================= QUICK ACTIONS ================= */}

        <div className="dashboard-card quick-card">

          <div className="card-header">

            <div>
              <h3>
                Quick Actions
              </h3>

              <p>
                Frequently used actions
              </p>
            </div>

          </div>


          <div className="quick-actions">

            <button
              className="quick-action"
              onClick={() =>
                navigate("/admin/teachers")
              }
            >
              <span className="quick-icon">
                +
              </span>

              <div>
                <strong>
                  Add Teacher
                </strong>

                <small>
                  Create a new teacher
                </small>
              </div>
            </button>


            <button
              className="quick-action"
              onClick={() =>
                navigate("/admin/students")
              }
            >
              <span className="quick-icon">
                +
              </span>

              <div>
                <strong>
                  Add Student
                </strong>

                <small>
                  Register a student
                </small>
              </div>
            </button>


            <button
              className="quick-action"
              onClick={() =>
                navigate("/admin/subjects")
              }
            >
              <span className="quick-icon">
                +
              </span>

              <div>
                <strong>
                  Add Subject
                </strong>

                <small>
                  Create a new subject
                </small>
              </div>
            </button>


            <button
              className="quick-action"
              onClick={() =>
                navigate("/admin/timetable")
              }
            >
              <span className="quick-icon">
                +
              </span>

              <div>
                <strong>
                  Create Timetable
                </strong>

                <small>
                  Schedule a class
                </small>
              </div>
            </button>

          </div>

        </div>

      </div>


      {/* ================= BOTTOM GRID ================= */}

      <div className="dashboard-bottom">

        {/* ================= UPCOMING ================= */}

        <div className="dashboard-card calendar-card">

          <div className="card-header">

            <div>
              <h3>
                Upcoming
              </h3>

              <p>
                Important academic events
              </p>
            </div>

          </div>


          {upcomingEvents.length === 0 ? (

            <div className="dashboard-empty">
              No upcoming events.
            </div>

          ) : (

            upcomingEvents.map((event) => (

              <div
                className="event"
                key={event.id}
              >

                <div className="event-date">

                  <strong>
                    {new Date(
                      event.startDate
                    ).getDate()}
                  </strong>

                  <span>
                    {new Date(
                      event.startDate
                    )
                      .toLocaleString(
                        "en-US",
                        {
                          month: "short",
                        }
                      )
                      .toUpperCase()}
                  </span>

                </div>

                <div>

                  <strong>
                    {event.title || "-"}
                  </strong>

                  <p>
                    {event.description || "-"}
                  </p>

                </div>

              </div>

            ))

          )}

        </div>


        {/* ================= SYSTEM SUMMARY ================= */}

        <div className="dashboard-card activity-card">

          <div className="card-header">

            <div>
              <h3>
                System Summary
              </h3>

              <p>
                Current system information
              </p>
            </div>

          </div>


          <div className="activity-list">

            <div className="activity-item">

              <div className="activity-icon">
                📚
              </div>

              <div className="activity-content">

                <strong>
                  Timetable Entries
                </strong>

                <p>
                  Total timetable records
                </p>

              </div>

              <span>
                {timetables.length}
              </span>

            </div>


            <div className="activity-item">

              <div className="activity-icon">
                📅
              </div>

              <div className="activity-content">

                <strong>
                  Calendar Events
                </strong>

                <p>
                  Total academic events
                </p>

              </div>

              <span>
                {calendarEvents.length}
              </span>

            </div>


            <div className="activity-item">

              <div className="activity-icon">
                🏫
              </div>

              <div className="activity-content">

                <strong>
                  Active Classes
                </strong>

                <p>
                  Classes currently available
                </p>

              </div>

              <span>
                {
                  classes.filter(
                    (item) =>
                      item.active !== false
                  ).length
                }
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./teacher-schedule.css";

const TeacherSchedule = () => {
  const [teacherName, setTeacherName] = useState("Teacher");
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        setLoading(true);
        setError("");

        // ==========================================
        // 1. GET CURRENT LOGGED-IN USER
        // ==========================================

        const userResponse = await api.get("/users/me");

        console.log("Current user:", userResponse.data);

        const user = userResponse.data;

        if (!user || !user.id) {
          throw new Error("Unable to identify the logged-in user.");
        }

        // Display logged-in user's name
        if (user.fullName) {
          setTeacherName(user.fullName);

          localStorage.setItem(
            "teacherName",
            user.fullName
          );
        }

        if (user.email) {
          localStorage.setItem(
            "email",
            user.email
          );
        }

        // ==========================================
        // 2. GET ALL TEACHERS
        // ==========================================

        const teachersResponse = await api.get("/teachers");

        console.log(
          "All teachers:",
          teachersResponse.data
        );

        const teachers = teachersResponse.data;

        if (!Array.isArray(teachers)) {
          throw new Error("Unable to load teacher profiles.");
        }

        // ==========================================
        // 3. FIND TEACHER LINKED TO CURRENT USER
        // ==========================================

        const teacher = teachers.find(
          (item) =>
            Number(item.userId) === Number(user.id)
        );

        console.log(
          "Matched teacher:",
          teacher
        );

        if (!teacher) {
          throw new Error(
            "No teacher profile is linked to this user."
          );
        }

        // ==========================================
        // 4. SAVE TEACHER INFORMATION
        // ==========================================

        const displayName =
          teacher.teacherName ||
          user.fullName ||
          "Teacher";

        setTeacherName(displayName);

        localStorage.setItem(
          "teacherId",
          String(teacher.id)
        );

        localStorage.setItem(
          "teacherName",
          displayName
        );

        // ==========================================
        // 5. GET TEACHER TIMETABLE
        // ==========================================

        console.log(
          "Fetching timetable for teacher ID:",
          teacher.id
        );

        const timetableResponse = await api.get(
          `/timetables/teacher/${teacher.id}`
        );

        console.log(
          "Teacher timetable:",
          timetableResponse.data
        );

        if (Array.isArray(timetableResponse.data)) {
          setSchedule(timetableResponse.data);
        } else {
          setSchedule([]);
        }

      } catch (err) {
        console.error(
          "Unable to load teacher schedule:",
          err
        );

        if (err.response) {
          console.error(
            "Status:",
            err.response.status
          );

          console.error(
            "Response:",
            err.response.data
          );
        }

        setError(
          err.response?.data?.message ||
          err.message ||
          "Unable to load schedule."
        );

      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, []);

  // ==========================================
  // SORT SCHEDULE BY TIME
  // ==========================================

  const sortedSchedule = [...schedule].sort(
    (a, b) =>
      (a.startTime || "").localeCompare(
        b.startTime || ""
      )
  );

  // ==========================================
  // FORMAT DAY
  // ==========================================

  const formatDay = (day) => {
    if (!day) return "-";

    return (
      day.charAt(0).toUpperCase() +
      day.slice(1).toLowerCase()
    );
  };

  // ==========================================
  // TODAY
  // ==========================================

  const todayName = new Date()
    .toLocaleDateString("en-US", {
      weekday: "long",
    })
    .toUpperCase();

  const todayClasses = sortedSchedule.filter(
    (item) =>
      item.dayOfWeek?.toUpperCase() === todayName
  );

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="teacher-schedule-page">
        <div className="teacher-schedule-loading">
          Loading schedule...
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="teacher-schedule-page">

        <div className="teacher-schedule-header">

          <div>
            <h2>My Schedule</h2>

            <p>
              View your teaching schedule.
            </p>
          </div>

          <div className="schedule-icon">
            ◷
          </div>

        </div>

        <div className="teacher-schedule-error">

          <div className="schedule-error-icon">
            ⚠️
          </div>

          <h3>
            Unable to load schedule
          </h3>

          <p>
            {error}
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (
    <div className="teacher-schedule-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="teacher-schedule-header">

        <div>

          <h2>
            My Schedule
          </h2>

          <p>
            Your teaching schedule,{" "}
            <strong>
              {teacherName}
            </strong>.
          </p>

        </div>

        <div className="schedule-icon">
          ◷
        </div>

      </div>


      {/* ======================================
          TODAY SUMMARY
      ====================================== */}

      <div className="schedule-summary">

        <div className="schedule-summary-icon">
          📅
        </div>

        <div>

          <span>
            TODAY'S CLASSES
          </span>

          <strong>
            {todayClasses.length}
          </strong>

        </div>

      </div>


      {/* ======================================
          NO SCHEDULE
      ====================================== */}

      {schedule.length === 0 ? (

        <div className="teacher-schedule-empty">

          <div className="schedule-empty-icon">
            📚
          </div>

          <h3>
            No schedule assigned
          </h3>

          <p>
            No teaching classes have been assigned
            to you yet.
          </p>

        </div>

      ) : (

        <div className="teacher-schedule-card">

          {/* ==================================
              TABLE HEADER
              ================================== */}

          <div className="schedule-card-header">

            <div>

              <h3>
                Teaching Schedule
              </h3>

              <span>
                Your assigned classes and timings
              </span>

            </div>

            <div className="schedule-total">

              {schedule.length}{" "}
              {schedule.length === 1
                ? "Class"
                : "Classes"}

            </div>

          </div>


          {/* ==================================
              SCHEDULE TABLE
              ================================== */}

          <div className="teacher-schedule-table-wrapper">

            <table className="teacher-schedule-table">

              <thead>

                <tr>

                  <th>
                    Day
                  </th>

                  <th>
                    Time
                  </th>

                  <th>
                    Subject
                  </th>

                  <th>
                    Class
                  </th>

                  <th>
                    Room
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {sortedSchedule.map((item) => (

                  <tr key={item.id}>

                    <td>

                      <strong>
                        {formatDay(
                          item.dayOfWeek
                        )}
                      </strong>

                    </td>


                    <td>

                      <div className="schedule-time">

                        <strong>
                          {item.startTime || "-"}
                        </strong>

                        <span>
                          -
                        </span>

                        <strong>
                          {item.endTime || "-"}
                        </strong>

                      </div>

                    </td>


                    <td>

                      <div className="schedule-subject">

                        <span className="subject-icon">
                          📖
                        </span>

                        <strong>
                          {item.subjectName ||
                            "Subject"}
                        </strong>

                      </div>

                    </td>


                    <td>

                      <div className="schedule-class">

                        🏫{" "}
                        {item.className || "-"}

                      </div>

                    </td>


                    <td>

                      <div className="schedule-room">

                        🚪{" "}
                        {item.roomNumber || "-"}

                      </div>

                    </td>


                    <td>

                      {item.active ? (

                        <span className="schedule-active">
                          Active
                        </span>

                      ) : (

                        <span className="schedule-inactive">
                          Inactive
                        </span>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>
  );
};

export default TeacherSchedule;

import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./child-timetable.css";

const ChildTimetable = () => {
  const [studentName, setStudentName] = useState("Student");
  const [className, setClassName] = useState("");
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD CHILD TIMETABLE
  // =====================================================

  const loadChildTimetable = async () => {
    try {
      setLoading(true);
      setError("");

      // =====================================================
      // 1. GET LOGGED-IN PARENT
      // =====================================================

      const userResponse = await api.get("/users/me");

      const loggedInUser = userResponse.data;

      console.log("Logged-in parent:", loggedInUser);

      if (!loggedInUser || !loggedInUser.id) {
        throw new Error(
          "Unable to identify the logged-in user. Please login again."
        );
      }

      if (loggedInUser.role !== "PARENT") {
        throw new Error(
          "This page is available only for parent accounts."
        );
      }

      // =====================================================
      // 2. GET PARENT RECORD
      // =====================================================

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

      // =====================================================
      // 3. GET CHILD ID
      // =====================================================

      const childId =
        parentData.studentId ||
        parentData.student?.id;

      console.log("Child ID:", childId);

      if (!childId) {
        throw new Error(
          "No child is linked to this parent account."
        );
      }

      // =====================================================
      // 4. GET CHILD STUDENT
      // =====================================================

      const studentResponse = await api.get(
        `/students/${childId}`
      );

      const studentData = studentResponse.data;

      console.log("Child student:", studentData);

      if (!studentData) {
        throw new Error(
          "Child student information not found."
        );
      }

      // =====================================================
      // 5. GET CHILD NAME
      // =====================================================

      const name =
        studentData.studentName ||
        studentData.userFullName ||
        studentData.fullName ||
        studentData.user?.fullName ||
        parentData.studentName ||
        "Student";

      setStudentName(name);

      // =====================================================
      // 6. GET CHILD CLASS
      // =====================================================

      const childClass =
        studentData.className ||
        studentData.classEntity?.className ||
        studentData.classEntity?.name;

      console.log("Child class:", childClass);

      if (!childClass) {
        throw new Error(
          "No class is assigned to your child."
        );
      }

      setClassName(childClass);

      // =====================================================
      // 7. GET ALL TIMETABLES
      // =====================================================

      const timetableResponse =
        await api.get("/timetables");

      const allTimetables =
        timetableResponse.data;

      console.log(
        "All timetables:",
        allTimetables
      );

      if (!Array.isArray(allTimetables)) {
        throw new Error(
          "Invalid timetable data received from server."
        );
      }

      // =====================================================
      // 8. FILTER BY CHILD'S CLASS
      // =====================================================

      const normalizedClass =
        childClass.trim().toLowerCase();

      const childTimetable =
        allTimetables.filter((item) => {

          const timetableClass =
            item.className ||
            item.classEntity?.className ||
            item.classEntity?.name;

          return (
            timetableClass &&
            timetableClass.trim().toLowerCase() ===
              normalizedClass
          );
        });

      console.log(
        "Child class timetable:",
        childTimetable
      );

      setTimetable(childTimetable);

    } catch (err) {

      console.error(
        "Unable to load child timetable:",
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
        "Unable to load child timetable."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadChildTimetable();
  }, []);

  // =====================================================
  // DAYS
  // =====================================================

  const days = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY"
  ];

  // =====================================================
  // GET CLASSES FOR DAY
  // =====================================================

  const getClassesForDay = (day) => {
    return timetable
      .filter((item) => {

        const itemDay =
          item.dayOfWeek ||
          item.day ||
          item.dayName;

        return (
          itemDay &&
          itemDay.toUpperCase() === day
        );
      })
      .sort((a, b) =>
        (a.startTime || "").localeCompare(
          b.startTime || ""
        )
      );
  };

  // =====================================================
  // SUBJECT
  // =====================================================

  const getSubjectName = (item) => {
    return (
      item.subjectName ||
      item.subject?.subjectName ||
      item.subject?.name ||
      "Subject"
    );
  };

  // =====================================================
  // CLASS
  // =====================================================

  const getClassName = (item) => {
    return (
      item.className ||
      item.classEntity?.className ||
      item.classEntity?.name ||
      className ||
      "Class"
    );
  };

  // =====================================================
  // ROOM
  // =====================================================

  const getRoomNumber = (item) => {
    return (
      item.roomNumber ||
      item.room?.roomNumber ||
      item.room?.roomName ||
      "Not assigned"
    );
  };

  // =====================================================
  // TEACHER
  // =====================================================

  const getTeacherName = (item) => {
    return (
      item.teacherName ||
      item.teacher?.user?.fullName ||
      item.teacher?.fullName ||
      item.teacher?.name ||
      null
    );
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (time) => {
    if (!time) {
      return "-";
    }

    return time.substring(0, 5);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="child-timetable-page">

        <div className="child-timetable-loading">

          <div className="child-loading-spinner"></div>

          <h3>
            Loading child's timetable...
          </h3>

          <p>
            Fetching your child's weekly schedule.
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
      <div className="child-timetable-page">

        <div className="child-timetable-error">

          <div className="child-error-icon">
            ⚠️
          </div>

          <h2>
            Unable to load timetable
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={loadChildTimetable}
            className="child-retry-button"
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
    <div className="child-timetable-page">

      {/* HEADER */}

      <div className="child-timetable-header">

        <div>

          <span className="child-timetable-label">
            ACADEMICS
          </span>

          <h1>
            Child Timetable
          </h1>

          <p>
            View{" "}
            <strong>{studentName}</strong>'s
            weekly class schedule.
          </p>

        </div>

        <div className="child-timetable-header-icon">
          📅
        </div>

      </div>

      {/* CHILD SUMMARY */}

      <div className="child-summary-card">

        <div className="child-summary-avatar">
          {studentName.charAt(0).toUpperCase()}
        </div>

        <div className="child-summary-content">

          <span>
            CHILD INFORMATION
          </span>

          <h2>
            {studentName}
          </h2>

          <p>
            {className || "Class information unavailable"}
          </p>

        </div>

      </div>

      {/* NO TIMETABLE */}

      {timetable.length === 0 ? (

        <div className="child-timetable-empty">

          <div className="child-empty-icon">
            📚
          </div>

          <h3>
            No timetable assigned
          </h3>

          <p>
            No classes have been assigned
            to your child's class yet.
          </p>

        </div>

      ) : (

        <div className="child-timetable-grid">

          {days.map((day) => {

            const classes =
              getClassesForDay(day);

            return (

              <div
                className="child-day-card"
                key={day}
              >

                {/* DAY HEADER */}

                <div className="child-day-header">

                  <div>

                    <h3>
                      {day}
                    </h3>

                    <span>
                      Weekly Classes
                    </span>

                  </div>

                  <div className="child-class-count">
                    {classes.length}
                  </div>

                </div>

                {/* DAY CONTENT */}

                <div className="child-day-content">

                  {classes.length === 0 ? (

                    <div className="child-no-class">

                      <span>
                        💤
                      </span>

                      <p>
                        No classes
                      </p>

                    </div>

                  ) : (

                    classes.map((item, index) => {

                      const teacherName =
                        getTeacherName(item);

                      return (

                        <div
                          className="child-class-card"
                          key={
                            item.id ||
                            `${day}-${index}`
                          }
                        >

                          {/* TIME */}

                          <div className="child-class-time">

                            <strong>
                              {formatTime(
                                item.startTime
                              )}
                            </strong>

                            <span>
                              to
                            </span>

                            <strong>
                              {formatTime(
                                item.endTime
                              )}
                            </strong>

                          </div>

                          {/* DETAILS */}

                          <div className="child-class-details">

                            <div className="child-subject-icon">
                              📖
                            </div>

                            <div>

                              <h4>
                                {getSubjectName(item)}
                              </h4>

                              <p>
                                🏫{" "}
                                {getClassName(item)}
                              </p>

                              <p>
                                🚪 Room{" "}
                                {getRoomNumber(item)}
                              </p>

                              {teacherName && (
                                <p>
                                  👨‍🏫{" "}
                                  {teacherName}
                                </p>
                              )}

                            </div>

                          </div>

                          {/* STATUS */}

                          <div className="child-class-status">

                            {item.active === false ? (

                              <span className="child-inactive">
                                Inactive
                              </span>

                            ) : (

                              <span className="child-active">
                                Active
                              </span>

                            )}

                          </div>

                        </div>

                      );

                    })

                  )}

                </div>

              </div>

            );

          })}

        </div>
      )}

      {/* REFRESH */}

      <div className="child-timetable-actions">

        <button
          onClick={loadChildTimetable}
          className="child-refresh-button"
        >
          🔄 Refresh Timetable
        </button>

      </div>

    </div>
  );
};

export default ChildTimetable;

import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./teacher-timetable.css";

const TeacherTimetable = () => {

  const [teacherName, setTeacherName] = useState("Teacher");
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const loadTimetable = async () => {

      try {

        setLoading(true);
        setError("");

        // =====================================================
        // 1. GET LOGGED-IN USER
        // =====================================================

        const userResponse = await api.get("/users/me");

        const user = userResponse.data;

        console.log("Logged-in user:", user);


        if (!user) {
          throw new Error("Unable to identify logged-in user.");
        }


        // =====================================================
        // 2. GET USER NAME
        // =====================================================

        const loggedInName =
          user.fullName ||
          localStorage.getItem("teacherName") ||
          "Teacher";

        setTeacherName(loggedInName);

        localStorage.setItem(
          "teacherName",
          loggedInName
        );


        if (user.email) {

          localStorage.setItem(
            "email",
            user.email
          );

        }


        // =====================================================
        // 3. GET ALL TIMETABLES
        //
        // IMPORTANT:
        // We DO NOT call /teachers.
        // We DO NOT try to find teacher profile.
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
        // 4. FIND CURRENT TEACHER'S TIMETABLE
        //
        // TimetableResponse contains:
        //
        // teacherId
        // teacherName
        //
        // So we can directly filter using teacherName.
        // =====================================================

        const normalizedUserName =
          loggedInName.trim().toLowerCase();


        const myTimetable =
          allTimetables.filter((item) => {

            const timetableTeacherName =
              item.teacherName
                ?.trim()
                .toLowerCase();

            return (
              timetableTeacherName ===
              normalizedUserName
            );

          });


        console.log(
          "My timetable:",
          myTimetable
        );


        // =====================================================
        // 5. IF NAME MATCHED
        // =====================================================

        if (myTimetable.length > 0) {

          const teacherId =
            myTimetable[0].teacherId;

          console.log(
            "Teacher ID:",
            teacherId
          );


          localStorage.setItem(
            "teacherId",
            String(teacherId)
          );


          setTimetable(
            myTimetable
          );

          return;

        }


        // =====================================================
        // 6. FALLBACK:
        // TRY SAVED TEACHER ID
        // =====================================================

        const savedTeacherId =
          localStorage.getItem("teacherId");


        if (savedTeacherId) {

          const teacherTimetable =
            allTimetables.filter(
              (item) =>
                Number(item.teacherId) ===
                Number(savedTeacherId)
            );


          console.log(
            "Timetable using saved teacher ID:",
            teacherTimetable
          );


          setTimetable(
            teacherTimetable
          );

          return;

        }


        // =====================================================
        // 7. NO TIMETABLE
        //
        // This is NOT an error.
        // It simply means the teacher has no classes assigned.
        // =====================================================

        setTimetable([]);

      } catch (err) {

        console.error(
          "Unable to load timetable:",
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
          err.message ||
          "Unable to load timetable."
        );

      } finally {

        setLoading(false);

      }

    };


    loadTimetable();

  }, []);


  // =====================================================
  // DAY ORDER
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
  // GET CLASSES FOR A DAY
  // =====================================================

  const getClassesForDay = (day) => {

    return timetable
      .filter(
        (item) =>
          item.dayOfWeek?.toUpperCase() === day
      )
      .sort(
        (a, b) =>
          (a.startTime || "").localeCompare(
            b.startTime || ""
          )
      );

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="teacher-timetable-page">

        <div className="teacher-timetable-loading">

          Loading timetable...

        </div>

      </div>
    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (
      <div className="teacher-timetable-page">

        <div className="teacher-timetable-header">

          <div>

            <h2>
              My Timetable
            </h2>

            <p>
              View your weekly teaching timetable.
            </p>

          </div>

          <div className="timetable-calendar-icon">
            🗓️
          </div>

        </div>


        <div className="teacher-timetable-error">

          <div className="timetable-error-icon">
            ⚠️
          </div>

          <h3>
            Unable to load timetable
          </h3>

          <p>
            {error}
          </p>

        </div>

      </div>
    );

  }


  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <div className="teacher-timetable-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="teacher-timetable-header">

        <div>

          <h2>
            My Timetable
          </h2>

          <p>
            View your weekly teaching timetable,{" "}
            <strong>
              {teacherName}
            </strong>.
          </p>

        </div>


        <div className="timetable-calendar-icon">
          🗓️
        </div>

      </div>


      {/* =================================================
          NO CLASSES
      ================================================= */}

      {timetable.length === 0 ? (

        <div className="teacher-timetable-empty">

          <div className="timetable-empty-icon">
            📚
          </div>

          <h3>
            No timetable assigned
          </h3>

          <p>
            No classes have been assigned to you yet.
          </p>

        </div>

      ) : (


        /* =================================================
           WEEKLY TIMETABLE
        ================================================= */

        <div className="teacher-timetable-grid">

          {days.map((day) => {

            const classes =
              getClassesForDay(day);


            return (

              <div
                className="teacher-day-card"
                key={day}
              >

                {/* DAY HEADER */}

                <div className="teacher-day-header">

                  <h3>
                    {day}
                  </h3>

                  <span>

                    {classes.length}{" "}

                    {classes.length === 1
                      ? "Class"
                      : "Classes"}

                  </span>

                </div>


                {/* DAY CONTENT */}

                <div className="teacher-day-content">

                  {classes.length === 0 ? (

                    <div className="teacher-no-class">

                      No classes

                    </div>

                  ) : (

                    classes.map((item) => (

                      <div
                        className="teacher-class-card"
                        key={item.id}
                      >

                        {/* TIME */}

                        <div className="teacher-class-time">

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


                        {/* DETAILS */}

                        <div className="teacher-class-details">

                          <h4>
                            {item.subjectName ||
                              "Subject"}
                          </h4>

                          <p>
                            🏫{" "}
                            {item.className ||
                              "Class"}
                          </p>

                          <p>
                            🚪 Room{" "}
                            {item.roomNumber ||
                              "-"}
                          </p>

                        </div>


                        {/* STATUS */}

                        <div className="teacher-class-status">

                          {item.active ? (

                            <span className="active-status">
                              Active
                            </span>

                          ) : (

                            <span className="inactive-status">
                              Inactive
                            </span>

                          )}

                        </div>

                      </div>

                    ))

                  )}

                </div>

              </div>

            );

          })}

        </div>

      )}

    </div>
  );
};

export default TeacherTimetable;

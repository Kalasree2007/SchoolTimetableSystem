// import React, { useEffect, useState } from "react";
// import api from "../../services/api";
// import "./student-timetable.css";

// const StudentTimetable = () => {

//   const [studentName, setStudentName] = useState("Student");
//   const [timetable, setTimetable] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {

//     const loadTimetable = async () => {

//       try {

//         setLoading(true);
//         setError("");

//         // =====================================================
//         // 1. GET LOGGED-IN USER
//         // =====================================================

//         const userResponse = await api.get("/users/me");

//         const user = userResponse.data;

//         console.log("Logged-in student:", user);

//         if (!user) {
//           throw new Error(
//             "Unable to identify logged-in user."
//           );
//         }


//         // =====================================================
//         // 2. GET STUDENT NAME
//         // =====================================================

//         const loggedInName =
//           user.fullName ||
//           localStorage.getItem("studentName") ||
//           "Student";

//         setStudentName(loggedInName);

//         localStorage.setItem(
//           "studentName",
//           loggedInName
//         );

//         if (user.email) {

//           localStorage.setItem(
//             "email",
//             user.email
//           );

//         }


//         // =====================================================
//         // 3. GET ALL TIMETABLES
//         //
//         // IMPORTANT:
//         // We DO NOT call /students.
//         // We DO NOT search for a student profile.
//         // =====================================================

//         const timetableResponse =
//           await api.get("/timetables");

//         const allTimetables =
//           timetableResponse.data;

//         console.log(
//           "All timetables:",
//           allTimetables
//         );


//         if (!Array.isArray(allTimetables)) {

//           throw new Error(
//             "Invalid timetable data received from server."
//           );

//         }


//         // =====================================================
//         // 4. FIND CURRENT STUDENT'S TIMETABLE
//         //
//         // Match using studentName from timetable response.
//         // =====================================================

//         const normalizedUserName =
//           loggedInName
//             .trim()
//             .toLowerCase();


//         const myTimetable =
//           allTimetables.filter((item) => {

//             const timetableStudentName =
//               item.studentName
//                 ?.trim()
//                 .toLowerCase();

//             return (
//               timetableStudentName ===
//               normalizedUserName
//             );

//           });


//         console.log(
//           "My student timetable:",
//           myTimetable
//         );


//         // =====================================================
//         // 5. STUDENT NAME MATCHED
//         // =====================================================

//         if (myTimetable.length > 0) {

//           setTimetable(
//             myTimetable
//           );

//           return;

//         }


//         // =====================================================
//         // 6. FALLBACK
//         //
//         // Some timetable responses may use userName
//         // instead of studentName.
//         // =====================================================

//         const userNameTimetable =
//           allTimetables.filter((item) => {

//             const timetableUserName =
//               item.userName
//                 ?.trim()
//                 .toLowerCase();

//             return (
//               timetableUserName ===
//               normalizedUserName
//             );

//           });


//         console.log(
//           "Timetable using userName:",
//           userNameTimetable
//         );


//         if (userNameTimetable.length > 0) {

//           setTimetable(
//             userNameTimetable
//           );

//           return;

//         }


//         // =====================================================
//         // 7. FALLBACK USING SAVED STUDENT ID
//         // =====================================================

//         const savedStudentId =
//           localStorage.getItem("studentId");


//         if (savedStudentId) {

//           const studentIdTimetable =
//             allTimetables.filter(
//               (item) =>
//                 Number(item.studentId) ===
//                 Number(savedStudentId)
//             );


//           console.log(
//             "Timetable using saved student ID:",
//             studentIdTimetable
//           );


//           if (studentIdTimetable.length > 0) {

//             setTimetable(
//               studentIdTimetable
//             );

//             return;

//           }

//         }


//         // =====================================================
//         // 8. NO TIMETABLE
//         //
//         // This is NOT a profile error.
//         // =====================================================

//         setTimetable([]);

//       } catch (err) {

//         console.error(
//           "Unable to load student timetable:",
//           err
//         );


//         if (err.response) {

//           console.error(
//             "Status:",
//             err.response.status
//           );

//           console.error(
//             "Server response:",
//             err.response.data
//           );

//         }


//         setError(
//           err.message ||
//           "Unable to load timetable."
//         );

//       } finally {

//         setLoading(false);

//       }

//     };


//     loadTimetable();

//   }, []);


//   // =====================================================
//   // DAY ORDER
//   // =====================================================

//   const days = [
//     "MONDAY",
//     "TUESDAY",
//     "WEDNESDAY",
//     "THURSDAY",
//     "FRIDAY",
//     "SATURDAY",
//     "SUNDAY"
//   ];


//   // =====================================================
//   // GET CLASSES FOR A DAY
//   // =====================================================

//   const getClassesForDay = (day) => {

//     return timetable
//       .filter(
//         (item) =>
//           item.dayOfWeek?.toUpperCase() === day
//       )
//       .sort(
//         (a, b) =>
//           (a.startTime || "").localeCompare(
//             b.startTime || ""
//           )
//       );

//   };


//   // =====================================================
//   // LOADING
//   // =====================================================

//   if (loading) {

//     return (
//       <div className="student-timetable-page">

//         <div className="student-timetable-loading">

//           Loading timetable...

//         </div>

//       </div>
//     );

//   }


//   // =====================================================
//   // ERROR
//   // =====================================================

//   if (error) {

//     return (
//       <div className="student-timetable-page">

//         <div className="student-timetable-header">

//           <div>

//             <span className="student-timetable-label">
//               ACADEMICS
//             </span>

//             <h2>
//               My Timetable
//             </h2>

//             <p>
//               View your weekly class timetable.
//             </p>

//           </div>

//           <div className="student-timetable-icon">
//             📅
//           </div>

//         </div>


//         <div className="student-timetable-error">

//           <div className="student-error-icon">
//             ⚠️
//           </div>

//           <h3>
//             Unable to load timetable
//           </h3>

//           <p>
//             {error}
//           </p>

//           <button
//             onClick={() =>
//               window.location.reload()
//             }
//           >
//             Try Again
//           </button>

//         </div>

//       </div>
//     );

//   }


//   // =====================================================
//   // MAIN PAGE
//   // =====================================================

//   return (
//     <div className="student-timetable-page">

//       {/* =================================================
//           HEADER
//       ================================================= */}

//       <div className="student-timetable-header">

//         <div>

//           <span className="student-timetable-label">
//             ACADEMICS
//           </span>

//           <h2>
//             My Timetable
//           </h2>

//           <p>
//             View your weekly class timetable,{" "}
//             <strong>
//               {studentName}
//             </strong>.
//           </p>

//         </div>


//         <div className="student-timetable-icon">
//           📅
//         </div>

//       </div>


//       {/* =================================================
//           NO CLASSES
//       ================================================= */}

//       {timetable.length === 0 ? (

//         <div className="student-timetable-empty">

//           <div className="student-empty-icon">
//             📚
//           </div>

//           <h3>
//             No timetable assigned
//           </h3>

//           <p>
//             No classes have been assigned to you yet.
//           </p>

//         </div>

//       ) : (

//         /* =================================================
//            WEEKLY TIMETABLE
//         ================================================= */

//         <div className="student-timetable-grid">

//           {days.map((day) => {

//             const classes =
//               getClassesForDay(day);


//             return (

//               <div
//                 className="student-day-card"
//                 key={day}
//               >

//                 {/* DAY HEADER */}

//                 <div className="student-day-header">

//                   <div>

//                     <h3>
//                       {day}
//                     </h3>

//                     <span>
//                       Weekly Classes
//                     </span>

//                   </div>

//                   <div className="student-class-count">

//                     {classes.length}

//                   </div>

//                 </div>


//                 {/* DAY CONTENT */}

//                 <div className="student-day-content">

//                   {classes.length === 0 ? (

//                     <div className="student-no-class">

//                       <span>
//                         💤
//                       </span>

//                       <p>
//                         No classes
//                       </p>

//                     </div>

//                   ) : (

//                     classes.map((item, index) => (

//                       <div
//                         className="student-class-card"
//                         key={
//                           item.id ||
//                           `${day}-${index}`
//                         }
//                       >

//                         {/* TIME */}

//                         <div className="student-class-time">

//                           <div className="time-start">
//                             {item.startTime || "-"}
//                           </div>

//                           <div className="time-line">
//                             <span></span>
//                           </div>

//                           <div className="time-end">
//                             {item.endTime || "-"}
//                           </div>

//                         </div>


//                         {/* DETAILS */}

//                         <div className="student-class-details">

//                           <div className="student-subject-icon">
//                             📖
//                           </div>

//                           <div>

//                             <h4>
//                               {item.subjectName ||
//                                 item.subject?.subjectName ||
//                                 "Subject"}
//                             </h4>

//                             <p>
//                               🏫{" "}
//                               {item.className ||
//                                 item.classEntity?.className ||
//                                 "Class"}
//                             </p>

//                             <p>
//                               🚪 Room{" "}
//                               {item.roomNumber ||
//                                 item.room?.roomNumber ||
//                                 "-"}
//                             </p>

//                           </div>

//                         </div>


//                         {/* STATUS */}

//                         <div className="student-class-status">

//                           {item.active === false ? (

//                             <span className="student-inactive-status">
//                               Inactive
//                             </span>

//                           ) : (

//                             <span className="student-active-status">
//                               Active
//                             </span>

//                           )}

//                         </div>

//                       </div>

//                     ))

//                   )}

//                 </div>

//               </div>

//             );

//           })}

//         </div>

//       )}

//     </div>
//   );
// };

// export default StudentTimetable;



import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./student-timetable.css";

const StudentTimetable = () => {
  const [studentName, setStudentName] = useState("Student");
  const [className, setClassName] = useState("");
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD STUDENT TIMETABLE
  // =====================================================

  const loadTimetable = async () => {
    try {
      setLoading(true);
      setError("");

      // =====================================================
      // 1. GET LOGGED-IN USER
      // =====================================================

      const userResponse = await api.get("/users/me");

      const user = userResponse.data;

      console.log("Logged-in student:", user);

      if (!user || !user.id) {
        throw new Error(
          "Unable to identify logged-in student."
        );
      }

      if (user.role !== "STUDENT") {
        throw new Error(
          "This page is available only for student accounts."
        );
      }

      // =====================================================
      // 2. GET STUDENT RECORD
      // =====================================================

      const studentResponse =
        await api.get(`/students/user/${user.id}`);

      const student = studentResponse.data;

      console.log("Student record:", student);

      if (!student) {
        throw new Error(
          "Student record not found."
        );
      }

      // =====================================================
      // 3. GET STUDENT NAME
      // =====================================================

      const name =
        student.studentName ||
        student.userFullName ||
        student.user?.fullName ||
        user.fullName ||
        "Student";

      setStudentName(name);

      // =====================================================
      // 4. GET STUDENT CLASS
      // =====================================================

      const studentClassName =
        student.className ||
        student.classEntity?.className ||
        student.classEntity?.name;

      console.log(
        "Student class:",
        studentClassName
      );

      if (!studentClassName) {
        throw new Error(
          "No class is assigned to this student."
        );
      }

      setClassName(studentClassName);

      // =====================================================
      // 5. GET ALL TIMETABLES
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
      // 6. FILTER TIMETABLE BY CLASS
      // =====================================================

      const normalizedClassName =
        studentClassName
          .trim()
          .toLowerCase();

      const myTimetable =
        allTimetables.filter((item) => {

          const timetableClassName =
            item.className ||
            item.classEntity?.className ||
            item.classEntity?.name;

          return (
            timetableClassName &&
            timetableClassName
              .trim()
              .toLowerCase() ===
              normalizedClassName
          );
        });

      console.log(
        "Student class timetable:",
        myTimetable
      );

      // =====================================================
      // 7. SAVE TIMETABLE
      // =====================================================

      setTimetable(myTimetable);

    } catch (err) {

      console.error(
        "Unable to load student timetable:",
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
        "Unable to load timetable."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadTimetable();
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
      .filter(
        (item) =>
          item.dayOfWeek?.toUpperCase() === day
      )
      .sort((a, b) =>
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
      <div className="student-timetable-page">

        <div className="student-timetable-loading">

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
      <div className="student-timetable-page">

        <div className="student-timetable-header">

          <div>

            <span className="student-timetable-label">
              ACADEMICS
            </span>

            <h2>
              My Timetable
            </h2>

            <p>
              View your weekly class timetable.
            </p>

          </div>

          <div className="student-timetable-icon">
            📅
          </div>

        </div>

        <div className="student-timetable-error">

          <div className="student-error-icon">
            ⚠️
          </div>

          <h3>
            Unable to load timetable
          </h3>

          <p>
            {error}
          </p>

          <button
            onClick={loadTimetable}
          >
            🔄 Try Again
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <div className="student-timetable-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="student-timetable-header">

        <div>

          <span className="student-timetable-label">
            ACADEMICS
          </span>

          <h2>
            My Timetable
          </h2>

          <p>
            View your weekly class timetable,{" "}
            <strong>
              {studentName}
            </strong>.
          </p>

          {className && (
            <p>
              Class: <strong>{className}</strong>
            </p>
          )}

        </div>

        <div className="student-timetable-icon">
          📅
        </div>

      </div>

      {/* =================================================
          NO CLASSES
      ================================================= */}

      {timetable.length === 0 ? (

        <div className="student-timetable-empty">

          <div className="student-empty-icon">
            📚
          </div>

          <h3>
            No timetable assigned
          </h3>

          <p>
            No classes have been assigned
            to your class yet.
          </p>

        </div>

      ) : (

        /* =================================================
           WEEKLY TIMETABLE
        ================================================= */

        <div className="student-timetable-grid">

          {days.map((day) => {

            const classes =
              getClassesForDay(day);

            return (

              <div
                className="student-day-card"
                key={day}
              >

                {/* DAY HEADER */}

                <div className="student-day-header">

                  <div>

                    <h3>
                      {day}
                    </h3>

                    <span>
                      Weekly Classes
                    </span>

                  </div>

                  <div className="student-class-count">
                    {classes.length}
                  </div>

                </div>

                {/* DAY CONTENT */}

                <div className="student-day-content">

                  {classes.length === 0 ? (

                    <div className="student-no-class">

                      <span>
                        💤
                      </span>

                      <p>
                        No classes
                      </p>

                    </div>

                  ) : (

                    classes.map((item, index) => (

                      <div
                        className="student-class-card"
                        key={
                          item.id ||
                          `${day}-${index}`
                        }
                      >

                        {/* TIME */}

                        <div className="student-class-time">

                          <div className="time-start">
                            {item.startTime || "-"}
                          </div>

                          <div className="time-line">
                            <span></span>
                          </div>

                          <div className="time-end">
                            {item.endTime || "-"}
                          </div>

                        </div>

                        {/* DETAILS */}

                        <div className="student-class-details">

                          <div className="student-subject-icon">
                            📖
                          </div>

                          <div>

                            <h4>
                              {item.subjectName ||
                                item.subject?.subjectName ||
                                item.subject?.name ||
                                "Subject"}
                            </h4>

                            <p>
                              🏫{" "}
                              {item.className ||
                                item.classEntity?.className ||
                                "Class"}
                            </p>

                            <p>
                              🚪 Room{" "}
                              {item.roomNumber ||
                                item.room?.roomNumber ||
                                "-"}
                            </p>

                            {item.teacherName && (
                              <p>
                                👨‍🏫{" "}
                                {item.teacherName}
                              </p>
                            )}

                          </div>

                        </div>

                        {/* STATUS */}

                        <div className="student-class-status">

                          {item.active === false ? (

                            <span className="student-inactive-status">
                              Inactive
                            </span>

                          ) : (

                            <span className="student-active-status">
                              Active
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

      {/* =================================================
          REFRESH
      ================================================= */}

      <div className="student-timetable-actions">

        <button
          onClick={loadTimetable}
          className="student-refresh-button"
        >
          🔄 Refresh Timetable
        </button>

      </div>

    </div>
  );
};

export default StudentTimetable;

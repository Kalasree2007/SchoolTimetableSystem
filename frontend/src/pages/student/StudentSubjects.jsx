import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./student-subjects.css";

const StudentSubjects = () => {
  const [studentName, setStudentName] = useState("Student");
  const [className, setClassName] = useState("Class");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD STUDENT SUBJECTS
  // =====================================================

  const loadSubjects = async () => {
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
          "Unable to identify the logged-in student. Please login again."
        );
      }

      if (user.role !== "STUDENT") {
        throw new Error(
          "This page is available only for student accounts."
        );
      }

      // =====================================================
      // 2. STUDENT NAME
      // =====================================================

      const name =
        user.fullName ||
        "Student";

      setStudentName(name);

      // =====================================================
      // 3. GET STUDENT USING USER ID
      // =====================================================

      const studentResponse = await api.get(
        `/students/user/${user.id}`
      );

      const student = studentResponse.data;

      console.log(
        "Student profile:",
        student
      );

      if (!student) {
        throw new Error(
          "Student profile not found."
        );
      }

      // =====================================================
      // 4. GET CLASS ID
      // =====================================================

      const studentClassId =
        student.classId ||
        student.class_id ||
        student.classEntity?.id ||
        student.class?.id;

      // =====================================================
      // 5. GET CLASS NAME
      // =====================================================

      const studentClassName =
        student.className ||
        student.classEntity?.className ||
        student.classEntity?.name ||
        student.class?.className ||
        student.class?.name ||
        "Class";

      console.log(
        "Student Class ID:",
        studentClassId
      );

      console.log(
        "Student Class Name:",
        studentClassName
      );

      setClassName(studentClassName);

      if (!studentClassId && !studentClassName) {
        throw new Error(
          "No class is assigned to this student."
        );
      }

      // =====================================================
      // 6. GET ALL SUBJECTS
      // =====================================================

      const subjectsResponse =
        await api.get("/subjects");

      const allSubjects =
        subjectsResponse.data;

      console.log(
        "All subjects:",
        allSubjects
      );

      if (!Array.isArray(allSubjects)) {
        throw new Error(
          "Invalid subject data received from server."
        );
      }

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
      // 8. FILTER TIMETABLE BY STUDENT CLASS
      // =====================================================

      const myClassTimetable =
        allTimetables.filter((item) => {

          const timetableClassId =
            item.classId ||
            item.class_id ||
            item.classEntity?.id ||
            item.class?.id;

          const timetableClassName =
            item.className ||
            item.classEntity?.className ||
            item.classEntity?.name ||
            item.class?.className ||
            item.class?.name;

          // Match using class ID
          if (
            studentClassId &&
            timetableClassId
          ) {
            return (
              Number(timetableClassId) ===
              Number(studentClassId)
            );
          }

          // Fallback to class name
          if (
            studentClassName &&
            timetableClassName
          ) {
            return (
              timetableClassName
                .trim()
                .toLowerCase() ===
              studentClassName
                .trim()
                .toLowerCase()
            );
          }

          return false;
        });

      console.log(
        "My class timetable:",
        myClassTimetable
      );

      // =====================================================
      // 9. GET SUBJECT IDs FROM TIMETABLE
      // =====================================================

      const subjectIds = [
        ...new Set(
          myClassTimetable
            .map((item) => {

              return (
                item.subjectId ||
                item.subject_id ||
                item.subject?.id
              );

            })
            .filter(Boolean)
        )
      ];

      console.log(
        "My class subject IDs:",
        subjectIds
      );

      // =====================================================
      // 10. FILTER SUBJECTS
      // =====================================================

      const mySubjects =
        allSubjects
          .filter((subject) => {

            return subjectIds.some(
              (subjectId) =>
                Number(subject.id) ===
                Number(subjectId)
            );

          })
          .map((subject) => {

            // Find timetable entries for this subject
            const matchingEntries =
              myClassTimetable.filter((item) => {

                const timetableSubjectId =
                  item.subjectId ||
                  item.subject_id ||
                  item.subject?.id;

                return (
                  Number(timetableSubjectId) ===
                  Number(subject.id)
                );

              });

            // Get teacher names
            const teacherNames = [
              ...new Set(
                matchingEntries
                  .map((item) => {

                    return (
                      item.teacherName ||
                      item.teacher?.user?.fullName ||
                      item.teacher?.fullName ||
                      item.teacher?.name
                    );

                  })
                  .filter(Boolean)
              )
            ];

            return {
              ...subject,

              teacherName:
                teacherNames.length > 0
                  ? teacherNames.join(", ")
                  : "Not Assigned"
            };

          });

      console.log(
        "Student subjects:",
        mySubjects
      );

      setSubjects(mySubjects);

    } catch (err) {

      console.error(
        "Unable to load student subjects:",
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
        "Unable to load subjects."
      );

    } finally {

      setLoading(false);

    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadSubjects();
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="student-subjects-page">

        <div className="student-subjects-loading">

          <div className="subjects-loading-icon">
            📚
          </div>

          <h3>
            Loading subjects...
          </h3>

          <p>
            Fetching subjects assigned to your class.
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
      <div className="student-subjects-page">

        <div className="student-subjects-header">

          <div>

            <span className="student-subjects-label">
              STUDENT PORTAL
            </span>

            <h2>
              My Subjects
            </h2>

            <p>
              View subjects assigned to your class.
            </p>

          </div>

          <div className="subjects-header-icon">
            📚
          </div>

        </div>

        <div className="student-subjects-error">

          <div className="subjects-error-icon">
            ⚠️
          </div>

          <h3>
            Unable to load subjects
          </h3>

          <p>
            {error}
          </p>

          <button
            className="subjects-retry-button"
            onClick={loadSubjects}
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
    <div className="student-subjects-page">

      {/* HEADER */}

      <div className="student-subjects-header">

        <div>

          <span className="student-subjects-label">
            ACADEMICS
          </span>

          <h2>
            My Subjects
          </h2>

          <p>
            View the subjects assigned to{" "}
            <strong>
              {studentName}
            </strong>.
          </p>

        </div>

        <div className="subjects-header-icon">
          📚
        </div>

      </div>

      {/* SUMMARY */}

      <div className="subjects-summary-card">

        <div className="subjects-summary-icon">
          🎓
        </div>

        <div>

          <span>
            MY CLASS
          </span>

          <strong>
            {className}
          </strong>

          <small>
            {subjects.length} subject
            {subjects.length !== 1 ? "s" : ""} assigned
          </small>

        </div>

      </div>

      {/* NO SUBJECTS */}

      {subjects.length === 0 ? (

        <div className="student-subjects-empty">

          <div className="subjects-empty-icon">
            📖
          </div>

          <h3>
            No subjects available
          </h3>

          <p>
            No subjects have been assigned
            to your class yet.
          </p>

        </div>

      ) : (

        <div className="student-subject-grid">

          {subjects.map((subject) => (

            <div
              className="student-subject-card"
              key={subject.id}
            >

              {/* TOP */}

              <div className="subject-card-top">

                <div className="subject-icon">
                  📘
                </div>

                <span
                  className={
                    subject.active
                      ? "subject-active"
                      : "subject-inactive"
                  }
                >
                  {subject.active
                    ? "Active"
                    : "Inactive"}
                </span>

              </div>

              {/* SUBJECT */}

              <h3>
                {subject.subjectName ||
                  subject.name ||
                  "Subject"}
              </h3>

              {/* CODE */}

              <div className="subject-code">

                <span>
                  Subject Code
                </span>

                <strong>
                  {subject.subjectCode || "-"}
                </strong>

              </div>

              {/* DETAILS */}

              <div className="subject-details">

                {/* TEACHER */}

                <div className="subject-detail-row">

                  <span>
                    👨‍🏫
                  </span>

                  <div>

                    <small>
                      Teacher
                    </small>

                    <strong>
                      {subject.teacherName ||
                        "Not Assigned"}
                    </strong>

                  </div>

                </div>

                {/* DEPARTMENT */}

                <div className="subject-detail-row">

                  <span>
                    🏢
                  </span>

                  <div>

                    <small>
                      Department
                    </small>

                    <strong>
                      {subject.departmentName ||
                        subject.department?.departmentName ||
                        "Not Assigned"}
                    </strong>

                  </div>

                </div>

                {/* CREDITS */}

                <div className="subject-detail-row">

                  <span>
                    ⭐
                  </span>

                  <div>

                    <small>
                      Credits
                    </small>

                    <strong>
                      {subject.credits ?? "-"}
                    </strong>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* REFRESH */}

      <div className="student-subject-actions">

        <button
          className="subjects-refresh-button"
          onClick={loadSubjects}
        >
          🔄 Refresh Subjects
        </button>

      </div>

    </div>
  );
};

export default StudentSubjects;

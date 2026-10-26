import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./child-subjects.css";

const ChildSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [studentName, setStudentName] = useState("Student");
  const [className, setClassName] = useState("Class");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD CHILD SUBJECTS
  // =====================================================

  const loadChildSubjects = async () => {
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

      console.log("Parent:", parentData);

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
      // 4. GET CHILD / STUDENT DETAILS
      // =====================================================

      const studentResponse = await api.get(
        `/students/${childId}`
      );

      const student = studentResponse.data;

      console.log("Child student:", student);

      if (!student) {
        throw new Error(
          "Student information not found."
        );
      }

      // =====================================================
      // 5. GET CHILD NAME
      // =====================================================

      const name =
        student.studentName ||
        student.userFullName ||
        student.fullName ||
        student.user?.fullName ||
        student.name ||
        parentData.studentName ||
        "Student";

      setStudentName(name);

      // =====================================================
      // 6. GET CHILD CLASS
      // =====================================================

      const studentClassId =
        student.classId ||
        student.class_id ||
        student.classEntity?.id ||
        student.class?.id;

      const studentClassName =
        student.className ||
        student.classEntity?.className ||
        student.classEntity?.name ||
        student.class?.className ||
        student.class?.name;

      console.log("Student Class ID:", studentClassId);
      console.log("Student Class Name:", studentClassName);

      if (!studentClassId && !studentClassName) {
        throw new Error(
          "No class is assigned to this student."
        );
      }

      setClassName(
        studentClassName || "Class"
      );

      // =====================================================
      // 7. GET ALL SUBJECTS
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
      // 8. GET ALL TIMETABLES
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
      // 9. FILTER TIMETABLE BY STUDENT CLASS
      // =====================================================

      const classTimetable =
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

          // First preference: class ID
          if (
            studentClassId &&
            timetableClassId
          ) {
            return (
              Number(timetableClassId) ===
              Number(studentClassId)
            );
          }

          // Second preference: class name
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
        "Child class timetable:",
        classTimetable
      );

      // =====================================================
      // 10. GET SUBJECT IDs FROM CHILD CLASS TIMETABLE
      // =====================================================

      const subjectIds = [
        ...new Set(
          classTimetable
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
        "Child class subject IDs:",
        subjectIds
      );

      // =====================================================
      // 11. FILTER SUBJECTS
      // =====================================================

      const childSubjects =
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
            const matchingTimetable =
              classTimetable.filter((item) => {

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
                matchingTimetable
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
        "Child subjects:",
        childSubjects
      );

      setSubjects(childSubjects);

    } catch (err) {

      console.error(
        "Unable to load child subjects:",
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
        "Unable to load child subjects."
      );

    } finally {

      setLoading(false);

    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadChildSubjects();
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
            Loading child's subjects...
          </h3>

          <p>
            Fetching subjects for {studentName}.
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
              PARENT PORTAL
            </span>

            <h2>
              Child Subjects
            </h2>

            <p>
              View {studentName}'s subjects.
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
            onClick={loadChildSubjects}
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

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="student-subjects-header">

        <div>

          <span className="student-subjects-label">
            PARENT PORTAL
          </span>

          <h2>
            Child Subjects
          </h2>

          <p>
            View the academic subjects assigned to{" "}
            <strong>
              {studentName}
            </strong>.
          </p>

        </div>

        <div className="subjects-header-icon">
          📚
        </div>

      </div>

      {/* =====================================================
          CHILD SUMMARY
      ===================================================== */}

      <div className="subjects-summary-card">

        <div className="subjects-summary-icon">
          🎓
        </div>

        <div>

          <span>
            CHILD
          </span>

          <strong>
            {studentName}
          </strong>

          <small>
            Class: {className}
          </small>

        </div>

      </div>

      {/* =====================================================
          NO SUBJECTS
      ===================================================== */}

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
            to {studentName}'s class yet.
          </p>

        </div>

      ) : (

        /* ===================================================
           SUBJECT GRID
        =================================================== */

        <div className="student-subject-grid">

          {subjects.map((subject) => (

            <div
              className="student-subject-card"
              key={subject.id}
            >

              {/* =================================================
                  CARD TOP
              ================================================= */}

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

              {/* =================================================
                  SUBJECT NAME
              ================================================= */}

              <h3>
                {subject.subjectName ||
                  subject.name ||
                  "Subject"}
              </h3>

              {/* =================================================
                  SUBJECT CODE
              ================================================= */}

              <div className="subject-code">

                <span>
                  Subject Code
                </span>

                <strong>
                  {subject.subjectCode ||
                    "-"}
                </strong>

              </div>

              {/* =================================================
                  DETAILS
              ================================================= */}

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
                      {subject.credits ??
                        "-"}
                    </strong>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* =====================================================
          REFRESH
      ===================================================== */}

      <div className="student-subject-actions">

        <button
          className="subjects-refresh-button"
          onClick={loadChildSubjects}
        >
          🔄 Refresh Subjects
        </button>

      </div>

    </div>
  );
};

export default ChildSubjects;

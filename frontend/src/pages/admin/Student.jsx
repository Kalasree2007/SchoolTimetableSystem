import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./student.css";

const Student = () => {
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [formData, setFormData] = useState({
    admissionNumber: "",
    admissionDate: "",
    rollNumber: "",
    semester: "",
    userId: "",
    classId: "",
    active: true,
  });

  // =====================================================
  // FETCH STUDENTS
  // =====================================================

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/students");

      console.log("Students response:", response.data);

      setStudents(response.data);
    } catch (err) {
      console.error("Error fetching students:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load students."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentUsers = async () => {
    try {
      const response = await api.get("/users/role/STUDENT");

      console.log(
        "Registered student users:",
        response.data
      );

      setUsers(response.data);
    } catch (err) {
      console.error(
        "Error fetching student users:",
        err
      );
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await api.get("/classes");

      console.log(
        "Classes response:",
        response.data
      );

      setClasses(response.data);
    } catch (err) {
      console.error(
        "Error fetching classes:",
        err
      );
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchStudentUsers();
    fetchClasses();
  }, []);

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setError("");
  };

  const openAddModal = () => {
    setEditingStudent(null);

    setFormData({
      admissionNumber: "",
      admissionDate: "",
      rollNumber: "",
      semester: "",
      userId: "",
      classId: "",
      active: true,
    });

    setError("");
    setShowModal(true);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);

    setFormData({
      admissionNumber:
        student.admissionNumber || "",

      admissionDate:
        student.admissionDate || "",

      rollNumber:
        student.rollNumber || "",

      semester:
        student.semester || "",

      userId:
        student.userId || "",

      classId:
        student.classId || "",

      active:
        student.active !== undefined
          ? student.active
          : true,
    });

    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStudent(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Admission Number
    if (!formData.admissionNumber.trim()) {
      setError(
        "Admission Number is required."
      );
      return;
    }

    // Admission Date
    if (!formData.admissionDate) {
      setError(
        "Admission Date is required."
      );
      return;
    }

    // Roll Number
    if (!formData.rollNumber.trim()) {
      setError(
        "Roll Number is required."
      );
      return;
    }

    // Semester
    if (!formData.semester.trim()) {
      setError(
        "Semester is required."
      );
      return;
    }

    // User
    if (!editingStudent && !formData.userId) {
      setError(
        "Please select a registered student."
      );
      return;
    }

    // Class
    if (!formData.classId) {
      setError(
        "Please select a class."
      );
      return;
    }

    try {

      const payload = {
        admissionNumber:
          formData.admissionNumber.trim(),

        admissionDate:
          formData.admissionDate,

        rollNumber:
          formData.rollNumber.trim(),

        semester:
          formData.semester.trim(),

        classId:
          Number(formData.classId),

        active:
          formData.active,
      };

      // userId is required only while creating
      if (!editingStudent) {
        payload.userId =
          Number(formData.userId);
      }

      console.log(
        "Student payload:",
        payload
      );

      if (!editingStudent) {
        await api.post(
          "/students",
          payload
        );
      }

      else {
        await api.put(
          `/students/${editingStudent.id}`,
          payload
        );
      }

      closeModal();

      await fetchStudents();

    } catch (err) {
      console.error(
        "Student save error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to save student."
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this student?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(
        `/students/${id}`
      );

      await fetchStudents();

    } catch (err) {
      console.error(
        "Student delete error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to delete student."
      );
    }
  };

  const getStudentName = (student) => {
    return (
      student.studentName ||
      student.userFullName ||
      student.fullName ||
      student.user?.fullName ||
      "Unknown Student"
    );
  };

  const getStudentEmail = (student) => {
    const user = users.find(
      (item) =>
        Number(item.id) ===
        Number(student.userId)
    );

    return (
      user?.email ||
      student.email ||
      "-"
    );
  };

  const getClassName = (student) => {
    return (
      student.className ||
      student.class?.className ||
      "-"
    );
  };

  return (
    <div className="students-page">

      <div className="students-header">

        <div>
          <h2>Students</h2>

          <p>
            Manage students, admission details,
            classes and academic information.
          </p>
        </div>

        <button
          className="add-student-btn"
          onClick={openAddModal}
        >
          + Add Student
        </button>

      </div>

      {error && (
        <div className="student-error">
          {error}
        </div>
      )}

      <div className="students-card">

        <div className="students-card-header">

          <div>

            <h3>
              All Students
            </h3>

            <span>
              {students.length} students
            </span>

          </div>

        </div>

        {loading ? (

          <div className="student-loading">
            Loading students...
          </div>

        ) : students.length === 0 ? (

          <div className="student-empty">

            <div className="empty-student-icon">
              ◉
            </div>

            <h3>
              No Students Found
            </h3>

            <p>
              Add your first student
              to get started.
            </p>

            <button
              className="empty-student-btn"
              onClick={openAddModal}
            >
              + Add Student
            </button>

          </div>

        ) : (

          <div className="student-table-wrapper">

            <table className="student-table">

              <thead>

                <tr>

                  <th>
                    STUDENT
                  </th>

                  <th>
                    ADMISSION NO
                  </th>

                  <th>
                    ADMISSION DATE
                  </th>

                  <th>
                    ROLL NO
                  </th>

                  <th>
                    SEMESTER
                  </th>

                  <th>
                    CLASS
                  </th>

                  <th>
                    STATUS
                  </th>

                  <th>
                    ACTIONS
                  </th>

                </tr>

              </thead>


              <tbody>

                {students.map(
                  (student) => (

                    <tr
                      key={student.id}
                    >

                      <td>

                        <div className="student-name">

                          <div className="student-avatar">

                            {getStudentName(
                              student
                            )
                              .charAt(0)
                              .toUpperCase()}

                          </div>

                          <div>

                            <strong>
                              {getStudentName(
                                student
                              )}
                            </strong>

                            <small>
                              {getStudentEmail(
                                student
                              )}
                            </small>

                          </div>

                        </div>

                      </td>

                      <td>
                        {student.admissionNumber ||
                          "-"}
                      </td>

                      <td>
                        {student.admissionDate ||
                          "-"}
                      </td>

                      <td>
                        {student.rollNumber ||
                          "-"}
                      </td>

                      <td>
                        {student.semester ||
                          "-"}
                      </td>

                      <td>

                        <span className="class-badge">

                          {getClassName(
                            student
                          )}

                        </span>

                      </td>

                      <td>

                        {student.active ? (

                          <span className="status-active">
                            Active
                          </span>

                        ) : (

                          <span className="status-inactive">
                            Inactive
                          </span>

                        )}

                      </td>

                      <td>

                        <div className="student-actions">

                          <button
                            className="student-edit-btn"
                            onClick={() =>
                              openEditModal(
                                student
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="student-delete-btn"
                            onClick={() =>
                              handleDelete(
                                student.id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {showModal && (

        <div className="student-modal-overlay">

          <div className="student-modal">

            <div className="student-modal-header">

              <div>

                <h3>

                  {editingStudent
                    ? "Edit Student"
                    : "Add Student"}

                </h3>

                <p>
                  Enter student details below.
                </p>

              </div>

              <button
                type="button"
                className="student-close-btn"
                onClick={closeModal}
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
            >

              <div className="student-form-group">

                <label>
                  Registered Student
                </label>

                <select
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  disabled={!!editingStudent}
                  required={!editingStudent}
                >

                  <option value="">
                    Select Registered Student
                  </option>

                  {users.map(
                    (user) => (

                      <option
                        key={user.id}
                        value={user.id}
                      >
                        {user.fullName}
                        {" - "}
                        {user.email}
                      </option>

                    )
                  )}

                </select>

                {!editingStudent &&
                  users.length === 0 && (
                    <small>
                      No registered student
                      accounts found.
                    </small>
                  )}

              </div>

              <div className="student-form-group">

                <label>
                  Admission Number
                </label>

                <input
                  type="text"
                  name="admissionNumber"
                  placeholder="Example: ADM001"
                  value={
                    formData.admissionNumber
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

              <div className="student-form-group">

                <label>
                  Admission Date
                </label>

                <input
                  type="date"
                  name="admissionDate"
                  value={
                    formData.admissionDate
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

              <div className="student-form-group">

                <label>
                  Roll Number
                </label>

                <input
                  type="text"
                  name="rollNumber"
                  placeholder="Example: 23CS101"
                  value={
                    formData.rollNumber
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

              <div className="student-form-group">

                <label>
                  Semester
                </label>

                <input
                  type="text"
                  name="semester"
                  placeholder="Example: 5"
                  value={
                    formData.semester
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

              <div className="student-form-group">

                <label>
                  Class
                </label>

                <select
                  name="classId"
                  value={
                    formData.classId
                  }
                  onChange={
                    handleChange
                  }
                  required
                >

                  <option value="">
                    Select Class
                  </option>

                  {classes.map(
                    (classItem) => (

                      <option
                        key={classItem.id}
                        value={classItem.id}
                      >

                        {classItem.className}

                        {" - "}

                        {classItem.section}

                        {" ("}

                        {classItem.academicYear}

                        {")"}

                      </option>

                    )
                  )}

                </select>

                {classes.length === 0 && (
                  <small>
                    No classes found.
                    Create a class first.
                  </small>
                )}

              </div>

              <div className="student-active-group">

                <input
                  type="checkbox"
                  id="student-active"
                  name="active"
                  checked={
                    formData.active
                  }
                  onChange={
                    handleChange
                  }
                />

                <label htmlFor="student-active">
                  Student is active
                </label>

              </div>

              <div className="student-modal-buttons">

                <button
                  type="button"
                  className="student-cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="student-save-btn"
                >

                  {editingStudent
                    ? "Update Student"
                    : "Create Student"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Student;
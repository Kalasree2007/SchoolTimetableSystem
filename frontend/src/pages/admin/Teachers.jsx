import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./teachers.css";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [teacherUsers, setTeacherUsers] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  const [formData, setFormData] = useState({
    userId: "",
    employeeId: "",
    qualification: "",
    experience: "",
    specialization: "",
    departmentId: "",
    active: true,
  });

  // =====================================================
  // FETCH TEACHERS
  // =====================================================

  const fetchTeachers = async () => {
    try {
      setError("");

      const response = await api.get("/teachers");

      console.log("Teachers response:", response.data);

      setTeachers(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err) {
      console.error("Error fetching teachers:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load teachers."
      );
    }
  };

  // =====================================================
  // FETCH REGISTERED TEACHER USERS
  // =====================================================

  const fetchTeacherUsers = async () => {
  try {
    const response = await api.get("/users/role/TEACHER");

    console.log("Registered Teacher Users:", response.data);

    setTeacherUsers(
      Array.isArray(response.data)
        ? response.data
        : []
    );
  } catch (err) {
    console.error(
      "Error fetching teacher users:",
      err
    );
  }
};

  // =====================================================
  // FETCH DEPARTMENTS
  // =====================================================

  const fetchDepartments = async () => {
    try {
      const response = await api.get(
        "/departments"
      );

      console.log(
        "Departments response:",
        response.data
      );

      setDepartments(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err) {
      console.error(
        "Error fetching departments:",
        err
      );
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([
        fetchTeachers(),
        fetchTeacherUsers(),
        fetchDepartments(),
      ]);

      setLoading(false);
    };

    loadData();
  }, []);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

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

  // =====================================================
  // GET TEACHER NAME
  // =====================================================

  const getTeacherName = (teacher) => {
    return (
      teacher.teacherName ||
      "Unknown Teacher"
    );
  };

  
  // =====================================================
  // GET TEACHER EMAIL
  // =====================================================

const getTeacherEmail = (teacher) => {
  const user = teacherUsers.find(
    (item) =>
      Number(item.id) === Number(teacher.userId)
  );

  return user?.email || "-";
};


  // =====================================================
  // GET DEPARTMENT NAME
  // =====================================================

  const getDepartmentName = (teacher) => {
    return (
      teacher.departmentName ||
      teacher.department?.departmentName ||
      "-"
    );
  };

  // =====================================================
  // OPEN ADD MODAL
  // =====================================================

  const openAddModal = () => {
    setEditingTeacher(null);

    setFormData({
      userId: "",
      employeeId: "",
      qualification: "",
      experience: "",
      specialization: "",
      departmentId: "",
      active: true,
    });

    setError("");
    setShowModal(true);
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const openEditModal = (teacher) => {
    setEditingTeacher(teacher);

    setFormData({
      userId:
        teacher.userId ||
        teacher.user?.id ||
        "",

      employeeId:
        teacher.employeeId || "",

      qualification:
        teacher.qualification || "",

      experience:
        teacher.experience !== null &&
        teacher.experience !== undefined
          ? teacher.experience
          : "",

      specialization:
        teacher.specialization || "",

      departmentId:
        teacher.departmentId ||
        teacher.department?.id ||
        "",

      active:
        teacher.active !== undefined
          ? teacher.active
          : true,
    });

    setError("");
    setShowModal(true);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {
    setShowModal(false);
    setEditingTeacher(null);

    setFormData({
      userId: "",
      employeeId: "",
      qualification: "",
      experience: "",
      specialization: "",
      departmentId: "",
      active: true,
    });

    setError("");
  };

  // =====================================================
  // CREATE / UPDATE TEACHER
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // ===================================================
    // VALIDATION
    // ===================================================

    if (!formData.userId) {
      setError(
        "Please select the registered teacher user."
      );
      return;
    }

    if (!formData.employeeId.trim()) {
      setError(
        "Employee ID is required."
      );
      return;
    }

    if (!formData.qualification.trim()) {
      setError(
        "Qualification is required."
      );
      return;
    }

    if (!formData.departmentId) {
      setError(
        "Please select a department."
      );
      return;
    }

    try {
      // =================================================
      // PAYLOAD
      // =================================================

      const payload = {
        userId: Number(
          formData.userId
        ),

        employeeId:
          formData.employeeId.trim(),

        qualification:
          formData.qualification.trim(),

        experience:
          formData.experience === ""
            ? null
            : Number(
                formData.experience
              ),

        specialization:
          formData.specialization.trim(),

        active:
          formData.active,

        departmentId:
          Number(
            formData.departmentId
          ),
      };

      console.log(
        "Teacher payload:",
        payload
      );

      // =================================================
      // CREATE
      // =================================================

      if (!editingTeacher) {
        const response =
          await api.post(
            "/teachers",
            payload
          );

        console.log(
          "Teacher created:",
          response.data
        );
      }

      // =================================================
      // UPDATE
      // =================================================

      else {
        const response =
          await api.put(
            `/teachers/${editingTeacher.id}`,
            payload
          );

        console.log(
          "Teacher updated:",
          response.data
        );
      }

      // =================================================
      // CLOSE MODAL
      // =================================================

      closeModal();

      // =================================================
      // REFRESH DATA
      // =================================================

      await fetchTeachers();

      // Refresh registered users too
      await fetchTeacherUsers();

    } catch (err) {
      console.error(
        "Teacher save error:",
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
          "Unable to save teacher."
      );
    }
  };

  // =====================================================
  // DELETE TEACHER
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this teacher?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(
        `/teachers/${id}`
      );

      await fetchTeachers();

    } catch (err) {
      console.error(
        "Teacher delete error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to delete teacher."
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="teachers-page">

        <div className="teacher-loading">
          Loading teachers...
        </div>

      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="teachers-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="teachers-header">

        <div>

          <h2>
            Teachers
          </h2>

          <p>
            Manage teachers, qualifications,
            specializations and departments.
          </p>

        </div>

        <button
          className="add-teacher-btn"
          onClick={openAddModal}
        >
          + Add Teacher
        </button>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="teacher-error">
          {error}
        </div>
      )}


      {/* =================================================
          MAIN CARD
      ================================================= */}

      <div className="teachers-card">

        <div className="teachers-card-header">

          <div>

            <h3>
              All Teachers
            </h3>

            <span>
              {teachers.length} teachers
            </span>

          </div>

        </div>


        {/* =================================================
            EMPTY
        ================================================= */}

        {teachers.length === 0 ? (

          <div className="teacher-empty">

            <div className="empty-teacher-icon">
              ◉
            </div>

            <h3>
              No Teachers Found
            </h3>

            <p>
              Add your first teacher to
              get started.
            </p>

            <button
              className="empty-teacher-btn"
              onClick={openAddModal}
            >
              + Add Teacher
            </button>

          </div>

        ) : (

          /* =================================================
             TABLE
          ================================================= */

          <div className="teacher-table-wrapper">

            <table className="teacher-table">

              <thead>

                <tr>

                  <th>
                    TEACHER
                  </th>

                  <th>
                    EMPLOYEE ID
                  </th>

                  <th>
                    QUALIFICATION
                  </th>

                  <th>
                    EXPERIENCE
                  </th>

                  <th>
                    SPECIALIZATION
                  </th>

                  <th>
                    DEPARTMENT
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

                {teachers.map(
                  (teacher) => (

                    <tr
                      key={teacher.id}
                    >

                      {/* TEACHER */}

                      <td>

                        <div className="teacher-name">

                          <div className="teacher-avatar">

                            {getTeacherName(
                              teacher
                            )
                              .charAt(0)
                              .toUpperCase()}

                          </div>

                          <div>

                            <strong>
                              {getTeacherName(
                                teacher
                              )}
                            </strong><br/>

                            <small>
                              {getTeacherEmail(
                                teacher
                              )}
                            </small>

                          </div>

                        </div>

                      </td>


                      {/* EMPLOYEE ID */}

                      <td>
                        {teacher.employeeId ||
                          " "}
                      </td>


                      {/* QUALIFICATION */}

                      <td>
                        {teacher.qualification ||
                          " "}
                      </td>


                      {/* EXPERIENCE */}

                      <td>

                        {teacher.experience !==
                          null &&
                        teacher.experience !==
                          undefined
                          ? `${teacher.experience} years`
                          : " "}

                      </td>


                      {/* SPECIALIZATION */}

                      <td>
                        {teacher.specialization ||
                          " "}
                      </td>


                      {/* DEPARTMENT */}

                      <td>

                        <span className="department-badge">

                          {getDepartmentName(
                            teacher
                          )}

                        </span>

                      </td>


                      {/* STATUS */}

                      <td>

                        {teacher.active ? (

                          <span className="status-active">
                            Active
                          </span>

                        ) : (

                          <span className="status-inactive">
                            Inactive
                          </span>

                        )}

                      </td>


                      {/* ACTIONS */}

                      <td>

                        <div className="teacher-actions">

                          <button
                            className="teacher-edit-btn"
                            onClick={() =>
                              openEditModal(
                                teacher
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="teacher-delete-btn"
                            onClick={() =>
                              handleDelete(
                                teacher.id
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


      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showModal && (

        <div className="teacher-modal-overlay">

          <div className="teacher-modal">


            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div className="teacher-modal-header">

              <div>

                <h3>

                  {editingTeacher
                    ? "Edit Teacher"
                    : "Add Teacher"}

                </h3>

                <p>
                  Enter teacher details below.
                </p>

              </div>

              <button
                type="button"
                className="teacher-close-btn"
                onClick={closeModal}
              >
                ×
              </button>

            </div>


            {/* =================================================
                FORM
            ================================================= */}

            <form onSubmit={handleSubmit}>


              {/* =================================================
                  REGISTERED TEACHER USER
              ================================================= */}

              <div className="teacher-form-group">

                <label>
                  Teacher User
                </label>

                <select
                  name="userId"
                  value={
                    formData.userId
                  }
                  onChange={
                    handleChange
                  }
                  required
                  disabled={
                    !!editingTeacher
                  }
                >

                  <option value="">
                    Select Registered Teacher
                  </option>

                  {teacherUsers.map(
                    (user) => (

                      <option
                        key={user.id}
                        value={user.id}
                      >

                        {user.fullName ||
                          user.name ||
                          user.email}

                        {" — "}

                        {user.email}

                      </option>

                    )
                  )}

                </select>


                {teacherUsers.length ===
                  0 && (

                  <small className="form-hint">

                    No registered users with
                    TEACHER role found.

                  </small>

                )}

              </div>


              {/* =================================================
                  EMPLOYEE ID
              ================================================= */}

              <div className="teacher-form-group">

                <label>
                  Employee ID
                </label>

                <input
                  type="text"
                  name="employeeId"
                  placeholder="Example: EMP001"
                  value={
                    formData.employeeId
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>


              {/* =================================================
                  QUALIFICATION
              ================================================= */}

              <div className="teacher-form-group">

                <label>
                  Qualification
                </label>

                <input
                  type="text"
                  name="qualification"
                  placeholder="Example: M.Tech"
                  value={
                    formData.qualification
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>


              {/* =================================================
                  EXPERIENCE
              ================================================= */}

              <div className="teacher-form-group">

                <label>
                  Experience
                </label>

                <input
                  type="number"
                  name="experience"
                  min="0"
                  placeholder="Years of experience"
                  value={
                    formData.experience
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              {/* =================================================
                  SPECIALIZATION
              ================================================= */}

              <div className="teacher-form-group">

                <label>
                  Specialization
                </label>

                <input
                  type="text"
                  name="specialization"
                  placeholder="Example: Data Science"
                  value={
                    formData.specialization
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              {/* =================================================
                  DEPARTMENT
              ================================================= */}

              <div className="teacher-form-group">

                <label>
                  Department
                </label>

                <select
                  name="departmentId"
                  value={
                    formData.departmentId
                  }
                  onChange={
                    handleChange
                  }
                  required
                >

                  <option value="">
                    Select Department
                  </option>

                  {departments.map(
                    (department) => (

                      <option
                        key={
                          department.id
                        }
                        value={
                          department.id
                        }
                      >

                        {
                          department.departmentName
                        }

                      </option>

                    )
                  )}

                </select>

                {departments.length ===
                  0 && (

                  <small className="form-hint">

                    No departments found.

                  </small>

                )}

              </div>


              {/* =================================================
                  ACTIVE
              ================================================= */}

              <div className="teacher-active-group">

                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={
                    formData.active
                  }
                  onChange={
                    handleChange
                  }
                />

                <label htmlFor="active">
                  Teacher is active
                </label>

              </div>


              {/* =================================================
                  BUTTONS
              ================================================= */}

              <div className="teacher-modal-buttons">

                <button
                  type="button"
                  className="teacher-cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="teacher-save-btn"
                  disabled={
                    !formData.userId ||
                    !formData.employeeId.trim() ||
                    !formData.qualification.trim() ||
                    !formData.departmentId
                  }
                >

                  {editingTeacher
                    ? "Update Teacher"
                    : "Create Teacher"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Teachers;
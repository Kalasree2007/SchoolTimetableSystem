import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./parents.css";

const Parents = () => {
  const [parents, setParents] = useState([]);
  const [parentUsers, setParentUsers] = useState([]);
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingParent, setEditingParent] = useState(null);

  const [formData, setFormData] = useState({
    userId: "",
    studentId: "",
    relationship: "",
    occupation: "",
    address: "",
    active: true,
  });

  // =====================================================
  // FETCH PARENTS
  // =====================================================

  const fetchParents = async () => {
    try {
      const response = await api.get("/parents");

      console.log("Parents:", response.data);

      setParents(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err) {
      console.error("Error fetching parents:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load parents."
      );
    }
  };

  // =====================================================
  // FETCH REGISTERED PARENT USERS
  // =====================================================

  const fetchParentUsers = async () => {
    try {
      const response = await api.get(
        "/users/role/PARENT"
      );

      console.log(
        "Registered Parent Users:",
        response.data
      );

      setParentUsers(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err) {
      console.error(
        "Error fetching parent users:",
        err
      );
    }
  };

  // =====================================================
  // FETCH STUDENTS
  // =====================================================

  const fetchStudents = async () => {
    try {
      const response = await api.get("/students");

      console.log("Students:", response.data);

      setStudents(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err) {
      console.error(
        "Error fetching students:",
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
      setError("");

      await Promise.all([
        fetchParents(),
        fetchParentUsers(),
        fetchStudents(),
      ]);

      setLoading(false);
    };

    loadData();
  }, []);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  // =====================================================
  // PARENT NAME
  // =====================================================

  const getParentName = (parent) => {
    return (
      parent.parentName ||
      parent.userFullName ||
      parent.fullName ||
      parent.userName ||
      parent.user?.fullName ||
      "Unknown Parent"
    );
  };

  // =====================================================
  // PARENT EMAIL
  // =====================================================

  const getParentEmail = (parent) => {
  const user = parentUsers.find(
    (item) =>
      Number(item.id) === Number(parent.userId)
  );

  return user?.email || parent.userEmail || parent.email || parent.user?.email || "-";
};
  // =====================================================
  // STUDENT NAME
  // =====================================================

  const getStudentName = (parent) => {
    return (
      parent.studentName ||
      parent.studentFullName ||
      parent.student?.user?.fullName ||
      parent.student?.fullName ||
      parent.student?.studentName ||
      "-"
    );
  };

  // =====================================================
  // GET STUDENT DISPLAY NAME
  // =====================================================

  const getStudentDisplayName = (student) => {
    return (
      student.userFullName ||
      student.fullName ||
      student.user?.fullName ||
      student.studentName ||
      student.name ||
      student.rollNumber ||
      "Student"
    );
  };

  // =====================================================
  // OPEN ADD MODAL
  // =====================================================

  const openAddModal = () => {
    setEditingParent(null);

    setFormData({
      userId: "",
      studentId: "",
      relationship: "",
      occupation: "",
      address: "",
      active: true,
    });

    setError("");
    setShowModal(true);
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const openEditModal = (parent) => {
    setEditingParent(parent);

    setFormData({
      userId:
        parent.userId ||
        parent.user?.id ||
        "",

      studentId:
        parent.studentId ||
        parent.student?.id ||
        "",

      relationship:
        parent.relationship ||
        "",

      occupation:
        parent.occupation ||
        "",

      address:
        parent.address ||
        "",

      active:
        parent.active !== false,
    });

    setError("");
    setShowModal(true);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {
    setShowModal(false);
    setEditingParent(null);

    setFormData({
      userId: "",
      studentId: "",
      relationship: "",
      occupation: "",
      address: "",
      active: true,
    });

    setError("");
  };

  // =====================================================
  // CREATE / UPDATE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // =====================================================
    // BASIC VALIDATION
    // =====================================================

    if (!formData.userId) {
      setError("Please select a parent user.");
      return;
    }

    if (!formData.studentId) {
      setError("Please select a student.");
      return;
    }

    if (!formData.relationship.trim()) {
      setError("Please select a relationship.");
      return;
    }

    try {
      // ===================================================
      // PAYLOAD
      // ===================================================

      const payload = {
        userId: Number(formData.userId),

        studentId: Number(formData.studentId),

        relationship:
          formData.relationship.trim(),

        occupation:
          formData.occupation.trim(),

        address:
          formData.address.trim(),

        active: true,
      };

      console.log(
        "Parent payload:",
        payload
      );

      // ===================================================
      // UPDATE
      // ===================================================

      if (editingParent) {
        await api.put(
          `/parents/${editingParent.id}`,
          payload
        );
      }

      // ===================================================
      // CREATE
      // ===================================================

      else {
        await api.post(
          "/parents",
          payload
        );
      }

      // ===================================================
      // CLOSE MODAL
      // ===================================================

      closeModal();

      // ===================================================
      // REFRESH PARENTS
      // ===================================================

      await fetchParents();

    } catch (err) {
      console.error(
        "Parent save error:",
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
          "Unable to save parent."
      );
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this parent?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(
        `/parents/${id}`
      );

      await fetchParents();

    } catch (err) {
      console.error(
        "Parent delete error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to delete parent."
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="parents-page">

        <div className="parent-loading">
          Loading parents...
        </div>

      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="parents-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="parents-header">

        <div>

          <span className="parents-label">
            ADMIN PORTAL
          </span>

          <h2>
            Parents
          </h2>

          <p>
            Manage parents and their
            associated students.
          </p>

        </div>

        <button
          className="add-parent-btn"
          onClick={openAddModal}
        >
          + Add Parent
        </button>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="parent-error">
          {error}
        </div>
      )}


      {/* =================================================
          MAIN CARD
      ================================================= */}

      <div className="parents-card">

        <div className="parents-card-header">

          <div>

            <h3>
              All Parents
            </h3>

            <span>
              {parents.length} parents
            </span>

          </div>

        </div>


        {/* =================================================
            EMPTY
        ================================================= */}

        {parents.length === 0 ? (

          <div className="parent-empty">

            <div className="empty-parent-icon">
              👨‍👩‍👧
            </div>

            <h3>
              No Parents Found
            </h3>

            <p>
              Add a registered parent
              to get started.
            </p>

            <button
              className="empty-parent-btn"
              onClick={openAddModal}
            >
              + Add Parent
            </button>

          </div>

        ) : (

          /* =================================================
             TABLE
          ================================================= */

          <div className="parent-table-wrapper">

            <table className="parent-table">

              <thead>

                <tr>

                  <th>
                    PARENT
                  </th>

                  <th>
                    EMAIL
                  </th>

                  <th>
                    RELATIONSHIP
                  </th>

                  <th>
                    STUDENT
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

                {parents.map((parent) => (

                  <tr
                    key={parent.id}
                  >

                    {/* PARENT */}

                    <td>

                      <div className="parent-name">

                        <div className="parent-avatar">

                          {getParentName(parent)
                            .charAt(0)
                            .toUpperCase()}

                        </div>

                        <div>

                          <strong>
                            {getParentName(parent)}
                          </strong>

                        </div>

                      </div>

                    </td>


                    {/* EMAIL */}

                    <td>
                      {getParentEmail(parent)}
                    </td>


                    {/* RELATIONSHIP */}

                    <td>

                      <span className="relationship-badge">

                        {parent.relationship ||
                          "-"}

                      </span>

                    </td>


                    {/* STUDENT */}

                    <td>

                      {getStudentName(parent)}

                    </td>


                    {/* STATUS */}

                    <td>

                      {parent.active !== false ? (

                        <span className="parent-status-active">
                          Active
                        </span>

                      ) : (

                        <span className="parent-status-inactive">
                          Inactive
                        </span>

                      )}

                    </td>


                    {/* ACTIONS */}

                    <td>

                      <div className="parent-actions">

                        <button
                          className="parent-edit-btn"
                          onClick={() =>
                            openEditModal(parent)
                          }
                        >
                          Edit
                        </button>


                        <button
                          className="parent-delete-btn"
                          onClick={() =>
                            handleDelete(parent.id)
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* =====================================================
          ADD / EDIT MODAL
      ===================================================== */}

      {showModal && (

        <div className="parent-modal-overlay">

          <div className="parent-modal">

            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div className="parent-modal-header">

              <div>

                <span className="modal-label">
                  PARENT MANAGEMENT
                </span>

                <h3>

                  {editingParent
                    ? "Edit Parent"
                    : "Add Parent"}

                </h3>

                <p>

                  Connect a registered parent
                  account with a student.

                </p>

              </div>


              <button
                type="button"
                className="parent-close-btn"
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
                  PARENT USER
              ================================================= */}

              <div className="parent-form-group">

                <label>
                  Parent User
                </label>


                <select
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  required
                  disabled={!!editingParent}
                >

                  <option value="">
                    Select Registered Parent
                  </option>


                  {parentUsers.map((user) => (

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

                  ))}

                </select>


                {parentUsers.length === 0 && (

                  <small className="form-hint">

                    No registered users with
                    PARENT role found.

                  </small>

                )}

              </div>


              {/* =================================================
                  STUDENT
              ================================================= */}

              <div className="parent-form-group">

                <label>
                  Student
                </label>


                <select
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Student
                  </option>


                  {students.map((student) => (

                    <option
                      key={student.id}
                      value={student.id}
                    >

                      {getStudentDisplayName(student)}

                    </option>

                  ))}

                </select>


                {students.length === 0 && (

                  <small className="form-hint">

                    No students found.

                  </small>

                )}

              </div>

              <div className="parent-form-group">

                <label>
                  Relationship
                </label>


                <select
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Relationship
                  </option>


                  <option value="Father">
                    Father
                  </option>


                  <option value="Mother">
                    Mother
                  </option>


                  <option value="Guardian">
                    Guardian
                  </option>


                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

              <div className="parent-form-group">

                <label>
                  Occupation
                </label>


                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="Enter occupation"
                />

              </div>
              <div className="parent-form-group">

                <label>
                  Address
                </label>


                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  rows="3"
                />

              </div>

              <div className="parent-modal-buttons">

                <button
                  type="button"
                  className="parent-cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="parent-save-btn"
                  disabled={
                    !formData.userId ||
                    !formData.studentId ||
                    !formData.relationship
                  }
                >

                  {editingParent
                    ? "Update Parent"
                    : "Create Parent"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Parents;
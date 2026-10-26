import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./departments.css";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);

  const [formData, setFormData] = useState({
    departmentCode: "",
    departmentName: "",
    description: "",
    active: true,
  });

  // =========================
  // FETCH DEPARTMENTS
  // =========================

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/departments");

      setDepartments(response.data);

    } catch (err) {
      console.error("Error fetching departments:", err);

      setError(
        err.response?.data?.message ||
        "Unable to load departments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);


  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };


  // =========================
  // OPEN ADD
  // =========================

  const openAddModal = () => {

    setEditingDepartment(null);

    setFormData({
      departmentCode: "",
      departmentName: "",
      description: "",
      active: true,
    });

    setShowModal(true);
  };


  // =========================
  // OPEN EDIT
  // =========================

  const openEditModal = (department) => {

    setEditingDepartment(department);

    setFormData({
      departmentCode: department.departmentCode || "",
      departmentName: department.departmentName || "",
      description: department.description || "",
      active: department.active ?? true,
    });

    setShowModal(true);
  };


  // =========================
  // CLOSE MODAL
  // =========================

  const closeModal = () => {
    setShowModal(false);
    setEditingDepartment(null);
  };


  // =========================
  // SAVE
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setError("");

      if (editingDepartment) {

        await api.put(
          `/departments/${editingDepartment.id}`,
          formData
        );

      } else {

        await api.post(
          "/departments",
          formData
        );

      }

      closeModal();

      fetchDepartments();

    } catch (err) {

      console.error("Department save error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to save department."
      );
    }
  };


  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this department?"
    );

    if (!confirmed) {
      return;
    }

    try {

      await api.delete(`/departments/${id}`);

      fetchDepartments();

    } catch (err) {

      console.error("Delete error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to delete department."
      );
    }
  };


  return (
    <div className="departments-page">


      {/* ================= HEADER ================= */}

      <div className="departments-header">

        <div>
          <h2>Departments</h2>

          <p>
            Manage departments in your institution.
          </p>
        </div>

        <button
          className="add-department-btn"
          onClick={openAddModal}
        >
          + Add Department
        </button>

      </div>


      {/* ================= ERROR ================= */}

      {error && (
        <div className="department-error">
          {error}
        </div>
      )}


      {/* ================= CARD ================= */}

      <div className="departments-card">

        <div className="departments-card-header">

          <div>
            <h3>
              All Departments
            </h3>

            <span>
              {departments.length} departments
            </span>
          </div>

        </div>


        {/* ================= LOADING ================= */}

        {loading ? (

          <div className="department-loading">
            Loading departments...
          </div>

        ) : departments.length === 0 ? (

          <div className="department-empty">

            <div className="empty-icon">
              ▤
            </div>

            <h3>
              No Departments Found
            </h3>

            <p>
              Create your first department to get started.
            </p>

            <button
              onClick={openAddModal}
              className="empty-add-btn"
            >
              + Add Department
            </button>

          </div>

        ) : (

          <div className="department-table-wrapper">

            <table className="department-table">

              <thead>

                <tr>
                  <th>CODE</th>
                  <th>DEPARTMENT</th>
                  <th>DESCRIPTION</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>

              </thead>

              <tbody>

                {departments.map((department) => (

                  <tr key={department.id}>

                    <td>
                      <span className="department-code">
                        {department.departmentCode}
                      </span>
                    </td>

                    <td>
                      <strong>
                        {department.departmentName}
                      </strong>
                    </td>

                    <td>
                      <span className="description-text">
                        {department.description || "-"}
                      </span>
                    </td>

                    <td>

                      {department.active ? (

                        <span className="status active">
                          Active
                        </span>

                      ) : (

                        <span className="status inactive">
                          Inactive
                        </span>

                      )}

                    </td>

                    <td>

                      <div className="department-actions">

                        <button
                          className="edit-btn"
                          onClick={() =>
                            openEditModal(department)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(department.id)
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


      {/* ================= MODAL ================= */}

      {showModal && (

        <div className="modal-overlay">

          <div className="department-modal">

            <div className="modal-header">

              <div>

                <h3>
                  {editingDepartment
                    ? "Edit Department"
                    : "Add Department"}
                </h3>

                <p>
                  Enter department information below.
                </p>

              </div>

              <button
                className="close-modal"
                onClick={closeModal}
              >
                ×
              </button>

            </div>


            <form onSubmit={handleSubmit}>

              {/* CODE */}

              <div className="modal-form-group">

                <label>
                  Department Code
                </label>

                <input
                  type="text"
                  name="departmentCode"
                  value={formData.departmentCode}
                  onChange={handleChange}
                  placeholder="Example: CSE"
                  required
                />

              </div>


              {/* NAME */}

              <div className="modal-form-group">

                <label>
                  Department Name
                </label>

                <input
                  type="text"
                  name="departmentName"
                  value={formData.departmentName}
                  onChange={handleChange}
                  placeholder="Example: Computer Science"
                  required
                />

              </div>


              {/* DESCRIPTION */}

              <div className="modal-form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Department description"
                  rows="3"
                />

              </div>


              {/* ACTIVE */}

              <div className="active-checkbox">

                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                />

                <label htmlFor="active">
                  Department is active
                </label>

              </div>


              {/* BUTTONS */}

              <div className="modal-buttons">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                >
                  {editingDepartment
                    ? "Update Department"
                    : "Create Department"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Departments;
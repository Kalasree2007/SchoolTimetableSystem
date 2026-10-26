import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Class.css";

const Class = () => {
  const [classes, setClasses] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    classCode: "",
    className: "",
    section: "",
    academicYear: "",
    capacity: "",
    departmentId: "",
    active: true,
  });

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // ================= FETCH CLASSES =================

  const fetchClasses = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await api.get("/classes");

      console.log("Classes response:", response.data);

      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to load classes."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH DEPARTMENTS =================

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/departments");

      console.log("Departments response:", response.data);

      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  // ================= INITIAL LOAD =================

  useEffect(() => {
    fetchClasses();
    fetchDepartments();
  }, []);

  // ================= HANDLE INPUT =================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setMessage("");
  };

  // ================= RESET FORM =================

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      classCode: "",
      className: "",
      section: "",
      academicYear: "",
      capacity: "",
      departmentId: "",
      active: true,
    });
  };

  // ================= ADD CLASS BUTTON =================

  const handleAddClass = () => {
    resetForm();
    setMessage("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= CANCEL =================

  const handleCancel = () => {
    resetForm();
    setMessage("");
    setShowForm(false);
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!formData.classCode.trim() && !editingId) {
      setMessage("Class code is required.");
      return;
    }

    if (!formData.className.trim()) {
      setMessage("Class name is required.");
      return;
    }

    if (!formData.section.trim()) {
      setMessage("Section is required.");
      return;
    }

    if (!formData.academicYear.trim()) {
      setMessage("Academic year is required.");
      return;
    }

    if (!formData.capacity || Number(formData.capacity) <= 0) {
      setMessage("Capacity must be greater than 0.");
      return;
    }

    if (!formData.departmentId) {
      setMessage("Please select a department.");
      return;
    }

    try {
      setLoading(true);

      // CREATE
      if (!editingId) {
        const payload = {
          classCode: formData.classCode.trim(),
          className: formData.className.trim(),
          section: formData.section.trim(),
          academicYear: formData.academicYear.trim(),
          capacity: Number(formData.capacity),
          departmentId: Number(formData.departmentId),
          active: formData.active,
        };

        console.log("Create class payload:", payload);

        await api.post("/classes", payload);

        setMessage("Class created successfully.");
      }

      // UPDATE
      else {
        const payload = {
          className: formData.className.trim(),
          section: formData.section.trim(),
          academicYear: formData.academicYear.trim(),
          capacity: Number(formData.capacity),
          departmentId: Number(formData.departmentId),
          active: formData.active,
        };

        console.log("Update class payload:", payload);

        await api.put(`/classes/${editingId}`, payload);

        setMessage("Class updated successfully.");
      }

      resetForm();
      setShowForm(false);

      await fetchClasses();
    } catch (error) {
      console.error("Error saving class:", error);

      setMessage(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to save class."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT =================

  const handleEdit = (classItem) => {
    setEditingId(classItem.id);

    setFormData({
      classCode: classItem.classCode || "",
      className: classItem.className || "",
      section: classItem.section || "",
      academicYear: classItem.academicYear || "",
      capacity: classItem.capacity ?? "",
      departmentId:
        classItem.departmentId ||
        classItem.department?.id ||
        "",
      active: classItem.active ?? true,
    });

    setMessage("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= DELETE =================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this class?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await api.delete(`/classes/${id}`);

      setMessage("Class deleted successfully.");

      await fetchClasses();
    } catch (error) {
      console.error("Error deleting class:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to delete class."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= DEPARTMENT NAME =================

  const getDepartmentName = (classItem) => {
    return (
      classItem.departmentName ||
      classItem.department?.departmentName ||
      (classItem.departmentId
        ? `Department ${classItem.departmentId}`
        : "-")
    );
  };

  // ================= UI =================

  return (
    <div className="class-page">

      {/* HEADER */}

      <div className="class-header">
        <div>
          <h1>Class Management</h1>

          <p>
            Create and manage classes
          </p>
        </div>

        {/* TOP ADD CLASS BUTTON */}

        <button
          type="button"
          className="add-class-button"
          onClick={handleAddClass}
        >
          + Add Class
        </button>
      </div>

      {/* MESSAGE */}

      {message && (
        <div className="class-message">
          {message}
        </div>
      )}

      {/* FORM */}

      {showForm && (
        <div className="class-form-card">

          <div className="class-form-title">
            <div>
              <h2>
                {editingId
                  ? "Update Class"
                  : "Add New Class"}
              </h2>

              <p>
                {editingId
                  ? "Update the class details below."
                  : "Enter the details to create a new class."}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="class-form-grid">

              <div className="form-group">
                <label>Class Code</label>

                <input
                  type="text"
                  name="classCode"
                  value={formData.classCode}
                  onChange={handleChange}
                  placeholder="Example: CSE-A"
                  disabled={editingId !== null}
                  required={!editingId}
                />
              </div>

              <div className="form-group">
                <label>Class Name</label>

                <input
                  type="text"
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  placeholder="Example: Computer Science"
                  required
                />
              </div>

              <div className="form-group">
                <label>Section</label>

                <input
                  type="text"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  placeholder="Example: A"
                  required
                />
              </div>

              <div className="form-group">
                <label>Academic Year</label>

                <input
                  type="text"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  placeholder="Example: 2026-2027"
                  required
                />
              </div>

              <div className="form-group">
                <label>Capacity</label>

                <input
                  type="number"
                  name="capacity"
                  min="1"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="Example: 60"
                  required
                />
              </div>

              <div className="form-group">
                <label>Department</label>

                <select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Department
                  </option>

                  {departments.map((department) => (
                    <option
                      key={department.id}
                      value={department.id}
                    >
                      {department.departmentName}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* ACTIVE */}

            <div className="class-active">
              <label>
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                />

                <span>Active</span>
              </label>
            </div>

            {/* FORM BUTTONS */}

            <div className="class-form-buttons">

              {/* ADD / UPDATE */}

              <button
                type="submit"
                className="save-class-button"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Class"
                  : "Add Class"}
              </button>

              {/* CANCEL */}

              <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>

            </div>

          </form>
        </div>
      )}

      {/* TABLE */}

      <div className="class-table-card">

        <div className="class-table-header">

          <h2>All Classes</h2>

          <button
            className="refresh-button"
            onClick={fetchClasses}
            disabled={loading}
          >
            Refresh
          </button>

        </div>

        {loading && classes.length === 0 ? (
          <p className="class-loading">
            Loading classes...
          </p>
        ) : classes.length === 0 ? (
          <p className="class-empty">
            No classes found.
          </p>
        ) : (
          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Class Code</th>
                  <th>Class Name</th>
                  <th>Section</th>
                  <th>Academic Year</th>
                  <th>Capacity</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {classes.map((classItem) => (
                  <tr key={classItem.id}>

                    <td>{classItem.id}</td>

                    <td>
                      {classItem.classCode || "-"}
                    </td>

                    <td>
                      {classItem.className || "-"}
                    </td>

                    <td>
                      {classItem.section || "-"}
                    </td>

                    <td>
                      {classItem.academicYear || "-"}
                    </td>

                    <td>
                      {classItem.capacity ?? "-"}
                    </td>

                    <td>
                      {getDepartmentName(classItem)}
                    </td>

                    <td>
                      <span
                        className={
                          classItem.active
                            ? "status-active"
                            : "status-inactive"
                        }
                      >
                        {classItem.active
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">

                        <button
                          type="button"
                          className="edit-button"
                          onClick={() =>
                            handleEdit(classItem)
                          }
                          disabled={loading}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            handleDelete(classItem.id)
                          }
                          disabled={loading}
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

    </div>
  );
};

export default Class;
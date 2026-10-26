import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./subjects.css";

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const [formData, setFormData] = useState({
    subjectName: "",
    subjectCode: "",
    credits: "",
    departmentId: "",
  });

  // =====================================================
  // FETCH SUBJECTS
  // =====================================================

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/subjects");

      console.log("Subjects response:", response.data);

      setSubjects(response.data);
    } catch (err) {
      console.error("Error fetching subjects:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load subjects."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH DEPARTMENTS
  // =====================================================

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/departments");

      console.log(
        "Departments response:",
        response.data
      );

      setDepartments(response.data);
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
    fetchSubjects();
    fetchDepartments();
  }, []);

  // =====================================================
  // HANDLE INPUT
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
  // OPEN ADD MODAL
  // =====================================================

  const openAddModal = () => {
    setEditingSubject(null);

    setFormData({
      subjectName: "",
      subjectCode: "",
      credits: "",
      departmentId: "",
    });

    setError("");
    setShowModal(true);
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const openEditModal = (subject) => {
    setEditingSubject(subject);

    setFormData({
      subjectName: subject.subjectName || "",

      subjectCode: subject.subjectCode || "",

      credits:
        subject.credits !== null &&
        subject.credits !== undefined
          ? subject.credits
          : "",

      departmentId:
        subject.departmentId ||
        subject.department?.id ||
        "",
    });

    setError("");
    setShowModal(true);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {
    setShowModal(false);
    setEditingSubject(null);
    setError("");
  };

  // =====================================================
  // CREATE / UPDATE SUBJECT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Subject name validation
    if (!formData.subjectName.trim()) {
      setError("Subject name is required.");
      return;
    }

    // Subject code validation
    if (!formData.subjectCode.trim()) {
      setError("Subject code is required.");
      return;
    }

    // Credits validation
    if (!formData.credits) {
      setError("Credits are required.");
      return;
    }

    // Department validation
    if (!formData.departmentId) {
      setError("Please select a department.");
      return;
    }

    try {
      const payload = {
        subjectName:
          formData.subjectName.trim(),

        subjectCode:
          formData.subjectCode.trim(),

        credits:
          Number(formData.credits),

        departmentId:
          Number(formData.departmentId),
      };

      console.log(
        "Subject payload:",
        payload
      );

      // CREATE
      if (!editingSubject) {
        await api.post(
          "/subjects",
          payload
        );
      }

      // UPDATE
      else {
        await api.put(
          `/subjects/${editingSubject.id}`,
          payload
        );
      }

      closeModal();

      await fetchSubjects();
    } catch (err) {
      console.error(
        "Subject save error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to save subject."
      );
    }
  };

  // =====================================================
  // DELETE SUBJECT
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this subject?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(
        `/subjects/${id}`
      );

      await fetchSubjects();
    } catch (err) {
      console.error(
        "Subject delete error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to delete subject."
      );
    }
  };

  // =====================================================
  // GET DEPARTMENT NAME
  // =====================================================

  const getDepartmentName = (subject) => {
    return (
      subject.departmentName ||
      subject.department?.departmentName ||
      "-"
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="subjects-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="subjects-header">

        <div>
          <h2>Subjects</h2>

          <p>
            Manage subjects, credits and
            department assignments.
          </p>
        </div>

        <button
          className="add-subject-btn"
          onClick={openAddModal}
        >
          + Add Subject
        </button>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="subject-error">
          {error}
        </div>
      )}


      {/* =================================================
          MAIN CARD
      ================================================= */}

      <div className="subjects-card">

        <div className="subjects-card-header">

          <div>
            <h3>All Subjects</h3>

            <span>
              {subjects.length} subjects
            </span>
          </div>

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="subject-loading">
            Loading subjects...
          </div>

        ) : subjects.length === 0 ? (

          /* =================================================
             EMPTY
          ================================================= */

          <div className="subject-empty">

            <div className="empty-subject-icon">
              ◈
            </div>

            <h3>
              No Subjects Found
            </h3>

            <p>
              Add your first subject
              to get started.
            </p>

            <button
              className="empty-subject-btn"
              onClick={openAddModal}
            >
              + Add Subject
            </button>

          </div>

        ) : (

          /* =================================================
             TABLE
          ================================================= */

          <div className="subject-table-wrapper">

            <table className="subject-table">

              <thead>

                <tr>
                  <th>SUBJECT</th>
                  <th>SUBJECT CODE</th>
                  <th>CREDITS</th>
                  <th>DEPARTMENT</th>
                  <th>ACTIONS</th>
                </tr>

              </thead>

              <tbody>

                {subjects.map(
                  (subject) => (

                    <tr
                      key={subject.id}
                    >

                      {/* SUBJECT */}

                      <td>

                        <div className="subject-name">

                          <div className="subject-avatar">
                            {(
                              subject.subjectName ||
                              "S"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>

                            <strong>
                              {
                                subject.subjectName ||
                                "-"
                              }
                            </strong>

                            <small>
                              ID: {subject.id}
                            </small>

                          </div>

                        </div>

                      </td>


                      {/* SUBJECT CODE */}

                      <td>

                        <span className="subject-code">
                          {
                            subject.subjectCode ||
                            "-"
                          }
                        </span>

                      </td>


                      {/* CREDITS */}

                      <td>

                        <span className="credits-badge">
                          {subject.credits ?? "-"}
                        </span>

                      </td>


                      {/* DEPARTMENT */}

                      <td>

                        <span className="department-badge">
                          {getDepartmentName(
                            subject
                          )}
                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td>

                        <div className="subject-actions">

                          <button
                            className="subject-edit-btn"
                            onClick={() =>
                              openEditModal(
                                subject
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="subject-delete-btn"
                            onClick={() =>
                              handleDelete(
                                subject.id
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

        <div className="subject-modal-overlay">

          <div className="subject-modal">

            {/* MODAL HEADER */}

            <div className="subject-modal-header">

              <div>

                <h3>
                  {editingSubject
                    ? "Edit Subject"
                    : "Add Subject"}
                </h3>

                <p>
                  Enter subject details below.
                </p>

              </div>

              <button
                type="button"
                className="subject-close-btn"
                onClick={closeModal}
              >
                ×
              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleSubmit}
            >

              {/* SUBJECT NAME */}

              <div className="subject-form-group">

                <label>
                  Subject Name
                </label>

                <input
                  type="text"
                  name="subjectName"
                  placeholder="Example: Data Structures"
                  value={
                    formData.subjectName
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>


              {/* SUBJECT CODE */}

              <div className="subject-form-group">

                <label>
                  Subject Code
                </label>

                <input
                  type="text"
                  name="subjectCode"
                  placeholder="Example: CS301"
                  value={
                    formData.subjectCode
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>


              {/* CREDITS */}

              <div className="subject-form-group">

                <label>
                  Credits
                </label>

                <input
                  type="number"
                  name="credits"
                  min="1"
                  max="10"
                  placeholder="Example: 4"
                  value={
                    formData.credits
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>


              {/* DEPARTMENT */}

              <div className="subject-form-group">

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

              </div>


              {/* BUTTONS */}

              <div className="subject-modal-buttons">

                <button
                  type="button"
                  className="subject-cancel-btn"
                  onClick={
                    closeModal
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="subject-save-btn"
                >
                  {editingSubject
                    ? "Update Subject"
                    : "Create Subject"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};
export default Subjects;
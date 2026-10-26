import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./schedule.css";

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [timetables, setTimetables] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  const [formData, setFormData] = useState({
    scheduleDate: "",
    timetableId: "",
    cancelled: false,
    remarks: "",
    active: true,
  });

  // =====================================================
  // FETCH SCHEDULES
  // =====================================================

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/schedules");

      console.log("Schedules response:", response.data);

      setSchedules(response.data);
    } catch (err) {
      console.error("Error fetching schedules:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load schedules."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH TIMETABLES
  // =====================================================

  const fetchTimetables = async () => {
    try {
      const response = await api.get("/timetables");

      console.log("Timetables response:", response.data);

      setTimetables(response.data);
    } catch (err) {
      console.error("Error fetching timetables:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load timetables."
      );
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchSchedules();
    fetchTimetables();
  }, []);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

  // =====================================================
  // OPEN ADD MODAL
  // =====================================================

  const openAddModal = () => {
    setEditingSchedule(null);

    setFormData({
      scheduleDate: "",
      timetableId: "",
      cancelled: false,
      remarks: "",
      active: true,
    });

    setError("");
    setShowModal(true);
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const openEditModal = (schedule) => {
    setEditingSchedule(schedule);

    setFormData({
      scheduleDate: schedule.scheduleDate || "",

      timetableId:
        schedule.timetableId !== null &&
        schedule.timetableId !== undefined
          ? String(schedule.timetableId)
          : "",

      cancelled:
        schedule.cancelled !== undefined
          ? schedule.cancelled
          : false,

      remarks: schedule.remarks || "",

      active:
        schedule.active !== undefined
          ? schedule.active
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
    setEditingSchedule(null);
    setError("");
  };

  // =====================================================
  // GET TIMETABLE NAME
  // =====================================================

  const getTimetableName = (timetableId) => {
    const timetable = timetables.find(
      (item) => Number(item.id) === Number(timetableId)
    );

    if (!timetable) {
      return `Timetable #${timetableId}`;
    }

    return (
      timetable.timetableName ||
      timetable.name ||
      timetable.title ||
      timetable.timetableCode ||
      `Timetable #${timetable.id}`
    );
  };

  // =====================================================
  // CREATE / UPDATE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Date validation
    if (!formData.scheduleDate) {
      setError("Schedule date is required.");
      return;
    }

    // Timetable validation
    if (!formData.timetableId) {
      setError("Please select a timetable.");
      return;
    }

    // Remarks validation
    if (formData.remarks.length > 300) {
      setError("Remarks cannot exceed 300 characters.");
      return;
    }

    try {
      const payload = {
        scheduleDate: formData.scheduleDate,

        timetableId: Number(formData.timetableId),

        cancelled: formData.cancelled,

        remarks: formData.remarks.trim(),

        active: formData.active,
      };

      console.log("Schedule payload:", payload);

      // =================================================
      // CREATE
      // =================================================

      if (!editingSchedule) {
        await api.post("/schedules", payload);
      }

      // =================================================
      // UPDATE
      // =================================================

      else {
        await api.put(
          `/schedules/${editingSchedule.id}`,
          payload
        );
      }

      closeModal();

      await fetchSchedules();
    } catch (err) {
      console.error("Schedule save error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to save schedule."
      );
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this schedule?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(`/schedules/${id}`);

      await fetchSchedules();
    } catch (err) {
      console.error("Schedule delete error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete schedule."
      );
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="schedules-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="schedules-header">

        <div>
          <h2>Schedules</h2>

          <p>
            Manage scheduled dates, timetables and
            academic schedule status.
          </p>
        </div>

        <button
          className="add-schedule-btn"
          onClick={openAddModal}
        >
          + Add Schedule
        </button>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="schedule-error">
          {error}
        </div>
      )}


      {/* =================================================
          MAIN CARD
      ================================================= */}

      <div className="schedules-card">

        <div className="schedules-card-header">

          <div>
            <h3>All Schedules</h3>

            <span>
              {schedules.length} schedules
            </span>
          </div>

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="schedule-loading">
            Loading schedules...
          </div>

        ) : schedules.length === 0 ? (

          /* =================================================
             EMPTY
          ================================================= */

          <div className="schedule-empty">

            <div className="empty-schedule-icon">
              📅
            </div>

            <h3>
              No Schedules Found
            </h3>

            <p>
              Add your first schedule to get started.
            </p>

            <button
              className="empty-schedule-btn"
              onClick={openAddModal}
            >
              + Add Schedule
            </button>

          </div>

        ) : (

          /* =================================================
             TABLE
          ================================================= */

          <div className="schedule-table-wrapper">

            <table className="schedule-table">

              <thead>

                <tr>
                  <th>DATE</th>
                  <th>TIMETABLE</th>
                  <th>REMARKS</th>
                  <th>STATUS</th>
                  <th>ACTIVE</th>
                  <th>ACTIONS</th>
                </tr>

              </thead>

              <tbody>

                {schedules.map((schedule) => (

                  <tr key={schedule.id}>

                    {/* DATE */}

                    <td>
                      <strong className="schedule-date">
                        {schedule.scheduleDate || "-"}
                      </strong>
                    </td>


                    {/* TIMETABLE */}

                    <td>

                      <span className="timetable-badge">
                        {getTimetableName(
                          schedule.timetableId
                        )}
                      </span>

                    </td>


                    {/* REMARKS */}

                    <td>

                      <span className="schedule-remarks">

                        {schedule.remarks
                          ? schedule.remarks
                          : "-"}

                      </span>

                    </td>


                    {/* CANCELLED STATUS */}

                    <td>

                      {schedule.cancelled ? (

                        <span className="status-cancelled">
                          Cancelled
                        </span>

                      ) : (

                        <span className="status-scheduled">
                          Scheduled
                        </span>

                      )}

                    </td>


                    {/* ACTIVE */}

                    <td>

                      {schedule.active ? (

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

                      <div className="schedule-actions">

                        <button
                          className="schedule-edit-btn"
                          onClick={() =>
                            openEditModal(schedule)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="schedule-delete-btn"
                          onClick={() =>
                            handleDelete(schedule.id)
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


      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showModal && (

        <div className="schedule-modal-overlay">

          <div className="schedule-modal">

            {/* MODAL HEADER */}

            <div className="schedule-modal-header">

              <div>

                <h3>
                  {editingSchedule
                    ? "Edit Schedule"
                    : "Add Schedule"}
                </h3>

                <p>
                  Enter schedule details below.
                </p>

              </div>

              <button
                type="button"
                className="schedule-close-btn"
                onClick={closeModal}
              >
                ×
              </button>

            </div>


            {/* FORM */}

            <form onSubmit={handleSubmit}>

              {/* DATE */}

              <div className="schedule-form-group">

                <label>
                  Schedule Date
                </label>

                <input
                  type="date"
                  name="scheduleDate"
                  value={formData.scheduleDate}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* TIMETABLE */}

              <div className="schedule-form-group">

                <label>
                  Timetable
                </label>

                <select
                  name="timetableId"
                  value={formData.timetableId}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Timetable
                  </option>

                  {timetables.map((timetable) => (

                    <option
                      key={timetable.id}
                      value={timetable.id}
                    >
                      {getTimetableName(
                        timetable.id
                      )}
                    </option>

                  ))}

                </select>

              </div>


              {/* REMARKS */}

              <div className="schedule-form-group">

                <label>
                  Remarks
                </label>

                <textarea
                  name="remarks"
                  placeholder="Enter remarks..."
                  maxLength="300"
                  value={formData.remarks}
                  onChange={handleChange}
                  rows="4"
                />

                <small className="remarks-counter">
                  {formData.remarks.length}/300
                </small>

              </div>


              {/* CANCELLED */}

              <div className="schedule-checkbox-group">

                <input
                  type="checkbox"
                  id="cancelled"
                  name="cancelled"
                  checked={formData.cancelled}
                  onChange={handleChange}
                />

                <label htmlFor="cancelled">
                  Schedule is cancelled
                </label>

              </div>


              {/* ACTIVE */}

              <div className="schedule-checkbox-group">

                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                />

                <label htmlFor="active">
                  Schedule is active
                </label>

              </div>


              {/* BUTTONS */}

              <div className="schedule-modal-buttons">

                <button
                  type="button"
                  className="schedule-cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="schedule-save-btn"
                >
                  {editingSchedule
                    ? "Update Schedule"
                    : "Create Schedule"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Schedule;
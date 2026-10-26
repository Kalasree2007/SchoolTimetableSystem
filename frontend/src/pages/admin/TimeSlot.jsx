import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./timeSlot.css";

const TimeSlot = () => {
  const [timeSlots, setTimeSlots] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingTimeSlot, setEditingTimeSlot] = useState(null);

  const [formData, setFormData] = useState({
    slotName: "",
    startTime: "",
    endTime: "",
    duration: "",
    active: true,
  });

  // =====================================================
  // FETCH TIME SLOTS
  // =====================================================

  const fetchTimeSlots = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/timeslots");

      console.log("Time Slots response:", response.data);

      setTimeSlots(response.data);
    } catch (err) {
      console.error("Error fetching time slots:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load time slots."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchTimeSlots();
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
    setEditingTimeSlot(null);

    setFormData({
      slotName: "",
      startTime: "",
      endTime: "",
      duration: "",
      active: true,
    });

    setError("");
    setShowModal(true);
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const openEditModal = (timeSlot) => {
    setEditingTimeSlot(timeSlot);

    setFormData({
      slotName: timeSlot.slotName || "",

      startTime: timeSlot.startTime
        ? timeSlot.startTime.substring(0, 5)
        : "",

      endTime: timeSlot.endTime
        ? timeSlot.endTime.substring(0, 5)
        : "",

      duration:
        timeSlot.duration !== null &&
        timeSlot.duration !== undefined
          ? timeSlot.duration
          : "",

      active:
        timeSlot.active !== undefined
          ? timeSlot.active
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
    setEditingTimeSlot(null);
    setError("");
  };

  // =====================================================
  // CALCULATE DURATION
  // =====================================================

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) {
      return "";
    }

    const [startHour, startMinute] =
      startTime.split(":").map(Number);

    const [endHour, endMinute] =
      endTime.split(":").map(Number);

    const startTotal =
      startHour * 60 + startMinute;

    const endTotal =
      endHour * 60 + endMinute;

    const difference =
      endTotal - startTotal;

    if (difference <= 0) {
      return "";
    }

    return difference;
  };

  // =====================================================
  // HANDLE TIME CHANGE
  // =====================================================

  const handleTimeChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => {
      const updated = {
        ...previous,
        [name]: value,
      };

      if (
        updated.startTime &&
        updated.endTime
      ) {
        const calculatedDuration =
          calculateDuration(
            updated.startTime,
            updated.endTime
          );

        updated.duration =
          calculatedDuration;
      }

      return updated;
    });

    setError("");
  };

  // =====================================================
  // CREATE / UPDATE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Slot name validation
    if (!formData.slotName.trim()) {
      setError("Slot name is required.");
      return;
    }

    // Start time validation
    if (!formData.startTime) {
      setError("Start time is required.");
      return;
    }

    // End time validation
    if (!formData.endTime) {
      setError("End time is required.");
      return;
    }

    // Start/end validation
    if (
      formData.startTime >=
      formData.endTime
    ) {
      setError(
        "End time must be after start time."
      );
      return;
    }

    const calculatedDuration =
      calculateDuration(
        formData.startTime,
        formData.endTime
      );

    if (!calculatedDuration) {
      setError(
        "Unable to calculate duration."
      );
      return;
    }

    try {
      const payload = {
        slotName:
          formData.slotName.trim(),

        startTime:
          formData.startTime,

        endTime:
          formData.endTime,

        duration:
          Number(calculatedDuration),

        active:
          formData.active,
      };

      console.log(
        "Time Slot payload:",
        payload
      );

      // =================================================
      // CREATE
      // =================================================

      if (!editingTimeSlot) {
        await api.post(
          "/timeslots",
          payload
        );
      }

      // =================================================
      // UPDATE
      // =================================================

      else {
        await api.put(
          `/timeslots/${editingTimeSlot.id}`,
          payload
        );
      }

      closeModal();

      await fetchTimeSlots();

    } catch (err) {
      console.error(
        "Time slot save error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to save time slot."
      );
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this time slot?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(
        `/timeslots/${id}`
      );

      await fetchTimeSlots();

    } catch (err) {
      console.error(
        "Time slot delete error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to delete time slot."
      );
    }
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (time) => {
    if (!time) {
      return "-";
    }

    const parts = time.split(":");

    const hour = Number(parts[0]);
    const minute = parts[1];

    const suffix =
      hour >= 12 ? "PM" : "AM";

    const displayHour =
      hour % 12 === 0
        ? 12
        : hour % 12;

    return `${displayHour}:${minute} ${suffix}`;
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="timeslots-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="timeslots-header">

        <div>
          <h2>Time Slots</h2>

          <p>
            Manage timetable periods and
            class timings.
          </p>
        </div>

        <button
          className="add-timeslot-btn"
          onClick={openAddModal}
        >
          + Add Time Slot
        </button>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="timeslot-error">
          {error}
        </div>
      )}


      {/* =================================================
          CARD
      ================================================= */}

      <div className="timeslots-card">

        <div className="timeslots-card-header">

          <div>
            <h3>
              All Time Slots
            </h3>

            <span>
              {timeSlots.length} time slots
            </span>
          </div>

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="timeslot-loading">
            Loading time slots...
          </div>

        ) : timeSlots.length === 0 ? (

          /* =================================================
             EMPTY
          ================================================= */

          <div className="timeslot-empty">

            <div className="empty-timeslot-icon">
              ◷
            </div>

            <h3>
              No Time Slots Found
            </h3>

            <p>
              Add your first time slot
              to get started.
            </p>

            <button
              className="empty-timeslot-btn"
              onClick={openAddModal}
            >
              + Add Time Slot
            </button>

          </div>

        ) : (

          /* =================================================
             TABLE
          ================================================= */

          <div className="timeslot-table-wrapper">

            <table className="timeslot-table">

              <thead>

                <tr>
                  <th>SLOT NAME</th>
                  <th>START TIME</th>
                  <th>END TIME</th>
                  <th>DURATION</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>

              </thead>

              <tbody>

                {timeSlots.map(
                  (timeSlot) => (

                    <tr
                      key={timeSlot.id}
                    >

                      {/* SLOT NAME */}

                      <td>

                        <div className="timeslot-name">

                          <div className="timeslot-avatar">
                            ◷
                          </div>

                          <strong>
                            {timeSlot.slotName ||
                              "-"}
                          </strong>

                        </div>

                      </td>


                      {/* START TIME */}

                      <td>
                        {formatTime(
                          timeSlot.startTime
                        )}
                      </td>


                      {/* END TIME */}

                      <td>
                        {formatTime(
                          timeSlot.endTime
                        )}
                      </td>


                      {/* DURATION */}

                      <td>

                        {timeSlot.duration !==
                          null &&
                        timeSlot.duration !==
                          undefined ? (
                          <span className="duration-badge">
                            {timeSlot.duration} min
                          </span>
                        ) : (
                          "-"
                        )}

                      </td>


                      {/* STATUS */}

                      <td>

                        {timeSlot.active ? (

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

                        <div className="timeslot-actions">

                          <button
                            className="timeslot-edit-btn"
                            onClick={() =>
                              openEditModal(
                                timeSlot
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="timeslot-delete-btn"
                            onClick={() =>
                              handleDelete(
                                timeSlot.id
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
          MODAL
      ================================================= */}

      {showModal && (

        <div className="timeslot-modal-overlay">

          <div className="timeslot-modal">

            {/* MODAL HEADER */}

            <div className="timeslot-modal-header">

              <div>

                <h3>
                  {editingTimeSlot
                    ? "Edit Time Slot"
                    : "Add Time Slot"}
                </h3>

                <p>
                  Enter time slot details
                  below.
                </p>

              </div>

              <button
                type="button"
                className="timeslot-close-btn"
                onClick={closeModal}
              >
                ×
              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleSubmit}
            >

              {/* SLOT NAME */}

              <div className="timeslot-form-group">

                <label>
                  Slot Name
                </label>

                <input
                  type="text"
                  name="slotName"
                  placeholder="Example: Period 1"
                  value={
                    formData.slotName
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>


              {/* START TIME */}

              <div className="timeslot-form-group">

                <label>
                  Start Time
                </label>

                <input
                  type="time"
                  name="startTime"
                  value={
                    formData.startTime
                  }
                  onChange={
                    handleTimeChange
                  }
                  required
                />

              </div>


              {/* END TIME */}

              <div className="timeslot-form-group">

                <label>
                  End Time
                </label>

                <input
                  type="time"
                  name="endTime"
                  value={
                    formData.endTime
                  }
                  onChange={
                    handleTimeChange
                  }
                  required
                />

              </div>


              {/* DURATION */}

              <div className="timeslot-form-group">

                <label>
                  Duration
                </label>

                <input
                  type="number"
                  name="duration"
                  value={
                    formData.duration
                  }
                  readOnly
                  placeholder="Automatically calculated"
                />

                <small>
                  Duration is automatically
                  calculated in minutes.
                </small>

              </div>


              {/* ACTIVE */}

              <div className="timeslot-active-group">

                <input
                  type="checkbox"
                  id="timeslot-active"
                  name="active"
                  checked={
                    formData.active
                  }
                  onChange={
                    handleChange
                  }
                />

                <label htmlFor="timeslot-active">
                  Time slot is active
                </label>

              </div>


              {/* BUTTONS */}

              <div className="timeslot-modal-buttons">

                <button
                  type="button"
                  className="timeslot-cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="timeslot-save-btn"
                >
                  {editingTimeSlot
                    ? "Update Time Slot"
                    : "Create Time Slot"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default TimeSlot;
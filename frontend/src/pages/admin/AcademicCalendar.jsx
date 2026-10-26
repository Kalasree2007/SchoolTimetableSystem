import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./academicCalendar.css";

const AcademicCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventType: "",
    startDate: "",
    endDate: "",
    active: true,
  });

  // Fetch events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/calendar");
      setEvents(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load academic calendar."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    setError("");
  };

  // Open add modal
  const openAddModal = () => {
    setEditingEvent(null);

    setFormData({
      title: "",
      description: "",
      eventType: "",
      startDate: "",
      endDate: "",
      active: true,
    });

    setError("");
    setShowModal(true);
  };

  // Open edit modal
  const openEditModal = (event) => {
    setEditingEvent(event);

    setFormData({
      title: event.title || "",
      description: event.description || "",
      eventType: event.eventType || "",
      startDate: event.startDate?.substring(0, 10) || "",
      endDate: event.endDate?.substring(0, 10) || "",
      active: event.active !== false,
    });

    setError("");
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingEvent(null);
    setError("");
  };

  // Add / Update event
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Event title is required.");
      return;
    }

    if (!formData.eventType.trim()) {
      setError("Event type is required.");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      setError("Start date and end date are required.");
      return;
    }

    if (formData.endDate < formData.startDate) {
      setError("End date cannot be before start date.");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      eventType: formData.eventType.trim(),
      startDate: formData.startDate,
      endDate: formData.endDate,
      active: formData.active,
    };

    try {
      if (editingEvent) {
        await api.put(
          `/calendar/${editingEvent.id}`,
          payload
        );
      } else {
        await api.post("/calendar", payload);
      }

      closeModal();
      fetchEvents();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to save calendar event."
      );
    }
  };

  // Delete event
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this calendar event?")) {
      return;
    }

    try {
      await api.delete(`/calendar/${id}`);
      fetchEvents();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to delete calendar event."
      );
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "-";

    const parts = date.substring(0, 10).split("-");

    if (parts.length !== 3) {
      return date;
    }

    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  return (
    <div className="academic-calendar-page">

      <div className="academic-calendar-header">
        <div>
          <h2>Academic Calendar</h2>
          <p>
            Manage holidays, examinations and academic events.
          </p>
        </div>

        <button
          className="add-calendar-btn"
          onClick={openAddModal}
        >
          + Add Event
        </button>
      </div>

      {error && (
        <div className="calendar-error">
          {error}
        </div>
      )}

      <div className="academic-calendar-card">

        <div className="academic-calendar-card-header">
          <h3>All Calendar Events</h3>
          <span>{events.length} events</span>
        </div>

        {loading ? (
          <div className="calendar-loading">
            Loading academic calendar...
          </div>
        ) : events.length === 0 ? (
          <div className="calendar-empty">
            <div className="empty-calendar-icon">📅</div>

            <h3>No Calendar Events Found</h3>

            <p>
              Add an academic calendar event to get started.
            </p>

            <button
              className="empty-calendar-btn"
              onClick={openAddModal}
            >
              + Add Event
            </button>
          </div>
        ) : (
          <div className="calendar-table-wrapper">

            <table className="academic-calendar-table">

              <thead>
                <tr>
                  <th>EVENT</th>
                  <th>TYPE</th>
                  <th>START DATE</th>
                  <th>END DATE</th>
                  <th>DESCRIPTION</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>

                    <td>
                      <strong>
                        {event.title || "-"}
                      </strong>
                    </td>

                    <td>
                      <span className="event-type-badge">
                        {event.eventType || "-"}
                      </span>
                    </td>

                    <td>
                      {formatDate(event.startDate)}
                    </td>

                    <td>
                      {formatDate(event.endDate)}
                    </td>

                    <td>
                      {event.description || "-"}
                    </td>

                    <td>
                      {event.active ? (
                        <span className="calendar-status-active">
                          Active
                        </span>
                      ) : (
                        <span className="calendar-status-inactive">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td>
                      <div className="calendar-actions">

                        <button
                          className="calendar-edit-btn"
                          onClick={() =>
                            openEditModal(event)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="calendar-delete-btn"
                          onClick={() =>
                            handleDelete(event.id)
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

      {showModal && (
        <div className="calendar-modal-overlay">

          <div className="calendar-modal">

            <div className="calendar-modal-header">

              <div>
                <h3>
                  {editingEvent
                    ? "Edit Calendar Event"
                    : "Add Calendar Event"}
                </h3>
              </div>

              <button
                className="calendar-close-btn"
                onClick={closeModal}
              >
                ×
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="calendar-form-group">
                <label>Event Title</label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Event title"
                />
              </div>

              <div className="calendar-form-group">
                <label>Description</label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description"
                  rows="3"
                />
              </div>

              <div className="calendar-form-group">
                <label>Event Type</label>

                <input
                  type="text"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  placeholder="HOLIDAY / EXAM / EVENT"
                />
              </div>

              <div className="calendar-date-row">

                <div className="calendar-form-group">
                  <label>Start Date</label>

                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="calendar-form-group">
                  <label>End Date</label>

                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </div>

              </div>

              <div className="calendar-active-group">

                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                />

                <label>
                  Event is active
                </label>

              </div>

              <div className="calendar-modal-buttons">

                <button
                  type="button"
                  className="calendar-cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="calendar-save-btn"
                >
                  {editingEvent
                    ? "Update Event"
                    : "Create Event"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default AcademicCalendar;

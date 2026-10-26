import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./timetable.css";

const Timetable = () => {
  const [timetables, setTimetables] = useState([]);

  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState(null);

  const [formData, setFormData] = useState({
    dayOfWeek: "",
    teacherId: "",
    subjectId: "",
    classId: "",
    roomId: "",
    timeSlotId: "",
    active: true,
  });

  // =====================================================
  // FETCH TIMETABLES
  // =====================================================

  const fetchTimetables = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/timetables");

      console.log("Timetables response:", response.data);

      setTimetables(response.data);
    } catch (err) {
      console.error("Error fetching timetables:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load timetables."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH DROPDOWN DATA
  // =====================================================

  const fetchTeachers = async () => {
    try {
      const response = await api.get("/teachers");
      setTeachers(response.data);
    } catch (err) {
      console.error("Error loading teachers:", err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await api.get("/subjects");
      setSubjects(response.data);
    } catch (err) {
      console.error("Error loading subjects:", err);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await api.get("/classes");
      setClasses(response.data);
    } catch (err) {
      console.error("Error loading classes:", err);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await api.get("/rooms");
      setRooms(response.data);
    } catch (err) {
      console.error("Error loading rooms:", err);
    }
  };

  const fetchTimeSlots = async () => {
    try {
      const response = await api.get("/timeslots");
      setTimeSlots(response.data);
    } catch (err) {
      console.error("Error loading time slots:", err);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchTimetables();
    fetchTeachers();
    fetchSubjects();
    fetchClasses();
    fetchRooms();
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
    setEditingTimetable(null);

    setFormData({
      dayOfWeek: "",
      teacherId: "",
      subjectId: "",
      classId: "",
      roomId: "",
      timeSlotId: "",
      active: true,
    });

    setError("");
    setShowModal(true);
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const openEditModal = (timetable) => {
    setEditingTimetable(timetable);

    setFormData({
      dayOfWeek: timetable.dayOfWeek || "",
      teacherId: timetable.teacherId || "",
      subjectId: timetable.subjectId || "",
      classId: timetable.classId || "",
      roomId: timetable.roomId || "",
      timeSlotId: timetable.timeSlotId || "",
      active:
        timetable.active !== undefined
          ? timetable.active
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
    setEditingTimetable(null);
    setError("");
  };

  // =====================================================
  // CREATE / UPDATE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.dayOfWeek) {
      setError("Please select a day.");
      return;
    }

    if (!formData.teacherId) {
      setError("Please select a teacher.");
      return;
    }

    if (!formData.subjectId) {
      setError("Please select a subject.");
      return;
    }

    if (!formData.classId) {
      setError("Please select a class.");
      return;
    }

    if (!formData.roomId) {
      setError("Please select a room.");
      return;
    }

    if (!formData.timeSlotId) {
      setError("Please select a time slot.");
      return;
    }

    try {
      const payload = {
        dayOfWeek: formData.dayOfWeek,
        teacherId: Number(formData.teacherId),
        subjectId: Number(formData.subjectId),
        classId: Number(formData.classId),
        roomId: Number(formData.roomId),
        timeSlotId: Number(formData.timeSlotId),
        active: formData.active,
      };

      console.log("Timetable payload:", payload);

      if (!editingTimetable) {
        await api.post("/timetables", payload);
      } else {
        await api.put(
          `/timetables/${editingTimetable.id}`,
          payload
        );
      }

      closeModal();

      await fetchTimetables();
    } catch (err) {
      console.error(
        "Timetable save error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to save timetable."
      );
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this timetable?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(`/timetables/${id}`);

      await fetchTimetables();
    } catch (err) {
      console.error(
        "Timetable delete error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to delete timetable."
      );
    }
  };

  // =====================================================
  // DISPLAY HELPERS
  // =====================================================

  const getTeacherName = (timetable) => {
    return (
      timetable.teacherName ||
      timetable.teacher?.userName ||
      timetable.teacher?.fullName ||
      timetable.teacher?.name ||
      `Teacher #${timetable.teacherId || "-"}`
    );
  };

  const getSubjectName = (timetable) => {
    return (
      timetable.subjectName ||
      timetable.subject?.subjectName ||
      timetable.subject?.name ||
      `Subject #${timetable.subjectId || "-"}`
    );
  };

  const getClassName = (timetable) => {
    return (
      timetable.className ||
      timetable.classEntity?.className ||
      timetable.classEntity?.name ||
      `Class #${timetable.classId || "-"}`
    );
  };

  const getRoomNumber = (timetable) => {
    return (
      timetable.roomNumber ||
      timetable.room?.roomNumber ||
      `Room #${timetable.roomId || "-"}`
    );
  };

  const getSlotName = (timetable) => {
    return (
      timetable.slotName ||
      timetable.timeSlot?.slotName ||
      `Slot #${timetable.timeSlotId || "-"}`
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="timetable-page">

      {/* HEADER */}

      <div className="timetable-header">

        <div>
          <h2>Timetable</h2>

          <p>
            Manage teachers, subjects, classes,
            rooms and time slots.
          </p>
        </div>

        <button
          className="add-timetable-btn"
          onClick={openAddModal}
        >
          + Add Timetable
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div className="timetable-error">
          {error}
        </div>
      )}

      {/* CARD */}

      <div className="timetable-card">

        <div className="timetable-card-header">

          <div>
            <h3>All Timetables</h3>

            <span>
              {timetables.length} entries
            </span>
          </div>

        </div>

        {/* LOADING */}

        {loading ? (

          <div className="timetable-loading">
            Loading timetables...
          </div>

        ) : timetables.length === 0 ? (

          /* EMPTY */

          <div className="timetable-empty">

            <div className="empty-timetable-icon">
              ▦
            </div>

            <h3>
              No Timetable Entries
            </h3>

            <p>
              Create your first timetable entry
              to get started.
            </p>

            <button
              className="empty-timetable-btn"
              onClick={openAddModal}
            >
              + Add Timetable
            </button>

          </div>

        ) : (

          /* TABLE */

          <div className="timetable-table-wrapper">

            <table className="timetable-table">

              <thead>

                <tr>
                  <th>DAY</th>
                  <th>TEACHER</th>
                  <th>SUBJECT</th>
                  <th>CLASS</th>
                  <th>ROOM</th>
                  <th>TIME SLOT</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>

              </thead>

              <tbody>

                {timetables.map((timetable) => (

                  <tr key={timetable.id}>

                    <td>
                      <span className="day-badge">
                        {timetable.dayOfWeek || "-"}
                      </span>
                    </td>

                    <td>
                      {getTeacherName(timetable)}
                    </td>

                    <td>
                      {getSubjectName(timetable)}
                    </td>

                    <td>
                      {getClassName(timetable)}
                    </td>

                    <td>
                      {getRoomNumber(timetable)}
                    </td>

                    <td>
                      {getSlotName(timetable)}
                    </td>

                    <td>

                      {timetable.active ? (

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

                      <div className="timetable-actions">

                        <button
                          className="timetable-edit-btn"
                          onClick={() =>
                            openEditModal(timetable)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="timetable-delete-btn"
                          onClick={() =>
                            handleDelete(
                              timetable.id
                            )
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

      {/* MODAL */}

      {showModal && (

        <div className="timetable-modal-overlay">

          <div className="timetable-modal">

            <div className="timetable-modal-header">

              <div>

                <h3>
                  {editingTimetable
                    ? "Edit Timetable"
                    : "Add Timetable"}
                </h3>

                <p>
                  Assign teacher, subject, class,
                  room and time slot.
                </p>

              </div>

              <button
                type="button"
                className="timetable-close-btn"
                onClick={closeModal}
              >
                ×
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              {/* DAY */}

              <div className="timetable-form-group">

                <label>
                  Day of Week
                </label>

                <select
                  name="dayOfWeek"
                  value={formData.dayOfWeek}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Day
                  </option>

                  <option value="MONDAY">
                    Monday
                  </option>

                  <option value="TUESDAY">
                    Tuesday
                  </option>

                  <option value="WEDNESDAY">
                    Wednesday
                  </option>

                  <option value="THURSDAY">
                    Thursday
                  </option>

                  <option value="FRIDAY">
                    Friday
                  </option>

                  <option value="SATURDAY">
                    Saturday
                  </option>

                  <option value="SUNDAY">
                    Sunday
                  </option>

                </select>

              </div>

              {/* TEACHER */}

              <div className="timetable-form-group">

                <label>
                  Teacher
                </label>

                <select
                  name="teacherId"
                  value={formData.teacherId}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Teacher
                  </option>

                  {teachers.map((teacher) => (

                    <option
                      key={teacher.id}
                      value={teacher.id}
                    >
                      {getTeacherName(teacher)}
                    </option>

                  ))}

                </select>

              </div>

              {/* SUBJECT */}

              <div className="timetable-form-group">

                <label>
                  Subject
                </label>

                <select
                  name="subjectId"
                  value={formData.subjectId}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Subject
                  </option>

                  {subjects.map((subject) => (

                    <option
                      key={subject.id}
                      value={subject.id}
                    >
                      {subject.subjectName ||
                        subject.name ||
                        `Subject #${subject.id}`}
                    </option>

                  ))}

                </select>

              </div>

              {/* CLASS */}

              <div className="timetable-form-group">

                <label>
                  Class
                </label>

                <select
                  name="classId"
                  value={formData.classId}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Class
                  </option>

                  {classes.map((item) => (

                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.className ||
                        item.name ||
                        `Class #${item.id}`}
                    </option>

                  ))}

                </select>

              </div>

              {/* ROOM */}

              <div className="timetable-form-group">

                <label>
                  Room
                </label>

                <select
                  name="roomId"
                  value={formData.roomId}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Room
                  </option>

                  {rooms.map((room) => (

                    <option
                      key={room.id}
                      value={room.id}
                    >
                      {room.roomNumber ||
                        `Room #${room.id}`}
                    </option>

                  ))}

                </select>

              </div>

              {/* TIME SLOT */}

              <div className="timetable-form-group">

                <label>
                  Time Slot
                </label>

                <select
                  name="timeSlotId"
                  value={formData.timeSlotId}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Time Slot
                  </option>

                  {timeSlots.map((slot) => (

                    <option
                      key={slot.id}
                      value={slot.id}
                    >
                      {slot.slotName ||
                        `Slot #${slot.id}`}
                      {" "}
                      {slot.startTime &&
                        `(${slot.startTime} - ${slot.endTime})`}
                    </option>

                  ))}

                </select>

              </div>

              {/* ACTIVE */}

              <div className="timetable-active-group">

                <input
                  type="checkbox"
                  id="timetable-active"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                />

                <label htmlFor="timetable-active">
                  Timetable entry is active
                </label>

              </div>

              {/* BUTTONS */}

              <div className="timetable-modal-buttons">

                <button
                  type="button"
                  className="timetable-cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="timetable-save-btn"
                >
                  {editingTimetable
                    ? "Update Timetable"
                    : "Create Timetable"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Timetable;
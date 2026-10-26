import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./room.css";

const Room = () => {
  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const [formData, setFormData] = useState({
    roomNumber: "",
    roomName: "",
    roomType: "",
    capacity: "",
    building: "",
    floor: "",
    active: true,
  });

  // =====================================================
  // FETCH ROOMS
  // =====================================================

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/rooms");

      console.log("Rooms response:", response.data);

      setRooms(response.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load rooms."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchRooms();
  }, []);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

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
  // OPEN ADD MODAL
  // =====================================================

  const openAddModal = () => {
    setEditingRoom(null);

    setFormData({
      roomNumber: "",
      roomName: "",
      roomType: "",
      capacity: "",
      building: "",
      floor: "",
      active: true,
    });

    setError("");
    setShowModal(true);
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const openEditModal = (room) => {
    setEditingRoom(room);

    setFormData({
      roomNumber: room.roomNumber || "",

      roomName: room.roomName || "",

      roomType: room.roomType || "",

      capacity:
        room.capacity !== null &&
        room.capacity !== undefined
          ? room.capacity
          : "",

      building: room.building || "",

      floor:
        room.floor !== null &&
        room.floor !== undefined
          ? room.floor
          : "",

      active:
        room.active !== undefined
          ? room.active
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
    setEditingRoom(null);
    setError("");
  };

  // =====================================================
  // CREATE / UPDATE ROOM
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Room number validation
    if (!formData.roomNumber.trim()) {
      setError("Room number is required.");
      return;
    }

    // Room name validation
    if (!formData.roomName.trim()) {
      setError("Room name is required.");
      return;
    }

    // Room type validation
    if (!formData.roomType) {
      setError("Room type is required.");
      return;
    }

    // Capacity validation
    if (
      formData.capacity === "" ||
      Number(formData.capacity) <= 0
    ) {
      setError(
        "Capacity must be greater than 0."
      );
      return;
    }

    try {
      const payload = {
        roomNumber:
          formData.roomNumber.trim(),

        roomName:
          formData.roomName.trim(),

        roomType:
          formData.roomType,

        capacity:
          Number(formData.capacity),

        building:
          formData.building.trim(),

        floor:
          formData.floor === ""
            ? null
            : Number(formData.floor),

        active:
          formData.active,
      };

      console.log("Room payload:", payload);

      // =================================================
      // CREATE
      // =================================================

      if (!editingRoom) {
        await api.post(
          "/rooms",
          payload
        );
      }

      // =================================================
      // UPDATE
      // =================================================

      else {
        await api.put(
          `/rooms/${editingRoom.id}`,
          payload
        );
      }

      closeModal();

      await fetchRooms();

    } catch (err) {
      console.error(
        "Room save error:",
        err
      );

      console.log(
        "Backend error:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to save room."
      );
    }
  };

  // =====================================================
  // DELETE ROOM
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this room?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(
        `/rooms/${id}`
      );

      await fetchRooms();

    } catch (err) {
      console.error(
        "Room delete error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to delete room."
      );
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="rooms-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="rooms-header">

        <div>
          <h2>Rooms</h2>

          <p>
            Manage classrooms, laboratories
            and room capacities.
          </p>
        </div>

        <button
          className="add-room-btn"
          onClick={openAddModal}
        >
          + Add Room
        </button>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="room-error">
          {error}
        </div>
      )}


      {/* =================================================
          MAIN CARD
      ================================================= */}

      <div className="rooms-card">

        {/* CARD HEADER */}

        <div className="rooms-card-header">

          <div>

            <h3>
              All Rooms
            </h3>

            <span>
              {rooms.length} rooms
            </span>

          </div>

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="room-loading">
            Loading rooms...
          </div>

        ) : rooms.length === 0 ? (

          /* =================================================
             EMPTY
          ================================================= */

          <div className="room-empty">

            <div className="empty-room-icon">
              ▣
            </div>

            <h3>
              No Rooms Found
            </h3>

            <p>
              Add your first classroom or
              laboratory to get started.
            </p>

            <button
              className="empty-room-btn"
              onClick={openAddModal}
            >
              + Add Room
            </button>

          </div>

        ) : (

          /* =================================================
             TABLE
          ================================================= */

          <div className="room-table-wrapper">

            <table className="room-table">

              <thead>

                <tr>

                  <th>
                    ROOM NUMBER
                  </th>

                  <th>
                    ROOM NAME
                  </th>

                  <th>
                    ROOM TYPE
                  </th>

                  <th>
                    CAPACITY
                  </th>

                  <th>
                    BUILDING
                  </th>

                  <th>
                    FLOOR
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

                {rooms.map((room) => (

                  <tr
                    key={room.id}
                  >

                    {/* ROOM NUMBER */}

                    <td>

                      <div className="room-number">

                        <div className="room-avatar">
                          ▣
                        </div>

                        <strong>
                          {room.roomNumber ||
                            "-"}
                        </strong>

                      </div>

                    </td>


                    {/* ROOM NAME */}

                    <td>
                      {room.roomName ||
                        "-"}
                    </td>


                    {/* ROOM TYPE */}

                    <td>

                      <span className="room-type-badge">

                        {room.roomType ||
                          "-"}

                      </span>

                    </td>


                    {/* CAPACITY */}

                    <td>

                      <span className="capacity-text">

                        {room.capacity !==
                          null &&
                        room.capacity !==
                          undefined
                          ? `${room.capacity} students`
                          : "-"}

                      </span>

                    </td>


                    {/* BUILDING */}

                    <td>
                      {room.building ||
                        "-"}
                    </td>


                    {/* FLOOR */}

                    <td>
                      {room.floor !==
                        null &&
                      room.floor !==
                        undefined
                        ? room.floor
                        : "-"}
                    </td>


                    {/* STATUS */}

                    <td>

                      {room.active ? (

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

                      <div className="room-actions">

                        <button
                          className="room-edit-btn"
                          onClick={() =>
                            openEditModal(
                              room
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="room-delete-btn"
                          onClick={() =>
                            handleDelete(
                              room.id
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


      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showModal && (

        <div className="room-modal-overlay">

          <div className="room-modal">

            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div className="room-modal-header">

              <div>

                <h3>

                  {editingRoom
                    ? "Edit Room"
                    : "Add Room"}

                </h3>

                <p>
                  Enter room details below.
                </p>

              </div>

              <button
                type="button"
                className="room-close-btn"
                onClick={closeModal}
              >
                ×
              </button>

            </div>


            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
            >

              {/* ROOM NUMBER */}

              <div className="room-form-group">

                <label>
                  Room Number
                </label>

                <input
                  type="text"
                  name="roomNumber"
                  placeholder="Example: 101"
                  value={
                    formData.roomNumber
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>


              {/* ROOM NAME */}

              <div className="room-form-group">

                <label>
                  Room Name
                </label>

                <input
                  type="text"
                  name="roomName"
                  placeholder="Example: Computer Lab 1"
                  value={
                    formData.roomName
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>


              {/* ROOM TYPE */}

              <div className="room-form-group">

                <label>
                  Room Type
                </label>

                <select
                  name="roomType"
                  value={
                    formData.roomType
                  }
                  onChange={
                    handleChange
                  }
                  required
                >

                  <option value="">
                    Select Room Type
                  </option>

                  <option value="CLASSROOM">
                    Classroom
                  </option>

                  <option value="LAB">
                    Laboratory
                  </option>

                  <option value="SEMINAR_HALL">
                    Seminar Hall
                  </option>

                  <option value="AUDITORIUM">
                    Auditorium
                  </option>

                  <option value="OTHER">
                    Other
                  </option>

                </select>

              </div>


              {/* CAPACITY */}

              <div className="room-form-group">

                <label>
                  Capacity
                </label>

                <input
                  type="number"
                  name="capacity"
                  min="1"
                  placeholder="Example: 60"
                  value={
                    formData.capacity
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>


              {/* BUILDING */}

              <div className="room-form-group">

                <label>
                  Building
                </label>

                <input
                  type="text"
                  name="building"
                  placeholder="Example: Main Block"
                  value={
                    formData.building
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              {/* FLOOR */}

              <div className="room-form-group">

                <label>
                  Floor
                </label>

                <input
                  type="number"
                  name="floor"
                  min="0"
                  placeholder="Example: 1"
                  value={
                    formData.floor
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              {/* ACTIVE */}

              <div className="room-active-group">

                <input
                  type="checkbox"
                  id="roomActive"
                  name="active"
                  checked={
                    formData.active
                  }
                  onChange={
                    handleChange
                  }
                />

                <label htmlFor="roomActive">
                  Room is active
                </label>

              </div>


              {/* BUTTONS */}

              <div className="room-modal-buttons">

                <button
                  type="button"
                  className="room-cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="room-save-btn"
                >

                  {editingRoom
                    ? "Update Room"
                    : "Create Room"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Room;
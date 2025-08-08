// components/AdminDashboard.jsx
"use client";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    startTime: "",
    location: "",
    mode: "",
  });

  const fetchEvents = async () => {
    const res = await fetch("http://localhost:8080/getEvents");
    const json = await res.json();
    if (json.success) {
      setEvents(json.data.events);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEditClick = (event) => {
    setSelectedEvent(event);
    setFormData({
      name: event.name || "",
      startTime: event.startTime || "",
      location: event.location || "",
      mode: event.mode || "",
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    return (
      formData.name.trim() !== "" &&
      formData.startTime.trim() !== "" &&
      formData.location.trim() !== "" &&
      formData.mode.trim() !== ""
    );
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      alert("Please fill in all fields correctly.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/editEvent", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				},
			
        body: JSON.stringify({ id: selectedEvent._id, ...formData }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Event updated!");
        setShowModal(false);
        fetchEvents();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((event) => (
        <div
          key={event._id}
          className="bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">{event.name}</h2>
          <p>Start: {new Date(event.startTime).toLocaleString()}</p>
          <p>Location: {event.location}</p>
          <p>Mode: {event.mode}</p>
          <button
            className="mt-2 px-4 py-1 bg-blue-600 rounded hover:bg-blue-700"
            onClick={() => handleEditClick(event)}
          >
            Edit
          </button>
        </div>
      ))}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Edit Event</h2>
            <input
              className="w-full mb-2 p-2 border"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Event Name"
            />
            <input
              className="w-full mb-2 p-2 border"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              placeholder="Start Time"
              type="datetime-local"
            />
            <input
              className="w-full mb-2 p-2 border"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Location"
            />
            <input
              className="w-full mb-4 p-2 border"
              name="mode"
              value={formData.mode}
              onChange={handleInputChange}
              placeholder="Mode (Online/Offline)"
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleUpdate}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

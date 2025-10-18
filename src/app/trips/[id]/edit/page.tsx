"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import "@/styles/pages/editTripPage.scss"
export default function EditTrip() {
  const [updateSuccessful,setUpdateSuccessful] = useState(false);
  const [formData, setFormData] = useState({
    tripTitle: "",
    tripLocation: "",
    tripStartDate: "",
    tripEndDate: "",
    tripBudget: "",
    trip_type: "",
    tripDescription: "",
  });

  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = useParams(); // get trip id from URL

  // Fetch the existing trip data
  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await fetch(`/api/trips?id=${id}`);
        if (!res.ok) throw new Error("Failed to fetch trip");
        const trip = await res.json();
        console.log(trip);

        // Fill the form with existing trip data
        setFormData({
          tripTitle: trip.title || "",
          tripLocation: trip.destination || "",
          tripStartDate: trip.start_date || "",
          tripEndDate: trip.end_date || "",
          tripBudget: trip.budget || "",
          trip_type: trip.type || "",
          tripDescription: trip.description || "",
        });
      } catch (error) {
        console.error("Error fetching trip:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit the updated trip
  const handleUpdateTrip = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/trips?id=${id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: formData.tripTitle,
    destination: formData.tripLocation,
    start_date: formData.tripStartDate,
    end_date: formData.tripEndDate,
    budget: formData.tripBudget,
    type: formData.trip_type,
    description: formData.tripDescription,
  }),
});


      if (!res.ok) throw new Error("Failed to update trip");

      setUpdateSuccessful(true);

      setTimeout(() => {
        router.push(`/trips/${id}`); // Redirect back to the trip page
        router.refresh(); // without refresh it shows the old data
      }, 1500);
    } catch (error) {
      console.error("Error updating trip:", error);
    }
  };

  if (loading) return <div className="loading__item">Loading trip...</div>;

  return (
    <main className="editTrip__main">
      <form onSubmit={handleUpdateTrip} className="editTrip__form">
        <div className="input__group">
          <input
            type="text"
            id="tripTitle"
            name="tripTitle"
            placeholder=" "
            required
            value={formData.tripTitle}
            onChange={handleChange}
          />
          <label htmlFor="tripTitle">Title</label>
        </div>

        <div className="input__group">
          <input
            type="text"
            id="tripLocation"
            name="tripLocation"
            placeholder=" "
            required
            value={formData.tripLocation}
            onChange={handleChange}
          />
          <label htmlFor="tripLocation">Location</label>
        </div>
        {/* if i use value={formData.start_date} */}
        {/* i get a warning that date format doesn't match */}
        {/* needs to be in the correct format */}
        <div className="input__group">
          <input
            type="date"
            id="tripStartDate"
            name="tripStartDate"
            placeholder=" "
            required
            value={formData.tripStartDate ? formData.tripStartDate.split("T")[0] : ""} // when splitting by T, you get ["2025-02-12","00:00:00.000Z", so getting [0],returns the correct date]
            onChange={handleChange}
          />
          <label htmlFor="tripStartDate">Start date</label>
        </div>

        <div className="input__group">
          <input
            type="date"
            id="tripEndDate"
            name="tripEndDate"
            placeholder=" "
            value={formData.tripEndDate ? formData.tripEndDate.split("T")[0] : ""}
            onChange={handleChange}
          />
          <label htmlFor="tripEndDate">End date</label>
        </div>

        <div className="input__group">
          <input
            type="number"
            id="tripBudget"
            name="tripBudget"
            placeholder=" "
            value={formData.tripBudget}
            onChange={handleChange}
          />
          <label htmlFor="tripBudget">Budget</label>
        </div>

        <div className="input__group">
          <select
            id="trip_type"
            name="trip_type"
            className="trip_type-dropdown"
            value={formData.trip_type}
            onChange={handleChange}
          >
            <option value="">Trip type</option>
            <option value="VACATION">Vacation</option>
            <option value="BUSINESS">Business</option>
            <option value="FAMILY">Family</option>
          </select>
        </div>

        <div className="input__group">
          <input
            type="text"
            id="tripDescription"
            name="tripDescription"
            placeholder=" "
            value={formData.tripDescription}
            onChange={handleChange}
          />
          <label htmlFor="tripDescription">Description</label>
        </div>
{updateSuccessful && (
          <p className="tripSuccessMsg">
            Success!
          </p>
        )}

        <button className="addTrip-btn" type="submit">
          APPLY CHANGES
        </button>
      </form>
    </main>
  );
}

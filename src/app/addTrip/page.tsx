"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "@/styles/pages/addTripPage.scss"
export default function AddTrip() {
  const [buttonText, setButtonText] = useState("ADD TRIP");
  const [formData, setFormData] = useState({
    tripTitle: "",
    tripLocation: "",
    tripStartDate: "",
    tripEndDate: "",
    tripBudget: "",
    trip_type: "",
    tripDescription: "",
  });

  // maybe add validation here too, like start date cannot be after end date, empty data etc
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  /// add a new trip
  const handleAddTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding new trip...");

    // check if end date is after start date
    const start = new Date(formData.tripStartDate);
    const end = new Date(formData.tripEndDate);

    if (end < start) {
      alert("End date cannot be before start date");
      return;
    }

    try {
      const res = await fetch("/api/trips", {
        method: "POST",
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

      if (!res.ok) throw new Error("Failed to add trip");

      const newTrip = await res.json();
      console.log("Trip added successfully:", newTrip);
      setButtonText("Trip added successfully");
      // Redirect after 1.5 seconds, not sure if i should keep
      setTimeout(() => {
        router.push("/"); // Replace "/" with  main page route
      }, 1500);

      // Optional: reset form
      setFormData({
        tripTitle: "",
        tripLocation: "",
        tripStartDate: "",
        tripEndDate: "",
        tripBudget: "",
        trip_type: "",
        tripDescription: "",
      });
    } catch (error) {
      console.error("Error adding trip:", error);
    }
  };

  return (
    <main className="addTrip__main">
      <form onSubmit={handleAddTrip}>
        <div className="input-group">
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

        <div className="input-group">
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

        <div className="input-group">
          <input
            type="date"
            id="tripStartDate"
            name="tripStartDate"
            placeholder=" "
            required
            value={formData.tripStartDate}
            onChange={handleChange}
          />
          <label htmlFor="tripStartDate">Start date</label>
        </div>

        <div className="input-group">
          <input
            type="date"
            id="tripEndDate"
            name="tripEndDate"
            placeholder=" "
            required
            value={formData.tripEndDate}
            onChange={handleChange}
          />
          <label htmlFor="tripEndDate">End date</label>
        </div>

        <div className="input-group">
          <input
            type="number"
            id="tripBudget"
            name="tripBudget"
            placeholder=" "
            required
            value={formData.tripBudget}
            onChange={handleChange}
          />
          <label htmlFor="tripBudget">Budget</label>
        </div>

        <div className="input-group">
          <select
            id="trip_type"
            name="trip_type"
            className="trip_type-dropdown"
            value={formData.trip_type}
            onChange={handleChange}
            required
          >
            <option value="">Trip type</option>
            <option value="VACATION">Vacation</option>
            <option value="BUSINESS">Business</option>
            <option value="FAMILY">Family</option>
          </select>
        </div>

        <div className="input-group">
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

        <button className="addTrip-btn" type="submit" aria-label="Add trip">
          {buttonText}
        </button>
      </form>
    </main>
  );
}

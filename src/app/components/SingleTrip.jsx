"use client";
import { useTripStore } from "@/app/store/tripStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MdEdit,
  MdDelete,
  MdArrowBack,
  MdArrowForward,
  MdLocationPin,
} from "react-icons/md";
import { Trip } from "@/types/Trip";

const typeColors = {
  VACATION: "#eba40b",
  BUSINESS: "#ff0000",
  FAMILY: "#0e5a9d",
  "": "",
};

export default function SingleTripClient({ params, session }) {
  const { id } = params;
  const { trips } = useTripStore();
  const [trip, setTrip] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (trips.length === 0) {
      fetch("/api/trips")
        .then((res) => res.json())
        .then((data) => useTripStore.setState({ trips: data }))
        .catch(console.error);
    }
  }, [trips]);

  useEffect(() => {
    if (!id || trips.length === 0) return;
    const currentTrip = trips.find((t) => t.id === Number(id));
    setTrip(currentTrip || null);
  }, [id, trips]);

  if (!trip) return <p className="loading__item">Loading...</p>;

  const formatDayMonth = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}`;
  };

  const currentIndex = trips.findIndex((t) => t.id === trip.id);
  const prevTrip = currentIndex > 0 ? trips[currentIndex - 1] : undefined;
  const nextTrip =
    currentIndex < trips.length - 1 ? trips[currentIndex + 1] : undefined;

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this trip?")) return;
    try {
      const res = await fetch(`/api/trips?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete trip");
      alert("Trip deleted successfully!");
      router.push("/"); // maybe redirect to trips list
    } catch (error) {
      console.error(error);
      alert("An error occurred while deleting trip");
    }
  };

  return (
    <main className="item">
      <section className="item__container">
        <div className="item__container--type-btns">
          <div
            style={{
              color: typeColors[trip.type],
              fontWeight: 600,
              fontSize: "0.75em",
              alignSelf: "center",
            }}
          >
            {trip.type}
          </div>

          <div className="edit--delete--btns">
            <button
              className="btn edit-btn"
              onClick={() => router.push(`/trips/${trip.id}/edit`)}
            >
              <MdEdit />
            </button>
            <button
              className="btn delete-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDelete(trip.id);
              }}
            >
              <MdDelete />
            </button>
          </div>
        </div>

        <div className="item__container--location">
          <MdLocationPin />
          {trip.destination}
        </div>

        <h1 className="item__container--heading">{trip.title}</h1>
        <div>
          {formatDayMonth(trip.start_date)} - {formatDayMonth(trip.end_date)}
        </div>
        <div>Budget: €{trip.budget}</div>
        <div className="item__container--description">{trip.description}</div>
      </section>

      <div className="btn back-forward-btns">
        <button
          className="back-btn"
          disabled={!prevTrip}
          onClick={() => prevTrip && router.push(`/trips/${prevTrip.id}`)}
        >
          <MdArrowBack />
        </button>

        <button
          className="forward-btn"
          disabled={!nextTrip}
          onClick={() => nextTrip && router.push(`/trips/${nextTrip.id}`)}
        >
          <MdArrowForward />
        </button>
      </div>
    </main>
  );
}

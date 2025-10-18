"use client";

import Navbar from "@/app/components/Navbar";
import { Trip } from "@/types/Trip";
import {
  MdEdit,
  MdDelete,
  MdArrowBack,
  MdArrowForward,
  MdLocationPin,
} from "react-icons/md";
import type { Session } from "next-auth";
import { useRouter } from "next/navigation";
import "@/styles/pages/singleTripPage.scss"
export default function SingleTripClient({
     trip,
  session,
}: {
  trip: Trip;
  session: Session;
}) {
const router = useRouter();
  const formatDayMonth = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}`;
  };

//   const currentIndex = trips.findIndex((t) => t.id === trip.id);
//   const prevTrip = currentIndex > 0 ? trips[currentIndex - 1] : undefined;
//   const nextTrip =
//     currentIndex < trips.length - 1 ? trips[currentIndex + 1] : undefined;


  // const handleDelete = async (id) => {
  //   if (!confirm("Are you sure you want to delete this trip?")) return;
  //   try {
  //     const res = await fetch(`/api/trips?id=${id}`, { method: "DELETE" });
  //     if (!res.ok) throw new Error("Failed to delete trip");
  //     alert("Trip deleted successfully!");
  //     router.push("/"); // maybe redirect to trips list
  //   } catch (error) {
  //     console.error(error);
  //     alert("An error occurred while deleting trip");
  //   }
  // };

  return (
    <>
      <Navbar />
      <main className="item">
        <section className="item__container">
            <div className="item__container--type-btns">
          <div className="trip__type"
            style={{
              fontWeight: 600,
              fontSize: "0.75em",
              color:
                trip.type === "VACATION"
                  ? "#eba40b"
                  : trip.type === "BUSINESS"
                  ? "#ff0000"
                  : trip.type === "FAMILY"
                  ? "#0e5a9d"
                  : "",
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
                // handleDelete(trip.id);
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
      </main>
    </>
  );
}

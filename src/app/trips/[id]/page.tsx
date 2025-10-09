'use client';
import { useTripStore } from "@/app/store/tripStore";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MdEdit, MdDelete,MdArrowBack,MdArrowForward,MdLocationPin } from "react-icons/md";

type Trip = {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  destination: string;
  budget: number;
  type: "VACATION" | "BUSINESS" | "FAMILY" | "";
};

const typeColors: { [key in Trip['type']]: string } = {
  VACATION: "#eba40b",
  BUSINESS: "#ff0000",
  FAMILY: "#0e5a9d",
  "": ""
};

export default function SingleTrip() {
  const { id } = useParams();
  const { trips } = useTripStore();
  const [trip, setTrip] = useState<Trip | null>(null);
const router = useRouter();
  // Fetch all trips if store is empty (direct visit)
  useEffect(() => {
    if (trips.length === 0) {
      fetch('/api/trips')
        .then(res => res.json())
        .then(data => useTripStore.setState({ trips: data }))
        .catch(console.error);
    }
  }, [trips]);

  // Select the current trip when trips are available
  useEffect(() => {
    if (!id || trips.length === 0) return;
    const currentTrip = trips.find(t => t.id === Number(id));
    setTrip(currentTrip || null);
  }, [id, trips]);

  if (!trip) return <p className="loading__item">Loading...</p>;

  const formatDayMonth = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}`;
  };

  const currentIndex = trips.findIndex(t => t.id === trip.id);
  const prevTrip = currentIndex > 0 ? trips[currentIndex - 1] : undefined;
  const nextTrip = currentIndex < trips.length - 1 ? trips[currentIndex + 1] : undefined;

  return (
    <main className="item">
      <section className="item__container">
        <div className="item__container--type-btns">
          <div style={{ color: typeColors[trip.type], fontWeight:600, fontSize:"0.75em", alignSelf:"center" }}>
            {trip.type}
          </div>
          <div className="edit--delete--btns">
            <button className="btn edit-btn"><MdEdit/></button>
            <button className="btn delete-btn"><MdDelete/></button>
          </div>
        </div>

        <div className="item__container--location"><MdLocationPin />{trip.destination}</div>
        <h1 className="item__container--heading">{trip.title}</h1>
        <div>{formatDayMonth(trip.start_date)} - {formatDayMonth(trip.end_date)}</div>
        <div>Budget: €{trip.budget}</div>
        <div className="item__container--description">Going to Athens on a girl&apos;s trip! Rock on!</div>
      </section>

      <button className="mark-complete-btn"><span>Mark as complete</span></button>

      <div className="btn back-forward-btns">
        {prevTrip ? (
          <button
  className="back-btn"
  disabled={!prevTrip}
  onClick={() => prevTrip && router.push(`/trips/${prevTrip.id}`)}
>
  <MdArrowBack />
</button>
        ) : (
          <button className="back-btn" disabled><MdArrowBack /></button>
        )}

        {nextTrip ? (
          <button
  className="forward-btn"
  disabled={!nextTrip}
  onClick={() => nextTrip && router.push(`/trips/${nextTrip.id}`)}
>
  <MdArrowForward />
</button>
        ) : (
          <button className="forward-btn" disabled><MdArrowForward /></button>
        )}
      </div>
    </main>
  );
}

"use client";
// imports
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
import { useSearchParams } from "next/navigation";
import "@/styles/pages/singleTripPage.scss";
import Link from "next/link";
import Breadcrumbs from "./Breadcrumb";
// end imports

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
  const searchParams = useSearchParams();
  const total = Number(searchParams.get("total") || 1);
  const currentId = trip.id;
  // compute prev/next IDs for the previous and next buttons
  const prevId = currentId > 1 ? currentId - 1 : null;
  const nextId = currentId < total ? currentId + 1 : null;

  return (
    <>
      <Navbar />

      <main className="item">
        <Breadcrumbs tripTitle={trip.title} />
        <section className="item__container">
          <div className="item__container--type-btns">
            <div
              className="trip__type"
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
        <div className="prev__next__btns">
          {prevId ? (
            <Link
              href={`/trips/${prevId}?total=${total}`}
              className="prev__btn"
            >
              <MdArrowBack />
            </Link>
          ) : (
            <button className="prev__btn" disabled>
              <MdArrowBack />
            </button>
          )}

          {nextId ? (
            <Link
              href={`/trips/${nextId}?total=${total}`}
              className="next__btn"
            >
              <MdArrowForward />
            </Link>
          ) : (
            <button className="next__btn" disabled>
              <MdArrowForward />
            </button>
          )}
        </div>
      </main>
    </>
  );
}

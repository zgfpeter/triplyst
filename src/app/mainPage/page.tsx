"use client";
// imports
import { useState, useEffect, useMemo } from "react";
import { MdLocationPin, MdClear, MdAdd } from "react-icons/md";
import Link from "next/link";
import { useSession } from "next-auth/react";
import "@/styles/pages/userHomePage.scss";
import type { Trip } from "@/types/Trip";
import {
  monthNames,
  getYear,
  getMonthName,
  formatDayMonth,
} from "@/utils/dateUtils";
// end imports

export default function UserHomePage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpcoming, setShowUpcoming] = useState(false);
  const { data: session, status } = useSession();

  // Fetch trips
  useEffect(() => {
    if (!session) return;
    const fetchTrips = async () => {
      try {
        const res = await fetch("/api/trips");
        if (!res.ok) throw new Error("Failed to fetch trips");
        const data: Trip[] = await res.json();
        setTrips(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [session]);

  // Find only the upcoming trips
  // memoize it so that it only recalculated when trips change
  const upcomingTrips = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return trips.filter((trip) => {
      const endDate = new Date(trip.end_date);
      endDate.setHours(0, 0, 0, 0);
      return endDate >= today;
    });
  }, [trips]);

  const displayedTrips = useMemo(
    () => (showUpcoming ? upcomingTrips : trips),
    [showUpcoming, upcomingTrips, trips]
  );

  // Group trips by year and month
  const tripsByYearMonth = useMemo(() => {
    const grouped: { [year: number]: { [month: string]: Trip[] } } = {};
    displayedTrips.forEach((trip) => {
      const year = getYear(trip.start_date);
      const month = getMonthName(trip.start_date);
      grouped[year] ??= {};
      grouped[year][month] ??= [];
      grouped[year][month].push(trip);
    });

    // Sort trips inside each month
    Object.values(grouped).forEach((months) => {
      Object.values(months).forEach((tripArr) => {
        tripArr.sort(
          (a, b) =>
            new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
        );
      });
    });

    return grouped;
  }, [displayedTrips]);

  // delete a trip by id
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this trip?")) return;
    try {
      const res = await fetch(`/api/trips?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete trip");
      setTrips((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error(error);
      alert("An error occurred while deleting trip");
    }
  };

  // color for each trip type (FAMILY,BUSINESS,VACATION)
  const typeColors: { [key in Trip["type"]]: string } = {
    VACATION: "#eba40b",
    BUSINESS: "#ff0000",
    FAMILY: "#0e5a9d",
    "": "",
  };

  // Loading state
  if (status === "loading" || loading) {
    return (
      <p className="loading__item" role="status">
        Loading trips...
      </p>
    );
  }

  return (
    <main className="page">
      {/* Header and filters always visible */}
      <header className="page__filter" aria-label="Trip filters">
        <div
          className="page__filter--switch"
          role="group"
          aria-label="Trip filter toggle"
        >
          <span aria-hidden="true">ALL</span>
          <label className="switch">
            <input
              role="switch"
              aria-checked={showUpcoming}
              type="checkbox"
              checked={showUpcoming}
              onChange={(e) => setShowUpcoming(e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
          <span aria-hidden="true">UPCOMING</span>
        </div>

        <h2 className="page__date">
          {new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </h2>
      </header>

      {/* Main content */}
      {displayedTrips.length === 0 ? (
        <p className="no-trips">No trips to display.</p>
      ) : (
        Object.keys(tripsByYearMonth)
          .sort((a, b) => Number(a) - Number(b))
          .map((year) => (
            <div key={year} className="page__container">
              <h1 className="page__heading--main">{year}</h1>
              {Object.keys(tripsByYearMonth[Number(year)])
                .sort((a, b) => monthNames.indexOf(a) - monthNames.indexOf(b))
                .map((month) => (
                  <section key={month} className="page__months--container">
                    <h3 className="page__months--heading">{month}</h3>
                    <ul className="trip-list">
                      {tripsByYearMonth[Number(year)][month].map((trip) => (
                        <li key={trip.id} className="trip-list-item">
                          <Link
                            href={{
                              pathname: `/trips/${trip.id}`,
                              query: { total: trips.length },
                            }}
                            className="page__month--item"
                          >
                            <div className="page__month-item-header">
                              <div
                                className="page__month-item-type"
                                style={{
                                  color: typeColors[trip.type],
                                  fontWeight: 600,
                                  fontSize: "0.75em",
                                }}
                              >
                                {trip.type}
                              </div>
                            </div>
                            <div className="page__month-item-body">
                              <h4 className="page__month-item-title">
                                {trip.title}
                              </h4>
                              <p className="page__month-item-destination">
                                <MdLocationPin aria-hidden="true" />
                                {trip.destination}
                              </p>
                            </div>
                            <div className="page__month-item-dates">
                              {formatDayMonth(trip.start_date)} -{" "}
                              {formatDayMonth(trip.end_date)}
                            </div>
                          </Link>

                          <button
                            className="page__month-item-clear"
                            aria-label={`Delete trip to ${trip.destination}`}
                            onClick={() => handleDelete(trip.id)}
                          >
                            <MdClear />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
            </div>
          ))
      )}

      {/* Add trip button always visible */}
      <Link
        className="page__add"
        href={"/addTrip"}
        aria-label="Add trip button"
      >
        <MdAdd />
      </Link>
    </main>
  );
}

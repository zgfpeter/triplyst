"use client";
// imports
import { useState, useEffect, useMemo } from "react";
import { MdLocationPin, MdClear, MdAdd } from "react-icons/md";
import Link from "next/link";
import { useSession } from "next-auth/react";
import styles from "@/styles/pages/userHomePage.module.scss";
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
    <main className={styles.page}>
      {/* Header and filters always visible */}
      <header className={styles.page__filter} aria-label="Trip filters">
        <div
          className={styles.page__filter_switch}
          role="group"
          aria-label="Trip filter toggle"
        >
          <span aria-hidden="true">ALL</span>
          <label className={styles.switch} htmlFor="switch">
            <input
              name="switch"
              id="switch"
              role="switch"
              aria-checked={showUpcoming}
              type="checkbox"
              checked={showUpcoming}
              onChange={(e) => setShowUpcoming(e.target.checked)}
            />
            <span className={`${styles.slider} ${styles.round}`}></span>
          </label>
          <span aria-hidden="true">UPCOMING</span>
        </div>

        <h2 className={styles.page__date}>
          {new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </h2>
      </header>

      {/* Main content */}
      {displayedTrips.length === 0 ? (
        <p className={styles.no_trips}>No trips to display.</p>
      ) : (
        Object.keys(tripsByYearMonth)
          .sort((a, b) => Number(a) - Number(b))
          .map((year) => (
            <div key={year} className={styles.page__container}>
              <h1 className={styles.page__heading_main}>{year}</h1>
              {Object.keys(tripsByYearMonth[Number(year)])
                .sort((a, b) => monthNames.indexOf(a) - monthNames.indexOf(b))
                .map((month) => (
                  <section key={month} className={styles.page__months_container}>
                    <h2 className={styles.page__months_heading}>{month}</h2>
                    <ul className={styles.trip_list}>
                      {tripsByYearMonth[Number(year)][month].map((trip) => (
                        <li key={trip.id} className={styles.trip_list_item}>
                          <Link
                            href={{
                              pathname: `/trips/${trip.id}`,
                              query: { total: trips.length },
                            }}
                            className={styles.page__month_item}
                          >
                            <div className={styles.page__month_item_header}>
                              <div
                                className={styles.page__month_item_type}
                                style={{
                                  color: typeColors[trip.type],
                                  fontWeight: 600,
                                  fontSize: "0.75em",
                                }}
                              >
                                {trip.type}
                              </div>
                            </div>
                            <div className={styles.page__month_item_body}>
                              <h3 className={styles.page__month_item_title}>
                                {trip.title}
                              </h3>
                              <p className={styles.page__month_item_destination}>
                                <MdLocationPin aria-hidden="true" />
                                {trip.destination}
                              </p>
                            </div>
                            <div className={styles.page__month_item_dates}>
                              {formatDayMonth(trip.start_date)} -{" "}
                              {formatDayMonth(trip.end_date)}
                            </div>
                          </Link>

                          <button
                            className={styles.page__month_item_clear}
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
        className={styles.page__add}
        href={"/addTrip"}
        aria-label="Add trip button"
      >
        <MdAdd />
      </Link>
    </main>
  );
}

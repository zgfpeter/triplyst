// main page, showing all the trips
'use client'
import { useState, useEffect } from "react";
import { MdLocationPin, MdClear, MdAdd } from "react-icons/md";
import Link from "next/link";
import { Volkhov } from "next/font/google";

const volkhov = Volkhov({
  subsets: ["latin"],
  weight: ["400", "700"], // optional, choose what you need
});

type Trip = {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  destination: string;
  budget: number;
  type: "BUSINESS" | "FAMILY" | "VACATION" | "";
};

export default function ItineraryItem() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const typeColors: { [key in Trip['type']]: string } = {
    VACATION: "#eba40b",
    BUSINESS: "#ff0000",
    FAMILY: "#0e5a9d",
    "": ""
  };

  useEffect(() => {
    fetch('/api/trips')
      .then(res => res.json())
      .then((data: Trip[]) => {
        // console.log('Fetched trips:', data);
        setTrips(data);
      })
      .catch(err => console.error('Fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="loading__item">Loading trips...</p>;
  if (!trips.length) return <p>No trips found</p>;

  const getYear = (dateStr: string) => new Date(dateStr).getFullYear();
  const getMonthName = (dateStr: string) => monthNames[new Date(dateStr).getMonth()];

  const tripsByYearMonth: { [year: number]: { [month: string]: Trip[] } } = {};

  trips.forEach(trip => {
    const year = getYear(trip.start_date);
    const month = getMonthName(trip.start_date);

    if (!tripsByYearMonth[year]) tripsByYearMonth[year] = {};
    if (!tripsByYearMonth[year][month]) tripsByYearMonth[year][month] = [];

    tripsByYearMonth[year][month].push(trip);
  });

  const formatDayMonth = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0"); // 2 digits
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 0-based month
  return `${day}/${month}`;
};


  Object.values(tripsByYearMonth).forEach(months => {
    Object.values(months).forEach(tripArr => {
      tripArr.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
    });
  });

  return (
    <main className="page">
      {Object.keys(tripsByYearMonth)
        .sort((a, b) => Number(a) - Number(b))
        .map(year => (
          <div key={year} className="page__container">
            <h1 className="page__heading--main">Your trips for {year}</h1>
            {Object.keys(tripsByYearMonth[Number(year)])
              .sort((a, b) => monthNames.indexOf(a) - monthNames.indexOf(b))
              .map(month => (
                <div key={month} className="page__months--container">
                  <h2 className="page__months--heading">{month}</h2>
                  {tripsByYearMonth[Number(year)][month].map(trip => (
                    <Link href={{pathname: `/trips/${trip.id}`,query: { total: trips.length }}} key={trip.id} className="page__month--item">
                      <div className="page__month-item-header">
                        <div className="page__month-item-type" style={{ color: typeColors[trip.type],fontWeight:600,fontSize:"0.75em" }}>{trip.type}</div>
                        <button className="page__month-item-clear"><MdClear /></button>
                      </div>
                      <div className="page__month-item-body">
                        <h3 className="page__month-item-title">{trip.title} </h3><p className="page__month-item-destination"><MdLocationPin />{trip.destination}</p>
                        
                      </div>
                      <div className="page__month-item-dates">{formatDayMonth(trip.start_date)} - {formatDayMonth(trip.end_date)}</div>

                    </Link>
                  ))}
                  
                </div>
              ))}
          </div>
        ))}
      <button className="page__add"><span><MdAdd /></span></button>
    </main>
  );
}

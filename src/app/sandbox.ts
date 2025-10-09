'use client'
import React from "react";
import { MdLocationPin,MdClear,MdAdd} from 'react-icons/md'; // Material Design icons
import { useState,useEffect } from "react";
export default function ItineraryItem() {
  


type Trip = {
  id: number;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  destination: string;
  budget: number;    // maybe add a currency selector
  type: "BUSINESS" | "FAMILY" |"VACATION"|""; 
};

const [trips, setTrips] = useState<Trip[]>([]);

  const [loading, setLoading] = useState(true);
// fetch data from local file 
useEffect(()=>{
    fetch("/data/trips_data.json").then((res)=>res.json()).then((data:Trip[])=>setTrips(data))
},[])

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

const typeColors: { [key in Trip['type']]: string } = {
  "VACATION": "#eba40b",   // blue
  "BUSINESS": "#ff0000",   // orange
  "FAMILY": "#0e5a9d", // pink
  "":""
};


 


  useEffect(() => {
    fetch('/api/trips')
      .then((res) => res.json())
      .then((data: Trip[]) => {
        console.log('Fetched trips:', data); // 🔹 check if fetch works
        setTrips(data);
      })
      .catch((err) => console.error('Fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading trips...</p>;
  if (!trips.length) return <p>No trips found</p>;


  // get year and month
  const getYear = (dateStr: string) => new Date(dateStr).getFullYear();
  const getMonthName = (dateStr: string) =>
    monthNames[new Date(dateStr).getMonth()];

  // goup trips by year and month
  const tripsByYearMonth: { [year: number]: { [month: string]: Trip[] } } = {};

  trips.forEach((trip) => {
    const year = getYear(trip.startDate);
    const month = getMonthName(trip.startDate);

    if (!tripsByYearMonth[year]) tripsByYearMonth[year] = {};
    if (!tripsByYearMonth[year][month]) tripsByYearMonth[year][month] = [];

    tripsByYearMonth[year][month].push(trip);
  });

  // Sort trips within each month by start date
  Object.values(tripsByYearMonth).forEach((months) => {
    Object.values(months).forEach((tripArr) => {
      tripArr.sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
    });
  });

  return (
    <main className="single-year-container">
      {Object.keys(tripsByYearMonth)
        .sort((a, b) => Number(a) - Number(b)) // sort years
        .map((trip) => (
          <div key={trip}>
            <h1 className="page-heading">Your trips for 2025</h1>
            {Object.keys(tripsByYearMonth[Number(year)])
              .sort((a, b) => monthNames.indexOf(a) - monthNames.indexOf(b)) // sort months
              .map((month) => (
                <div key={month} className="single-month-container">
                  <h2 className="single-trip-heading">{month}</h2>
                  {/* map trips in a month */}
                  {tripsByYearMonth[Number(year)][month].map((trip) => (
                    <div key={trip.id} className="single-trip">
                        <div className="type-remove-container"><div className="trip-type" style={{color: typeColors[trip.type]}}>{trip.type}</div><button className="remove-trip-button"><MdClear/></button></div>
                      <div className="title-destination-container">
                        <div className="single-trip-title">{trip.title}</div>
                        
                      <div className="single-trip-destination">
                               <MdLocationPin />{trip.destination}</div>
                      </div>
                      
                      <div className="single-trip-date">
                          {trip.startDate} to <span>{trip.endDate}</span>
                      </div>
                      {/* <button className="mark-as-complete-btn">Mark as complete</button> */}
                      
                      {/* <div className="single-trip-budget">
                        Budget: €{trip.budget}
                      </div> */}
                    </div>
                  ))}
                </div>
              ))}
          </div>
        ))}
        <button className="add-trip-btn"><MdAdd/></button>
    </main>
  );
}

import { Volkhov } from "next/font/google";

const volkhov = Volkhov({
  subsets: ["latin"],
  weight: ["400", "700"], // optional, choose what you need
});


type ItineraryYear = {
  id: number;
  year: number;
  trips: number;
  totalDays: number;
  budget: number;
  countriesVisited: number;
  tripsCompleted: number;
};


const itineraryYears: ItineraryYear[] = [
  { 
    id: 1, 
    year: 2025, 
    trips: 3, 
    totalDays: 32, 
    budget: 7200, 
    countriesVisited: 4, 
    tripsCompleted: 1 
  },
  { 
    id: 2, 
    year: 2026, 
    trips: 3, 
    totalDays: 41, 
    budget: 8900, 
    countriesVisited: 5, 
    tripsCompleted: 2 
  },
  { 
    id: 3, 
    year: 2027, 
    trips: 4, 
    totalDays: 56, 
    budget: 11200, 
    countriesVisited: 6, 
    tripsCompleted: 3 
  },
  { 
    id: 4, 
    year: 2028, 
    trips: 5, 
    totalDays: 68, 
    budget: 13800, 
    countriesVisited: 7, 
    tripsCompleted: 4 
  },
  { 
    id: 5, 
    year: 2029, 
    trips: 4, 
    totalDays: 49, 
    budget: 9800, 
    countriesVisited: 6, 
    tripsCompleted: 2 
  },
  { 
    id: 6, 
    year: 2030, 
    trips: 4, 
    totalDays: 54, 
    budget: 10500, 
    countriesVisited: 5, 
    tripsCompleted: 1 
  },
];


export default function Home() {
return (
  <div className="years-container">
    {itineraryYears.map((item)=>(
      <div key={item.id} className={`year-box ${volkhov.className}`}>
        <div className="year">{item.year}</div>
        <div className="trip-info-container">
          <div className="trips">Trips: {item.trips}</div>
          <div className="completed">Completed: {item.tripsCompleted}/{item.trips}</div>
        </div>
        
        <div className="days">Total days: {item.totalDays}</div>
        <div className="budget">Budget: {item.budget}</div>
        <div className="countriesVisited">Countries visited: {item.countriesVisited}</div>
        
      </div>
      
    ))}
  </div>
)
}

type ItineraryYears = {
  id:number,
  year:number,
  trips:number,
}


// const itineraryItems: ItineraryYear[] = [
//   {
//     id: 1,
//     month:"January",
//     trips:3,
//   },
//   {
//     id: 2,
//     month:"February",
//     trips:3
//   },
//   {
//     id: 3,
//     month:"March",
//     trips:4
//   },
//   {
//     id: 4,
//     month:"April",
//     trips:5
//   },
//   {
//     id: 5,
//     month:"May",
//     trips:4
//   },
//   {
//     id: 6,
//     month:"June",
//     trips:3
  
//   },
//   {
//     id: 7,
//     month:"July",
//     trips:4
//   },
//   {
//     id: 8,
//     month:"August",
//     trips:2
//   },
//   {
//     id: 9,
//     month:"September",
//     trips:1
//   },
//   {
//     id: 10,
//     month:"October",
//     trips:2
//   },
//   {
//     id: 11,
//     month:"November",
//     trips:3
//   },
//    {
//     id: 12,
//     month:"December",
//     trips:2
//   },
// ];

const itineraryYears: ItineraryYears[] = [
  {
    id: 1,
    year:2025,
    trips:3,
  },
  {
    id: 2,
    year:2026,
    trips:3
  },
  {
    id: 3,
    year:2027,
    trips:4
  },
  {
    id: 4,
    year:2028,
    trips:5
  },
  {
    id: 5,
    year:2029,
    trips:4
  },
  {
    id: 6,
    year:2030,
    trips:4
  }

];





export default function Home() {
  return (
    <div className="lines">
       
            <svg className="vertical-line" width="5" height="100vh">
              
      <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#ba5410" strokeWidth="4" />
      <path id="lineAC" d="M 100 350 q 150 -300 300 0" stroke="#532709" strokeWidth="4" fill="none"/>
    </svg>

        
      
    <div className="items-container">
      {
        itineraryYears.map((item)=>(
            <div key={item.id} className="item">
              {/* <div className="item-year" >{item.year}</div> */}
              <div className="item-year" >{item.year}</div>
            <div className="item-body">
              Trips: {item.trips} </div>
            
            </div>
           
            
        ))
      }
    </div>
    </div>
  );
}

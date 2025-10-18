// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import type { Session } from "next-auth";
// import { MdEdit, MdDelete, MdLocationPin } from "react-icons/md";
// import { Trip } from "@/types/Trip";

// const typeColors: Record<Trip["type"] | "", string> = {
//   VACATION: "#eba40b",
//   BUSINESS: "#ff0000",
//   FAMILY: "#0e5a9d",
//   "": "",
// };

// export default function SingleTripClient({
//   params,
//   session,
// }: {
//   params: { id: string };
//   session: Session | null;
// }) {
//   const { id } = params;
//   const [trip, setTrip] = useState<Trip | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     if (!id) return;

//     const fetchTrip = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const res = await fetch(`/api/trips?id=${id}`, {
//           credentials: "include", // send cookies for auth
//         });

//         if (res.status === 401) {
//           router.push("/userLogin");
//           return;
//         }

//         if (res.status === 404) {
//           setTrip(null)
//           setError("Trip not found");
//           return;
//         }

//         if (!res.ok) throw new Error("Failed to fetch trip");

//         const data: Trip = await res.json();
//         setTrip(data);
//       } catch (err) {
//         console.error(err);
//         setTrip(null);
//         setError("An error occurred while fetching the trip");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTrip();
//   }, [id, router]);

//   const handleDelete = async (id: number) => {
//     if (!confirm("Are you sure you want to delete this trip?")) return;

//     try {
//       const res = await fetch(`/api/trips?id=${id}`, {
//         method: "DELETE",
//         credentials: "include",
//       });

//       if (res.status === 401) {
//         router.push("/userLogin");
//         return;
//       }

//       if (!res.ok) throw new Error("Failed to delete trip");

//       alert("Trip deleted successfully!");
//       router.push("/"); // redirect to trips list
//     } catch (err) {
//       console.error(err);
//       alert("An error occurred while deleting trip");
//     }
//   };

//   const formatDayMonth = (dateStr: string) => {
//     const date = new Date(dateStr);
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     return `${day}/${month}`;
//   };

//   if (loading) return <p className="loading__item">Loading...</p>;
//   if (error) return <p className="loading__item">{error}</p>;
//   if (!trip) return <p className="loading__item">Trip not found.</p>;

//   return (
//     <main className="item">
//       <section className="item__container">
//         <div className="item__container--type-btns">
//           <div
//             style={{
//               color: typeColors[trip.type],
//               fontWeight: 600,
//               fontSize: "0.75em",
//               alignSelf: "center",
//             }}
//           >
//             {trip.type}
//           </div>

//           <div className="edit--delete--btns">
//             <button
//               className="btn edit-btn"
//               onClick={() => router.push(`/trips/${trip.id}/edit`)}
//             >
//               <MdEdit />
//             </button>
//             <button
//               className="btn delete-btn"
//               onClick={(e) => {
//                 e.preventDefault();
//                 e.stopPropagation();
//                 handleDelete(trip.id);
//               }}
//             >
//               <MdDelete />
//             </button>
//           </div>
//         </div>

//         <div className="item__container--location">
//           <MdLocationPin />
//           {trip.destination}
//         </div>

//         <h1 className="item__container--heading">{trip.title}</h1>
//         <div>
//           {formatDayMonth(trip.start_date)} - {formatDayMonth(trip.end_date)}
//         </div>
//         <div>Budget: €{trip.budget}</div>
//         <div className="item__container--description">{trip.description}</div>
//       </section>
//     </main>
//   );
// }

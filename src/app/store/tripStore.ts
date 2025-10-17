// look into this and zustand more.

// defines a global store that can be imported and accessed from anywhere, no refetching
import { create } from "zustand";

export type Trip = {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  destination: string;
  budget: number;
  type: "VACATION" | "BUSINESS" | "FAMILY" | "";
  description:string;
};

type TripStore = {
  trips: Trip[];
  setTrips: (trips: Trip[]) => void;
};

export const useTripStore = create<TripStore>((set) => ({
  trips: [],
  setTrips: (trips) => set({ trips }),
}));

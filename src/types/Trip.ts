export type Trip = {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  destination: string;
  budget: number;
  type: "BUSINESS" | "FAMILY" | "VACATION" | "";
  description:string
};

// avoid typescript issues when declaring an empty newErrors object.
export type LoginErrors = {
  email?:string;
  username?:string;
  password?: string;
}
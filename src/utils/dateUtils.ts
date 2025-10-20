// get the year, month and day to easily display and group trips
export const monthNames = [
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
export const getYear = (dateStr: string) => new Date(dateStr).getFullYear();
export const getMonthName = (dateStr: string) =>
  monthNames[new Date(dateStr).getMonth()];

export const formatDayMonth = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
};

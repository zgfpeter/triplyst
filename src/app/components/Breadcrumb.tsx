// Breadcrumb component adds a "path", to let the user know where they are on the website
// ex home/trips/tripTitle
"use client";
// imports
import Link from "next/link";
// end imports
interface BreadcrumbsProps {
  tripTitle?: string;
}

export default function Breadcrumbs({ tripTitle }: BreadcrumbsProps) {
  return (
    <nav className="nav__container">
      <Link href="/">Home</Link>
      <span>/</span>
      <Link href="/">Trips</Link>
      <span>/</span>
      <span className="currentTrip">{tripTitle}</span>
    </nav>
  );
}

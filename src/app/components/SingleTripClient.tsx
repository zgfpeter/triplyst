"use client";
// imports
import Navbar from "@/app/components/Navbar";
import { formatDayMonth } from "@/utils/dateUtils";
import { Trip } from "@/types/Trip";
import {
  MdEdit,
  MdDelete,
  MdArrowBack,
  MdArrowForward,
  MdLocationPin,
} from "react-icons/md";
import type { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import styles from "@/styles/pages/singleTripPage.module.scss";
import Link from "next/link";
import Breadcrumbs from "./Breadcrumb";
// end imports

export default function SingleTripClient({
  trip,
  session,
}: {
  trip: Trip;
  session: Session;
}) {
  const router = useRouter();

  const searchParams = useSearchParams();
  const total = Number(searchParams.get("total") || 1);
  const currentId = trip.id;
  // compute prev/next IDs for the previous and next buttons
  // TODO : fix, not ideal since trips can be deleted so ids won't be consecutive
  const prevId = currentId > 1 ? currentId - 1 : null;
  const nextId = currentId < total ? currentId + 1 : null;

  return (
    <>
      <Navbar />

      <main className={styles.item}>
        <Breadcrumbs tripTitle={trip.title} />
        <section className={styles.item__container}>
          <div className={styles.item__container_type_btns}>
            <div
              className={styles.trip__type}
              style={{
                fontWeight: 600,
                fontSize: "0.75em",
                color:
                  trip.type === "VACATION"
                    ? "#eba40b"
                    : trip.type === "BUSINESS"
                    ? "#ff0000"
                    : trip.type === "FAMILY"
                    ? "#0e5a9d"
                    : "",
                alignSelf: "center",
              }}
            >
              {trip.type}
            </div>
            <div className={styles.edit_delete_btns}>
              <button
                className={`${styles.btn} ${styles.edit_btn}`}
                onClick={() => router.push(`/trips/${trip.id}/edit`)}
              >
                <MdEdit />
              </button>
              <button
                className={`${styles.btn} ${styles.delete_btn}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // handleDelete(trip.id);
                  // TODO handle the delete
                }}
              >
                <MdDelete />
              </button>
            </div>
          </div>
          <div className={styles.item__container_location}>
            <MdLocationPin />
            {trip.destination}
          </div>

          <h1 className={styles.item__container_heading}>{trip.title}</h1>
          <div>
            {formatDayMonth(trip.start_date)} - {formatDayMonth(trip.end_date)}
          </div>
          <div>Budget: €{trip.budget}</div>
          <div className={styles.item__container_description}>{trip.description}</div>
        </section>
        <div className={styles.prev__next__btns}>
          {prevId ? (
            <Link
              href={`/trips/${prevId}?total=${total}`}
              className={styles.prev__btn}
            >
              <MdArrowBack />
            </Link>
          ) : (
            <button className={styles.prev__btn} disabled>
              <MdArrowBack />
            </button>
          )}

          {nextId ? (
            <Link
              href={`/trips/${nextId}?total=${total}`}
              className={styles.next__btn}
            >
              <MdArrowForward />
            </Link>
          ) : (
            <button className={styles.next__btn} disabled>
              <MdArrowForward />
            </button>
          )}
        </div>
      </main>
    </>
  );
}

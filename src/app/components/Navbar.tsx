"use client";
// imports
import styles from "@/styles/navbar.module.scss";
import { MdAccountCircle, MdLogout } from "react-icons/md";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
// end imports
export default function Navbar() {
  const { data: session, status } = useSession();
  // if user not logged in, show a login link
  if (!session) {
    return (
      <nav className={styles.navbar__main}>
        <Link href="/userLogin" aria-label="Login">
          <MdAccountCircle />
          <span>Login</span>
        </Link>
      </nav>
    );
  }
  // if user is logged in, show their username and a logout button
  return (
    <main className={styles.navbar__main}>
      <Link href="/" aria-label="User page">
        <MdAccountCircle />
        <span> {session.user?.name || session.user?.email}</span>
      </Link>
      <button
        aria-label="Log out"
        onClick={() => signOut({ callbackUrl: "/userLogin" })}
        className={styles.logout_btn}
      >
        <MdLogout />
      </button>
    </main>
  );
}

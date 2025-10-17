"use client";
import "@/styles/navbar.scss"
import { MdAccountCircle, MdLogout } from "react-icons/md";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return null; // or a spinner
  }

  // if user not logged in, show a login link
  if (!session) {
    return (
      <nav className="navbar__main">
        <Link href="/userLogin" aria-label="Login">
          <MdAccountCircle />
          <span>Login</span>
        </Link>
      </nav>
    );
  }

  return (
    <main className="navbar__main">
      <Link href="/" aria-label="User page">
        <MdAccountCircle />
        <span> {session.user?.name || session.user?.email}</span>
      </Link>
      <button
      aria-label="Log out"
        onClick={() => signOut({ callbackUrl: "/userLogin" })}
        className="logout--btn"
      >
        <MdLogout />
      </button>
    </main>
  );
}

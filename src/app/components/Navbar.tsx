"use client";
import "@/styles/navbar.scss";
import { MdAccountCircle, MdLogout } from "react-icons/md";
import Link from "next/link";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
type NavbarProps = {
  session: Session;
};

export default function Navbar({ session }: NavbarProps) {

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
  // if user is logged in, show their username and a logout button
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

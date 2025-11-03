"use client";
import styles from "@/styles/pages/userLoginPage.module.scss";
import Link from "next/link";
import { ChangeEvent, useState, FormEvent } from "react";

// import { mockUsers } from "../../../public/data/userData";

import { LoginErrors } from "@/types/Trip";
import { signIn } from "next-auth/react";

export default function UserLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" }); // state that holds the form username and password
  const [errors, setErrors] = useState<LoginErrors>({}); // track the errors in the login form. no errors = good :)
  const [success, setSuccess] = useState<string | null>(null);


  // track and update changes in input
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // e.target.name is the name of the input, like username, or password
    // so for username, e.target.name is username, and e.target.value is the value in the username field
  };

  const validateLoginForm = () => {
    // newErrors is of type LoginErrors, where LoginErrors just declares a type with optional login fields,like username, password.

    // i already have form validation in the registration page
    // so no need to check for length of username and password here
    // but basic validation, like required fields, is good
    // as it saves unnecessary API calls or server processing

    const newErrors: LoginErrors = {};
    // for the username
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    // for the password
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent default page reload on submit
    setSuccess(null); // clear success state
    if (validateLoginForm()) {
      // form is valid
      const res = await signIn("credentials", {
        email: formData.email, // i'm using email as username, so replace with email
        password: formData.password,
        redirect: false, // prevents nextauth from redirecting
      });

      // res.error alone makes typescript complain
      if (res?.error) {
        setErrors({ general: "Invalid username or password" });
        setSuccess(null);
      } else {
        console.log("Login success");
        setSuccess("Login successful! Fetching your trips...")
        window.location.href = "/"; // or redirect to another page, home page is fine
      }
    }
  };

  return (
    <main className={styles.login__main}>
      <h1 className="sr_only">Log in</h1>

      <form className={styles.login__form} onSubmit={handleLogin}>
        {errors.general && (
          <p className={styles.error_msg} role="alert">
            {errors.general}
          </p>
        )}

        {success && (
          <p className={styles.login_success_msg}>Success!</p>
        )}

        <div className={styles.user__input_group}>
          <input
            type="text"
            id="email"
            name="email"
            placeholder=" "
            value={formData.email}
            onChange={handleChange}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "e-error" : undefined}
          />
          <label htmlFor="email">Email</label>
        </div>
        {errors.email && (
          <p className={styles.error_msg} id="e-error">
            {errors.email}
          </p>
        )}

        <div className={styles.user__input_group}>
          <input
            type="password"
            id="password"
            name="password"
            placeholder=" "
            value={formData.password}
            onChange={handleChange}
            //aria-invalid indicates that the entered value ( email,username, password) is valid
            //tells screen readers that there's a problem with input
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "p-error" : undefined}
          />
          <label htmlFor="password">Password</label>

          {/* <Link href="/" className={forgot--password">
            Forgot password?
          </Link> */}
        </div>
        {errors.password && (
          <p className={styles.error_msg} id="p-error">
            {errors.password}
          </p>
        )}

        {/* {Object.keys(errors).length === 0 && (
          <p className={success--msg">Success</p>
        )} */}
        <button className={styles.login__btn} type="submit">
          <span></span>LOG IN
        </button>
      </form>
      <p className={styles.register__main}>
        Don&apos;t have an account? <Link href="/userRegister">SIGN UP</Link>
      </p>
    </main>
  );
}

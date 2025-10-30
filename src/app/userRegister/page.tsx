"use client";
import { useState } from "react";
import { LoginErrors } from "@/types/Trip";
import styles from "@/styles/pages/userRegisterPage.module.scss";
import { MdOutlineMail, MdOutlinePerson, MdOutlineLock } from "react-icons/md";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UserRegister() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      const firstErrorInput = document.querySelector<HTMLInputElement>(
        "input[aria-invalid='true']"
      );
      firstErrorInput?.focus();
      return;
    }
    // register user to the database
    // make an api call to my register route (POST REQUEST)
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // contains the email, username and password
      });
      const data = await res.json();
    
      if (!res.ok) {
        // api returned error
        setErrors({
          general: data.error || "Something went wrong during registration",
        });
        return;
      }

      // if api returned success
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        //redirect to home page
      router.push("/");
      }, 2000);

      
    } catch (err) {
      console.log(err);
      setErrors({ general: "Failed to register user" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors: LoginErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!emailPattern.test(formData.email))
      newErrors.email = "Please enter a valid email address";

    if (!formData.username.trim()) newErrors.username = "Username is required";
    else if (formData.username.trim().length < 3)
      newErrors.username = "Username must be at least 3 characters long";

    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!formData.password) newErrors.password = "Password is required";
    else if (!passwordPattern.test(formData.password))
      newErrors.password =
        "Password must be at least 6 characters long and include at least one uppercase letter and one number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <main className={styles.register__main}>
      <form className={styles.register__form} onSubmit={handleSubmit} noValidate>
        <h1 className="sr_only">Sign up</h1>

        {/* Email */}
        <div className={styles.user__input_group}>
          <div className={styles.input_wrapper}>
            <input
              type="email"
              id="email"
              name="email"
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            <label htmlFor="email">Email</label>
            <span>
              <MdOutlineMail />
            </span>
          </div>
          {errors.email && (
            <p id="email-error" className={styles.error_msg} role="alert">
              {errors.email}
            </p>
          )}
        </div>

        {/* Username */}
        <div className={styles.user__input_group}>
          <div className={styles.input_wrapper}>
            <input
              type="text"
              id="username"
              name="username"
              placeholder=" "
              value={formData.username}
              onChange={handleChange}
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? "username-error" : undefined}
            />
            <label htmlFor="username">Username</label>
            <span>
              <MdOutlinePerson />
            </span>
          </div>
          {errors.username && (
            <p id="username-error" className={styles.error_msg} role="alert">
              {errors.username}
            </p>
          )}
        </div>

        {/* Password */}
        <div className={styles.user__input_group}>
          <div className={styles.input_wrapper}>
            <input
              type="password"
              id="password"
              name="password"
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            <label htmlFor="password">Password</label>
            <span>
              <MdOutlineLock />
            </span>
          </div>
          {errors.password && (
            <p id="password-error" className={styles.error_msg} role="alert">
              {errors.password}
            </p>
          )}
        </div>

        {success && (
          <p className={styles.success_msg} role="status" aria-live="polite">
            Registration successful!
          </p>
        )}
        {/* general error, ex registration failed because user exists */}
        {errors.general && (
          <p className={styles.error_msg} role="alert">
            {errors.general}
          </p>
        )}

        <button className={styles.register__btn} type="submit">
          <span>SIGN UP</span>
        </button>
        <Link href="/userLogin" className={styles.register__main__back}> Already have an account? <span>LOG IN</span></Link>
      </form>
    </main>
  );
}

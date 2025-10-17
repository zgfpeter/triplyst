"use client";
import { useState, useEffect } from "react";
import { LoginErrors } from "@/types/Trip";
import "@/styles/pages/userLoginPage.scss"; // same styling as login page
export default function UserRegister() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Improve accessibility
      // Focus first input with error
      const firstErrorInput = document.querySelector<HTMLInputElement>(
        "input[aria-invalid='true']"
      );
      firstErrorInput?.focus();
    } else {
      setSuccess(true);
      // Hide success after 2 seconds ( remove? )
      setTimeout(() => setSuccess(false), 2000);
      console.log("Successfully registered");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // checks if email is valid and not empty
  const validateForm = () => {
    const newErrors: LoginErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
    }

    // password must be at least 6 characters, one uppercase and one number
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (!passwordPattern.test(formData.password)) {
      newErrors.password =
        "Password must be at least 6 characters long and include at least one uppercase letter and one number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <main className="login__main">
     
      <form className="login__form" onSubmit={handleSubmit} noValidate>
        {/* h1 only visible on screen readers */}
        <h1 className="sr-only">Sign up</h1> 
        <div className="user__input-group">
          <input
            type="email"
            id="email"
            name="email"
            placeholder=" "
            value={formData.email}
            onChange={handleChange}
            //aria-invalid indicates that the entered value ( email,username, password) is valid
            //tells screen readers that there's a problem with input
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          <label htmlFor="email">Email</label>
          {errors.email && (
            <p id="email-error" className="error--msg" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        {/* Username */}
        <div className="user__input-group">
          <input
            type="text"
            id="username"
            name="username"
            placeholder=" "
            value={formData.username}
            onChange={handleChange}
            //aria-invalid indicates that the entered value ( email,username, password) is valid
            //tells screen readers that there's a problem with input
            aria-invalid={!!errors.username}
            aria-describedby={errors.username ? "username-error" : undefined}
          />
          <label htmlFor="username">Username</label>
          {errors.username && (
            <p id="username-error" className="error--msg" role="alert">
              {errors.username}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="user__input-group">
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
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          <label htmlFor="password">Password</label>
          
          {errors.password && (
            <p id="password-error" className="error--msg" role="alert">
              {errors.password}
            </p>
          )}
        </div>

        {/* Success message */}
        {success && (
          <p className="success--msg" role="status" aria-live="polite">
            Registration successful!
          </p>
        )}

        <button className="login__btn" type="submit" aria-label="Sign up">
          SIGN UP
        </button>
      </form>
    </main>
  );
}

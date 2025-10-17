"use client";
import { useState } from "react";
import { LoginErrors } from "@/types/Trip";
export default function UserRegister() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) =>{
    e.preventDefault();

    if (!validateForm()){
        console.log("Errors")
    }else{
        console.log("Successfully registered")
    }

  }

  const handleChange = (e)=>{
    setFormData({...formData,[e.target.name]:e.target.value}); // update form data

  }

  const validateForm = () => {
    const newErrors: LoginErrors = {};
    // \ backlash escapes it
    // ^ beginning of string, $ end of string
    // [^\s@ - one or more characters that are not spaces or @
    // @ - must include @
    // \. must include a .
    // [^\s@]+ something after the dot.
    // user@example.com works
    // user@net doesn't
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

    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    // include at least one uppercase, one number, total length at least 6 characters
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters long and include at least one uppercase letter and one number.";
    } else if (!passwordPattern.test(formData.password)) {
      newErrors.password =
        "Password must be at least 6 characters long and include at least one uppercase letter and one number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length===0; // if it's empty, so no errors, return true
  };

  return (
    <main className="login__main">
      <form className="login__form" onSubmit={handleSubmit}>
        <div className="user__input-group">
          <input type="string" id="email" name="email" placeholder=" " value={formData.email} onChange={handleChange} />
          <label htmlFor="email">Email</label>
          {errors.email && <p className="error--msg">{errors.email}</p>}
        </div>
        <div className="user__input-group">
          <input type="text" id="username" name="username" placeholder=" " value={formData.username} onChange={handleChange}/>
          <label htmlFor="username">Username</label>
          {errors.username && <p className="error--msg">{errors.username}</p>}
        </div>

        <div className="user__input-group">
          <input
            type="password"
            id="password"
            name="password"
            placeholder=" "
            value={formData.password}
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
          {errors.password && <p className="error--msg">{errors.password}</p>}
        </div>
         {Object.keys(errors).length === 0 && (
          <p className="success--msg">Success</p> // show a little success message if there are no errors
        )}
        <button className="login__btn" type="submit">
          SIGN UP
        </button>
      </form>
    </main>
  );
}

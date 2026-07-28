import axios from "axios";
import { useState } from "react";
import "./Signup.css";

export function Signup() {
  const [errors, setErrors] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors([]);
    const params = new FormData(event.target);
    axios
      .post("http://localhost:3000/users.json", params)
      .then((response) => {
        console.log(response.data);
        event.target.reset();
        window.location.href = "/login";
      })
      .catch((error) => {
        console.log(error.response.data.errors);
        setErrors(error.response.data.errors);
      });
  };

  return (
    <div id="signup" className="auth-card">
      <h1>Sign Up</h1>
      {errors.length > 0 && (
        <ul className="auth-errors">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit}>
        <div className="auth-field">
          <label htmlFor="signup-first-name">First Name</label>
          <input id="signup-first-name" name="first_name" type="text" autoComplete="given-name" />
        </div>
        <div className="auth-field">
          <label htmlFor="signup-last-name">Last Name</label>
          <input id="signup-last-name" name="last_name" type="text" autoComplete="family-name" />
        </div>
        <div className="auth-field">
          <label htmlFor="signup-email">Email</label>
          <input id="signup-email" name="email" type="email" autoComplete="email" />
        </div>
        <div className="auth-field">
          <label htmlFor="signup-password">Password</label>
          <input id="signup-password" name="password" type="password" autoComplete="new-password" />
        </div>
        <div className="auth-field">
          <label htmlFor="signup-password-confirmation">Password confirmation</label>
          <input id="signup-password-confirmation" name="password_confirmation" type="password" autoComplete="new-password" />
        </div>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

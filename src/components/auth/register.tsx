import { useState } from "react";
import React from "react";
import { API_BASE_URL, REGISTER_ENDPOINT } from "../../services/api";

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [userType, setUserType] = useState("customer");

  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.endsWith("@stud.noroff.no")) {
      setError("You must register with a stud.noroff.no email");
      return;
    }

      try {
        const response = await fetch(`${API_BASE_URL}${REGISTER_ENDPOINT}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ 
            name: formData.name, 
            email: formData.email, 
            password: formData.password,
            venueManager: userType === "venueManager"
          })
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.errors[0].message);
          return;
        }
        setIsSuccess(true);
        setFormData({ name: "", email: "", password: "" });
      } catch (error) {
        console.error("Error during registration:", error);
      }
    };

  return (
    <div>
      {!isSuccess ? (
        <form className="registerInput" onSubmit={handleSubmit}>
      {/* Name */}
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      />
      {/* Email */}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      {/* Password */}
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />
       {/* User Type */}
      <select value={userType} onChange={(e) => setUserType(e.target.value)}>
        <option value="customer">Customer</option>
        <option value="venueManager">Venue Manager</option>
      </select>
      <button type="submit">Register</button>
    </form>
      ) : (
        <p>Registration successful! You can now log in.</p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
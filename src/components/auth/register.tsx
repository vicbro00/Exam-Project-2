import { useState } from "react";
import React from "react";
import { API_BASE_URL, REGISTER_ENDPOINT } from "../../services/api";

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

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
      try {
        const response = await fetch(`${API_BASE_URL}${REGISTER_ENDPOINT}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.errors[0].message);
          return;
        }
        console.log("Registration successful:", data);
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
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />
      <button type="submit">Register</button>
    </form>
      ) : (
        <p>Registration successful! You can now log in.</p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
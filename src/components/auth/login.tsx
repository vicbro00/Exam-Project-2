import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { API_BASE_URL, LOGIN_ENDPOINT } from "../../services/api";
import { toast } from "react-toastify";

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

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
        const response = await fetch(`${API_BASE_URL}${LOGIN_ENDPOINT}`, {
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

        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("userName", data.data.name);
        localStorage.setItem("userEmail", data.data.email);
        localStorage.setItem("venueManager", String(data.data.venueManager));

        if (data.data.avatar?.url) {
        localStorage.setItem("avatar", data.data.avatar.url);
      } else {
        localStorage.removeItem("avatar");
      }

      toast.success("Login successful!");

      if (data.data.venueManager) {
        navigate("/venueManagerDashboard");
      } else {
        navigate("/customerDashboard");
      }

      setIsSuccess(true);
      setFormData({ email: "", password: "" });
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred during login. Please try again.");
    }
  };

  return (
    <div>
      {!isSuccess ? (
        <form className="loginInput" onSubmit={handleSubmit}>
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
      <button type="submit">Login</button>
      {error && <p className="error">{error}</p>}
    </form>
      ) : (
        <p>Login successful!</p>
      )}
    </div>
  );
}
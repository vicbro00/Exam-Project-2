import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL, LOGIN_ENDPOINT } from "../../services/api";

export function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("accessToken")) navigate("/");
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}${LOGIN_ENDPOINT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.errors?.[0]?.message || "Login failed");
      }

      const { accessToken, name, email, venueManager, avatar } = result.data;
      
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("userName", name);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("venueManager", String(venueManager));
      
      if (avatar?.url) localStorage.setItem("avatar", avatar.url);
      else localStorage.removeItem("avatar");

      toast.success("Welcome back!");
      
      const redirectPath = venueManager ? "/venueManagerDashboard" : "/customerDashboard";
      setTimeout(() => navigate(redirectPath), 1000);

    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <div className="login-container">
      <form className="login-input" onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Enter your email..."
          value={formData.email}
          onChange={handleChange}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="Enter your password..."
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Sign in</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}
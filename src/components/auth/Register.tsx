import { useState } from "react";
import { API_BASE_URL, REGISTER_ENDPOINT } from "../../services/api";
import { toast } from "react-toastify";

export function RegisterForm() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [userType, setUserType] = useState("customer");
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email.endsWith("@stud.noroff.no")) {
      return setError("Please use your @stud.noroff.no email address.");
    }

    /* Registers a new user by sending information to api endpoint. */
    try {
      const response = await fetch(`${API_BASE_URL}${REGISTER_ENDPOINT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...formData,
          venueManager: userType === "venueManager"
        })
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMsg = result.errors?.[0]?.message || "Registration failed";
        setError(errorMsg);
        return toast.error(errorMsg);
      }

      setIsSuccess(true);
      toast.success("Welcome! You're all set to log in.");
      setFormData({ name: "", email: "", password: "" });

    } catch (err) {
      console.error("Auth error:", err);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  if (isSuccess) {
    return <div className="success-msg">Registration successful! You can now log in.</div>;
  }

  return (
    <div>
      {!isSuccess ? (
        <form className="register-input" onSubmit={handleSubmit}>
      Name:
      <input
        aria-label="Name"
        type="text"
        name="name"
        placeholder="Name.."
        value={formData.name}
        onChange={handleChange}
      />
      Email:
      <input
        aria-label="Email"
        type="email"
        name="email"
        placeholder="Email.."
        value={formData.email}
        onChange={handleChange}
      />
      Password:
      <input
        aria-label="Password"
        type="password"
        name="password"
        placeholder="Password.."
        value={formData.password}
        onChange={handleChange}
      />
      <select value={userType} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setUserType(e.target.value)}>
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
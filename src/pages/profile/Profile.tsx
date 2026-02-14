import { useEffect, useState } from "react";
import "./profile.css";
import type { ProfileData } from "../../components/profile/Profile";
import { API_BASE_URL } from "../../services/api";
import { getToken, getApiKey } from "../../services/auth";
import Profile from "../../components/profile/Profile";
import Spinner from "../../components/Spinner";

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Retrieves user profile from API
    const loadUserData = async () => {
      try {
        const userName = localStorage.getItem("userName");
        const token = getToken(); 
        const apiKey = getApiKey();

        // Validates that user is logged in
        if (!userName || !token) {
          throw new Error("You must be logged in to view this page");
        }

        const res = await fetch(`${API_BASE_URL}/holidaze/profiles/${userName}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey,
          },
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.errors?.[0]?.message || "Could not retrieve profile");
        }

        setProfile(result.data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "An unexpected error occurred";
        setError(message);
        console.error("Profile Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="profile-error-container">
        <p className="error-text">{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  if (!profile) return <div className="profile-error-container">Profile not found</div>;

  return (
    <div className="profile-page-wrapper">
      <Profile profile={profile} />
    </div>
  );
}
import { useEffect, useState } from "react";
import "./profile.css";
import type { ProfileData } from "../../components/profile/Profile";
import { API_BASE_URL } from "../../services/api";
import Profile from "../../components/profile/Profile";
import Spinner from "../../components/Spinner";

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userName = localStorage.getItem("userName");
        const token = localStorage.getItem("accessToken");

        if (!userName || !token) {
          setError("Please log in to view your profile");
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE_URL}/holidaze/profiles/${userName}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": "b430fe28-0dc4-4858-82db-a67e6f526c48",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setProfile(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <div>{error}</div>;
  if (!profile) return <div>No profile data found</div>;

  return <Profile profile={profile} />;
}

import { useState } from "react";
import EditProfile from "./EditProfile";
import { API_BASE_URL } from "../../services/api";

export interface ProfileData {
  name: string;
  email: string;
  bio?: string;
  avatar?: { url: string; alt: string };
  banner?: { url: string; alt: string };
}

interface ProfileProps {
  profile: ProfileData;
}

export default function Profile({ profile }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(profile);

  const handleSave = async (updatedProfile: ProfileData) => {
    try {
      const token = localStorage.getItem("accessToken");
      const userName = localStorage.getItem("userName");

      if (!token || !userName) {
        alert("You must be logged in to update your profile");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/holidaze/profiles/${userName}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": "b430fe28-0dc4-4858-82db-a67e6f526c48",
        },
        body: JSON.stringify(updatedProfile),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const data = await res.json();
      setCurrentProfile(data.data);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "An error occurred");
    }
  };

  if (isEditing) {
    return (
      <div className="profile-container">
        <EditProfile
          profile={currentProfile}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="profile-container">
      {currentProfile.banner?.url && (
        <img
          className="profile-banner"
          src={currentProfile.banner.url}
          alt={currentProfile.banner.alt || "Profile banner"}
        />
      )}

      <div className="profile-info">
        {/* Avatar */}
        {currentProfile.avatar?.url ? (
          <img
            className="profile-avatar"
            src={currentProfile.avatar.url}
            alt={currentProfile.avatar.alt || currentProfile.name}
          />
        ) : (
          <i className="bi bi-person-circle profile-avatar"></i>
        )}

        {/* Profile details */}
        <div className="profile-details">
          <h1>{currentProfile.name}</h1>
          <p>{currentProfile.email}</p>
          {currentProfile.bio && <p>{currentProfile.bio}</p>}
          <p>Username: {currentProfile.name}</p>

          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>

          {/* Edit button */}
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
      </div>
  );
}

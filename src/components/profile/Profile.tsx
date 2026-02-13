import { useState } from "react";
import EditProfile from "./EditProfile";
import { API_BASE_URL } from "../../services/api";
import { getToken, getApiKey } from "../../services/auth";
import { toast } from "react-toastify";
import "./profile.css";

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
      const token = getToken();
      const userName = localStorage.getItem("userName");
      const apiKey = getApiKey();

      // If user is not logged in it throws an error
      if (!token || !userName) {
        throw new Error("You must be logged in to update your profile");
      }

      const res = await fetch(`${API_BASE_URL}/holidaze/profiles/${userName}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey,
        },
        body: JSON.stringify(updatedProfile),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.errors?.[0]?.message || "Failed to update profile");
      }

      setCurrentProfile(data.data || data); 
      setIsEditing(false);
      toast.success("Profile updated!");
    } catch (err) {
      console.error("Profile Update Error:", err);
      toast.error(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Shows edit form if user clicks edit button
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
        <div className="avatar-wrapper">
          {currentProfile.avatar?.url ? (
            <img
              className="profile-avatar"
              src={currentProfile.avatar.url}
              alt={currentProfile.avatar.alt || currentProfile.name}
            />
          ) : (
            <i className="bi bi-person-circle profile-avatar"></i>
          )}
        </div>
        <div className="profile-details">
          <h1>{currentProfile.name}</h1>
          <p className="profile-email">{currentProfile.email}</p>
          {currentProfile.bio && <p className="profile-bio">{currentProfile.bio}</p>}
          <button 
            className="btn-edit-trigger" 
            onClick={() => setIsEditing(true)}
          >Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
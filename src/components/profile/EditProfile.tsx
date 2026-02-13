import { useState } from "react";
import type { ProfileData } from "./Profile";
import { toast } from "react-toastify";
import "./profile.css";
import Spinner from "../Spinner";

interface EditProfileProps {
  profile: ProfileData;
  onSave: (updatedProfile: ProfileData) => void;
  onCancel: () => void;
}

export default function EditProfile({ profile, onSave, onCancel }: EditProfileProps) {
  const [bannerUrl, setBannerUrl] = useState(profile.banner?.url || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar?.url || "");
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [bio, setBio] = useState(profile.bio || "");
  const [loading, setLoading] = useState(false);

  const isImageUrlValid = async (url: string): Promise<boolean> => {
    if (!url) return true;
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  };

  const handleBannerUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setBannerUrl(url);
  };

  const handleAvatarUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setAvatarUrl(url);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (bannerUrl && !(await isImageUrlValid(bannerUrl))) {
      toast.error("Banner URL is not a valid image");
      return;
    }
    if (avatarUrl && !(await isImageUrlValid(avatarUrl))) {
      toast.error("Avatar URL is not a valid image");
      return;
    }

    onSave({
      ...profile,
      name,
      email,
      bio,
      avatar: avatarUrl
        ? { url: avatarUrl, alt: `${name}'s avatar` }
        : undefined,
      banner: bannerUrl
        ? { url: bannerUrl, alt: `${name}'s banner` }
        : undefined,
    });
    toast.success("Profile updated successfully!");
  };

  if (loading) return <Spinner />;

  return (
    <form className="edit-profile-form" onSubmit={handleSubmit}>
      <h2>Edit Profile</h2>

      {/* Name */}
      <label>
        Name:
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>

      {/* Banner URL */}
      {bannerUrl && (
        <img src={bannerUrl} alt="Banner preview" onError={(e) => e.currentTarget.style.display = "none"} />
      )}
      <label>
        Banner URL:
        <input value={bannerUrl} onChange={handleBannerUrlChange} />
      </label>

      {/* Avatar URL */}
      {avatarUrl && (
        <img src={avatarUrl} alt="Avatar preview" onError={(e) => e.currentTarget.style.display = "none"} />
      )}
      <label>
        Avatar URL:
        <input value={avatarUrl} onChange={handleAvatarUrlChange} />
      </label>

      {/* Email */}
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>

      {/* Bio */}
      <label>
        Bio:
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
      </label>

      {/* Action buttons */}
      <div className="form-buttons">
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

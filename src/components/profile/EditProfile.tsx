import { useState } from "react";
import type { ProfileData } from "./Profile";
import { toast } from 'react-toastify';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <form className="edit-profile-form" onSubmit={handleSubmit}>
      <h2>Edit Profile</h2>

      {/* Name */}
      <label>
        Name:
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>

      {/* Banner URL */}
      {bannerUrl && <img src={bannerUrl} alt="Banner preview" />}
      <label>
        Banner URL:
        <input value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} />
      </label>

      {/* Avatar URL */}
      {avatarUrl && <img src={avatarUrl} alt="Avatar preview" />}
      <label>
        Avatar URL:
        <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
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

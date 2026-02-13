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
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    bio: profile.bio || "",
    avatarUrl: profile.avatar?.url || "",
    bannerUrl: profile.banner?.url || ""
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Checks if the image URL is valid
  const isImageUrlValid = (url: string): Promise<boolean> => {
    if (!url) return Promise.resolve(true);
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { bannerUrl, avatarUrl, name, email, bio } = formData;

    const [isBannerOk, isAvatarOk] = await Promise.all([
      isImageUrlValid(bannerUrl),
      isImageUrlValid(avatarUrl)
    ]);

    if (!isBannerOk || !isAvatarOk) {
      toast.error("Please provide valid image URLs");
      setLoading(false);
      return;
    }

    // Updates the profile if data is valid
    onSave({
      ...profile,
      name,
      email,
      bio,
      avatar: avatarUrl ? { url: avatarUrl, alt: `${name}'s avatar` } : undefined,
      banner: bannerUrl ? { url: bannerUrl, alt: `${name}'s banner` } : undefined,
    });
    
    toast.success("Profile updated successfully!");
  };

  if (loading) return <Spinner />;

  return (
    <form className="edit-profile-form" onSubmit={handleSubmit}>
      <h2>Edit Profile</h2>
      <label>
        Name:
        <input name="name" value={formData.name} onChange={handleChange} />
      </label>
      {formData.bannerUrl && (
        <img 
          src={formData.bannerUrl} 
          alt="Banner preview" 
          onError={(e) => (e.currentTarget.style.display = "none")} 
        />
      )}
      <label>
        Banner URL:
        <input name="bannerUrl" value={formData.bannerUrl} onChange={handleChange} />
      </label>
      {formData.avatarUrl && (
        <img 
          src={formData.avatarUrl} 
          alt="Avatar preview" 
          onError={(e) => (e.currentTarget.style.display = "none")} 
        />
      )}
      <label>
        Avatar URL:
        <input name="avatarUrl" value={formData.avatarUrl} onChange={handleChange} />
      </label>
      <label>
        Email:
        <input name="email" type="email" value={formData.email} onChange={handleChange} />
      </label>
      <label>
        Bio:
        <textarea name="bio" value={formData.bio} onChange={handleChange} />
      </label>
      <div className="form-buttons">
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
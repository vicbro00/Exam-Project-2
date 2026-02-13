import { useState } from "react";
import { getToken, getApiKey } from "../../services/auth";
import { toast } from "react-toastify";
import "./create-edit-venue.css";
import Spinner from "../Spinner";

interface Venue {
  id?: string;
  name: string;
  description: string;
  media?: Array<{ url: string; alt?: string }>;
  price: number;
  maxGuests: number;
  location?: {
    address?: string;
    city?: string;
    country?: string;
  };
  meta?: {
    wifi?: boolean;
    parking?: boolean;
    breakfast?: boolean;
    pets?: boolean;
  };
}

interface CreateEditVenueProps {
  venue?: Venue | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateEditVenue({ venue, onClose, onSuccess }: CreateEditVenueProps) {
  const isEditing = !!venue;
  
  const [formData, setFormData] = useState({
    name: venue?.name || "",
    description: venue?.description || "",
    price: venue?.price || 0,
    maxGuests: venue?.maxGuests || 1,
    address: venue?.location?.address || "",
    city: venue?.location?.city || "",
    country: venue?.location?.country || "",
    mediaUrl: venue?.media?.[0]?.url || "",
    mediaAlt: venue?.media?.[0]?.alt || "",
    wifi: venue?.meta?.wifi || false,
    parking: venue?.meta?.parking || false,
    breakfast: venue?.meta?.breakfast || false,
    pets: venue?.meta?.pets || false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    
    setFormData(prev => ({
      ...prev,
      [target.name]: value
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const token = getToken();
      const apiKey = getApiKey();

      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        maxGuests: Number(formData.maxGuests),
        media: formData.mediaUrl ? [{ url: formData.mediaUrl, alt: formData.mediaAlt }] : [],
        location: {
          address: formData.address,
          city: formData.city,
          country: formData.country,
        },
        meta: {
          wifi: formData.wifi,
          parking: formData.parking,
          breakfast: formData.breakfast,
          pets: formData.pets,
        },
      };

      const url = isEditing
        ? `https://v2.api.noroff.dev/holidaze/venues/${venue.id}`
        : "https://v2.api.noroff.dev/holidaze/venues";
      
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.errors?.[0]?.message || "Failed to save venue");
      }

      toast.success(`Venue ${isEditing ? "updated" : "created"} successfully!`);
      onSuccess();
      onClose();
      
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "Failed to save venue");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Spinner />;

  return (
  <div className="venue-overlay" onClick={onClose}>
    <div className="venue-container" onClick={(e) => e.stopPropagation()}>
      
      {/* Header */}
      <div className="venue-header">
        <h2>{isEditing ? "Edit Venue" : "Create New Venue" }</h2>
        <button className="btn-close" onClick={onClose}></button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="venue-form">

        {/* Basic Info */}
        <div className="form-section">
          <h3>Basic Information</h3>

          <label>
            Venue Name *
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Description *
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </label>
        </div>

        {/* Price & Guests */}
        <div className="form-section form-row">
          <label>
            Price per Night *
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              required
            />
          </label>

          <label>
            Max Guests *
            <input
              type="number"
              name="maxGuests"
              value={formData.maxGuests}
              onChange={handleChange}
              min="1"
              required
            />
          </label>
        </div>

        {/* Image */}
        <div className="form-section">
          <h3>Image</h3>

          <label>
            Image URL
            <input
              type="url"
              name="mediaUrl"
              value={formData.mediaUrl}
              onChange={handleChange}
            />
          </label>

          <label>
            Image Description
            <input
              type="text"
              name="mediaAlt"
              value={formData.mediaAlt}
              onChange={handleChange}
            />
          </label>
        </div>

        {/* Location */}
        <div className="form-section">
          <h3>Location</h3>

          <label>
            Address
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </label>

          <div className="form-row">
            <label>
              City
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </label>

            <label>
              Country
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </label>
          </div>
        </div>

        {/* Amenities */}
        <div className="form-section">
          <h3>Amenities</h3>
          <div className="amenities">
            {["wifi", "parking", "breakfast", "pets"].map((amenity) => (
              <label key={amenity}>
                <input
                  type="checkbox"
                  name={amenity}
                  checked={formData[amenity as keyof typeof formData] as boolean}
                  onChange={handleChange}
                />
                <span>{amenity.charAt(0).toUpperCase() + amenity.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && <p className="error">{error}</p>}

        {/* Actions */}
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Saving..." : isEditing ? "Update Venue" : "Create Venue"}
          </button>
        </div>
      </form>
    </div>
  </div>
  );
}
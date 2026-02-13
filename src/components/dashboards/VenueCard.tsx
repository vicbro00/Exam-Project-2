interface VenueMedia {
  url: string;
  alt?: string;
}

interface VenueLocation {
  address?: string;
  city?: string;
  country?: string;
}

interface Venue {
  id: string;
  name: string;
  description: string;
  media?: VenueMedia[];
  price: number;
  maxGuests: number;
  location?: VenueLocation;
  rating?: number;
  meta?: {
    wifi?: boolean;
    parking?: boolean;
    breakfast?: boolean;
    pets?: boolean;
  };
}

interface VenueCardProps {
  venue: Venue;
  onEdit: (venue: Venue) => void;
  onDelete: (venueId: string) => void;
}

export default function VenueCard({ venue, onEdit, onDelete }: VenueCardProps) {
  const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1615800098779-1be32e60cca3?q=80&w=710&auto=format&fit=crop";

  const { name, location, description, price, maxGuests, meta, media } = venue;
  
  // Uses images, otherwise uses fallback image incase of missing URL
  const imageUrl = media?.[0]?.url || PLACEHOLDER_IMAGE;
  const locationText = location?.city && location?.country 
    ? `${location.city}, ${location.country}` 
    : "Location not specified";

  return (
    <div className="venue-card">
      <img 
        src={imageUrl} 
        alt={media?.[0]?.alt || name}
        className="venue-card-image"
        onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE)}
      />
      
      <div className="venue-card-content">
        <h3>{name}</h3>
        <p className="venue-location">{locationText}</p>
        
        <p className="venue-description">
          {description.length > 100 ? `${description.slice(0, 100)}...` : description}
        </p>
        <div className="venue-details">
          <span className="venue-price">${price} / night</span>
          <span className="venue-guests">Max {maxGuests} guests</span>
        </div>
        {meta && (
          <div className="venue-amenities">
            {meta.wifi && <span>📶 WiFi</span>}
            {meta.parking && <span>🅿️ Parking</span>}
            {meta.breakfast && <span>🍳 Breakfast</span>}
            {meta.pets && <span>🐕 Pets</span>}
          </div>
        )}
        <div className="venue-card-actions">
          <button onClick={() => onEdit(venue)} className="btn-edit">
            <i className="bi bi-pencil"></i> Edit
          </button>
          <button onClick={() => onDelete(venue.id)} className="btn-delete">
            <i className="bi bi-trash"></i> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
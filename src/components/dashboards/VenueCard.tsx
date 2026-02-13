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
  const imageUrl = venue.media?.[0]?.url || "https://images.unsplash.com/photo-1615800098779-1be32e60cca3?q=80&w=710&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <div className="venue-card">
      <img 
        src={imageUrl} 
        alt={venue.media?.[0]?.alt || venue.name}
        className="venue-card-image"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1615800098779-1be32e60cca3?q=80&w=710&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
        }}
      />
      
      <div className="venue-card-content">
        <h3>{venue.name}</h3>
        <p className="venue-location">
          {venue.location?.city && venue.location?.country 
            ? `${venue.location.city}, ${venue.location.country}`
            : "Location not specified"}
        </p>
        
        <p className="venue-description">
          {venue.description.length > 100 
            ? `${venue.description.substring(0, 100)}...` 
            : venue.description}
        </p>

        <div className="venue-details">
          <span className="venue-price">${venue.price} / night</span>
          <span className="venue-guests">Max {venue.maxGuests} guests</span>
        </div>

        {venue.meta && (
          <div className="venue-amenities">
            {venue.meta.wifi && <span className="amenity">📶 WiFi</span>}
            {venue.meta.parking && <span className="amenity">🅿️ Parking</span>}
            {venue.meta.breakfast && <span className="amenity">🍳 Breakfast</span>}
            {venue.meta.pets && <span className="amenity">🐕 Pets</span>}
          </div>
        )}

        <div className="venue-card-actions">
          <button 
            className="btn-edit" 
            onClick={() => onEdit(venue)}
          >
            <i className="bi bi-pencil"></i> Edit
          </button>
          <button 
            className="btn-delete" 
            onClick={() => onDelete(venue.id)}
          >
            <i className="bi bi-trash"></i> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
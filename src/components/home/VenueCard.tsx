import { useNavigate } from "react-router-dom";
import "./venue-card.css";

interface VenueProps {
  id: string;
  name: string;
  description?: string;
  price?: number;
  maxGuests?: number;
  rating?: number;
  media?: { url: string; alt?: string }[];
  location?: {
    address?: string;
    city?: string;
    country?: string;
  };
  variant?: "list" | "detail";
}

export default function VenueCard(props: VenueProps) {
  const { 
    id, name, description, price, maxGuests, 
    rating, media, location, variant = "list" 
  } = props;
  
  const navigate = useNavigate();
  
  // Uses a placeholder image incase venue doesn't have a media url
  const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1615800098779-1be32e60cca3?q=80&w=710&auto=format&fit=crop";

  return (
    <div className={`venue-card ${variant}`}>
      <h2 className="venue-title">{name}</h2>
      
      {media && media.length > 0 && (
        <img 
          src={media[0].url} 
          alt={media[0].alt || name} 
          loading="lazy"
          width="600"
          height="400"
          style={{ objectFit: 'cover' }}
          onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE)}
        />
      )}

      <div className="venue-container">
        {variant === "detail" && description && <p>{description}</p>}
        {location && (
          <div className="venue-location-rating">
            <div>
              {location.address && <p>Address: {location.address}</p>}
              {location.city && <p>City: {location.city}</p>}
              {location.country && <p>Country: {location.country}</p>}
            </div>

            {rating !== undefined && (
              <div className="venue-rating">
                <i className="bi bi-star-fill"></i>
                <span>{rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        )}
        {typeof price === 'number' && <p>Price: ${price}</p>}
        {typeof maxGuests === 'number' && <p>Max Guests: {maxGuests}</p>}
      </div>
      {variant === "list" && (
        <button
          className="details-button"
          onClick={() => navigate(`/venues/${id}`)}
        >View Venue
        </button>
      )}
    </div>
  );
}
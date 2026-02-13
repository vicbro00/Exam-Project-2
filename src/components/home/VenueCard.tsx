import { useNavigate } from "react-router-dom";
import "./venue-card.css";

type VenueProps = {
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
};

export default function VenueCard({
  id,
  name,
  description,
  price,
  maxGuests,
  rating,
  media,
  location,
  variant = "list",
}: VenueProps) {
  const navigate = useNavigate();
  return (
    <div className={`venue-card ${variant}`}>
        <h2 className="venue-title">{name}</h2>
      
      {media && media.length > 0 && (
        <img src={media[0].url} alt={media[0].alt || name} />
      )}

      <div className="venue-container">
        {variant === "detail" && description && <p>{description}</p>}

        {location && (<div className="venue-location-rating">
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

        {price !== undefined && <p>Price: ${price}</p>}
        {maxGuests !== undefined && <p>Max Guests: {maxGuests}</p>}
      </div>

      {variant === "list" && (
        <button
          className="details-button"
          onClick={() => navigate(`/venues/${id}`)}
        >
          View Venue
        </button>
      )}
    </div>
  );
}
import { Link } from 'react-router-dom';
import './venue-card.css';

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
  variant?: 'list' | 'detail';
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
  variant = 'list',
}: VenueProps) {
  return (
    <div className={`venue-card ${variant}`}>
      {media && media.length > 0 && (
        <img src={media[0].url} alt={media[0].alt || name} className="venue-image" />
      )}

      <h2>{name}</h2>

      {variant === 'detail' && description && <p>{description}</p>}

      {location && (
        <p>
          {location.city && `${location.city}, `}{location.country}
        </p>
      )}

      {price !== undefined && <p>Price: ${price}</p>}
      {maxGuests !== undefined && <p>Max Guests: {maxGuests}</p>}
      {rating !== undefined && <p>Rating: {rating}</p>}

      {variant === 'list' && (
        <Link to={`/venues/${id}`} className="details-link">
          View Details
        </Link>
      )}
    </div>
  );
}

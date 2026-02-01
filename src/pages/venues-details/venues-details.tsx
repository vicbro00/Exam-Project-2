import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../../services/api';
import VenueCard from '../../components/home/venue-card';
import VenueCalendar from '../../components/venue/calendar';
import './venues-details.css';

interface VenueLocation {
  address?: string;
  city?: string;
  country?: string;
}

interface Venue {
  id: string;
  name: string;
  description: string;
  location: VenueLocation;
  price: number;
  imageUrl?: string;
}

export default function VenueDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVenue() {
      const res = await fetch(`${API_BASE_URL}/holidaze/venues/${id}`);
      const data = await res.json();
      const venueData = {
        ...data.data,
        location: typeof data.data.location === 'string'
          ? { address: data.data.location }
          : data.data.location,
      };
      setVenue(venueData);
      setLoading(false);
    }
    fetchVenue();
  }, [id]);

  if (loading) return <p>Loading venue...</p>;
  if (!venue) return <p>Venue not found</p>;

  return <div>
      <VenueCard {...venue} variant="detail" />
      <VenueCalendar />
    </div>
}

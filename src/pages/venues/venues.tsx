import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../services/api';
import VenueCard from '../../components/home/venue-card';

interface Venue {
  id: string;
  name: string;
  [key: string]: unknown;
}

export default function Venues() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVenues() {
      const res = await fetch(`${API_BASE_URL}/holidaze/venues`);
      const data = await res.json();
      setVenues(data.data);
      setLoading(false);
    }
    fetchVenues();
  }, []);

  if (loading) return <p>Loading venues...</p>;

  return (
    <div>
      {venues.map(venue => (
        <VenueCard key={venue.id} {...venue} name={venue.name} variant="list" />
      ))}
    </div>
  );
}

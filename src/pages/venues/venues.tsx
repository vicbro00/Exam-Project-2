import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../services/api';
import VenueCard from '../../components/home/VenueCard';
import Search from '../../components/home/search';

interface Venue {
  id: string;
  name: string;
  [key: string]: unknown;
}

export default function Venues() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [search, setSearch] = useState('');
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

  const filteredVenues = venues.filter((venue) =>
    venue.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p>Loading venues...</p>;

  return (
    <div>
      <Search value={search} onChange={setSearch} />

      {filteredVenues.length === 0 && <p>No venues found.</p>}

      {filteredVenues.map((venue) => (
        <VenueCard
          key={venue.id}
          {...venue}
          name={venue.name}
          variant="list"
        />
      ))}
    </div>
  );
}
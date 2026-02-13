import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../services/api";
import VenueCard from "../../components/home/VenueCard";
import Search from "../../components/home/Search";
import "./venues.css";
import Spinner from "../../components/Spinner";

interface Venue {
  id: string;
  name: string;
  price: number
  rating: number;
  [key: string]: unknown;
}

export default function Venues() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    async function fetchVenues() {
      const res = await fetch(`${API_BASE_URL}/holidaze/venues`);
      const data = await res.json();
      setVenues(data.data);
      setLoading(false);
    }
    fetchVenues();
  }, []);

  const filteredVenues = venues
  .filter((venue) =>
    venue.name.toLowerCase().includes(search.toLowerCase())
  )
  .sort((a, b) => {
    if (filter === "price-low") return a.price - b.price;
    if (filter === "price-high") return b.price - a.price;
    if (filter === "rating") return b.rating - a.rating;
    return 0;
  });

  if (loading) return <Spinner />;

  return (
    <div>
      <Search value={search} onChange={setSearch} filter={filter} onFilterChange={setFilter} />

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
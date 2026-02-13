import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../../services/api";
import VenueCard from "../../components/home/VenueCard";
import VenueCalendar from "../../components/venue/Calendar";
import CustomerBooking from "../../components/venue/CustomerBooking";
import "./venues-details.css";
import Spinner from "../../components/Spinner";

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
  maxGuests: number;
}

export default function VenueDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDateFrom, setSelectedDateFrom] = useState<string | null>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVenue() {
      const res = await fetch(`${API_BASE_URL}/holidaze/venues/${id}`);
      const data = await res.json();
      const venueData = {
        ...data.data,
        location: typeof data.data.location === "string"
          ? { address: data.data.location }
          : data.data.location,
      };
      setVenue(venueData);
      setLoading(false);
    }
    fetchVenue();
  }, [id]);

  if (loading) return <Spinner />;
  if (!venue) return <p>Venue not found</p>;

  return (
    <div>
      <VenueCard {...venue} variant="detail" />
      
      <VenueCalendar 
        venueId={venue.id}
        onDateSelect={(dateFrom, dateTo) => {
          setSelectedDateFrom(dateFrom);
          setSelectedDateTo(dateTo);
        }}
      />
      
      <CustomerBooking
        venueId={venue.id}
        maxGuests={venue.maxGuests}
        selectedDateFrom={selectedDateFrom}
        selectedDateTo={selectedDateTo}
      />
    </div>
  );
}
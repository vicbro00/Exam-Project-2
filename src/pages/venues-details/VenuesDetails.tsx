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
  const [error, setError] = useState<string | null>(null);
  const [selectedDateFrom, setSelectedDateFrom] = useState<string | null>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchVenue() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/holidaze/venues/${id}?_bookings=true`);
        
        if (!res.ok) throw new Error("Could not find the requested venue");

        const data = await res.json();
        
        const rawLocation = data.data.location;
        const venueData = {
          ...data.data,
          location: typeof rawLocation === "string"
            ? { address: rawLocation }
            : rawLocation || { address: "Address unknown" }, 
        };

        setVenue(venueData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchVenue();
  }, [id]);

  if (loading) return <Spinner />;
  
  // Shows error if venue not found
  if (error || !venue) {
    return (
      <div className="error-container">
        <p>{error || "Venue not found"}</p>
        <button onClick={() => window.history.back()}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="venue-details-container">
      <VenueCard {...venue} variant="detail" />
      <section className="booking-section">
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
      </section>
    </div>
  );
}
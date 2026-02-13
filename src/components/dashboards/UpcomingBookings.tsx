import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, getApiKey } from "../../services/auth";

interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  venue?: {
    id: string;
    name: string;
    media?: Array<{ url: string; alt?: string }>;
  };
  customer?: {
    name: string;
    email: string;
  };
}

interface VenueWithBookings {
  id: string;
  name: string;
  bookings: Booking[];
}

interface UpcomingBookingsProps {
  isManager: boolean;
}

export default function UpcomingBookings({ isManager }: UpcomingBookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [venues, setVenues] = useState<VenueWithBookings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
  const sectionTitle = isManager ? "Bookings on Your Venues" : "Upcoming Bookings";

  useEffect(() => {
    if (!userName) {
      setError("Please log in to view bookings");
      setLoading(false);
      return;
    }

    const apiFetch = async (endpoint: string) => {
      const response = await fetch(`https://v2.api.noroff.dev/holidaze/profiles/${userName}${endpoint}`, {
        headers: {
          "Authorization": `Bearer ${getToken()}`,
          "X-Noroff-API-Key": getApiKey()!,
        },
      });
      if (!response.ok) throw new Error("Could not fetch booking data");
      return response.json();
    };

    // Loads either bookings for managers or venues with bookings for customers
    async function loadData() {
      try {
        setLoading(true);
        if (isManager) {
          const result = await apiFetch("/venues?_bookings=true");
          const activeVenues = result.data
            .filter((v: VenueWithBookings) => v.bookings?.length > 0)
            .map((v: VenueWithBookings) => ({
              ...v,
              bookings: v.bookings.sort((a: Booking, b: Booking) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime())
            }));
          setVenues(activeVenues);
        } else {
          const result = await apiFetch("/bookings?_venue=true");
          const upcoming = result.data
            .filter((b: Booking) => new Date(b.dateTo) >= new Date())
            .sort((a: Booking, b: Booking) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime());
          setBookings(upcoming);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [isManager, userName]);

  // Formats into readable dates
  const formatDates = (s: string, e: string) => 
    `${new Date(s).toLocaleDateString()} – ${new Date(e).toLocaleDateString()}`;

  if (loading) return <section className="upcoming-bookings"><h3>{sectionTitle}</h3><p>Loading...</p></section>;
  if (error) return <section className="upcoming-bookings"><h3>{sectionTitle}</h3><p className="error">{error}</p></section>;

  return (
    <section className="upcoming-bookings">
      <h3>{sectionTitle}</h3>
      {/* Changes views based on manager or customer */}
      {isManager && (
        venues.length > 0 ? (
          venues.map(venue => (
            <div key={venue.id} className="venue-bookings-group">
              <h4>{venue.name}</h4>
              <ul className="bookings-list">
                {venue.bookings.map(b => (
                  <li key={b.id} className="booking-item">
                    <div className="booking-details">
                      <strong>{b.customer?.name || 'Guest'}</strong>
                      <p>{b.customer?.email}</p>
                      <p>{formatDates(b.dateFrom, b.dateTo)}</p>
                      <p>{b.guests} {b.guests === 1 ? 'guest' : 'guests'}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : <p>No bookings on your venues yet</p>
      )}
      {!isManager && (
        bookings.length > 0 ? (
          <ul className="bookings-list">
            {bookings.map(b => (
              <li key={b.id} className="booking-item">
                <strong>{b.venue?.name}</strong>
                {b.venue?.media?.[0] && (
                  <img src={b.venue.media[0].url} alt="Venue" className="booking-venue-image" />
                )}
                <div className="booking-details">
                  <p>{formatDates(b.dateFrom, b.dateTo)}</p>
                  <p>{b.guests} guests</p>
                  <button onClick={() => navigate(`/venues/${b.venue?.id}`)}>View Venue</button>
                </div>
              </li>
            ))}
          </ul>
        ) : <p>No upcoming bookings</p>
      )}
    </section>
  );
}
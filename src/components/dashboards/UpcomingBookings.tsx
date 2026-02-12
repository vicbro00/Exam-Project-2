import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, getApiKey } from '../../services/auth';

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

// Helper function for API requests
async function fetchWithAuth(url: string) {
  const token = getToken();
  const apiKey = getApiKey();
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Noroff-API-Key': apiKey,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.message || 'Request failed');
  }
  
  return response.json();
}

// Helper to sort bookings by date
function sortBookingsByDate(bookings: Booking[]): Booking[] {
  return [...bookings].sort(
    (a, b) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime()
  );
}

// Helper to filter upcoming bookings
function filterUpcomingBookings(bookings: Booking[]): Booking[] {
  const today = new Date();
  return bookings.filter(booking => new Date(booking.dateTo) >= today);
}

// Booking item component for customer view
function CustomerBookingItem({ booking }: { booking: Booking }) {
  const navigate = useNavigate();
  const venueImage = booking.venue?.media?.[0];

  const handleViewVenue = () => {
    if (booking.venue?.id) {
      navigate(`/venues/${booking.venue.id}`);
    }
  };

  return (
    <li className="booking-item">
      <strong>{booking.venue?.name || 'Unknown Venue'}</strong>
      {venueImage && (
        <img 
          src={venueImage.url} 
          alt={venueImage.alt || booking.venue?.name || 'Venue'}
          className="booking-venue-image"
        />
      )}
      <div className="booking-details">
        <p>{formatDateRange(booking.dateFrom, booking.dateTo)}</p>
        <p>{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</p>
        {booking.venue?.id && (
          <button 
            className="btn-view-venue" 
            onClick={handleViewVenue}
          >
            View Venue
          </button>
        )}
      </div>
    </li>
  );
}

// Booking item component for manager view
function ManagerBookingItem({ booking }: { booking: Booking }) {
  return (
    <li className="booking-item">
      <div className="booking-details">
        <strong>{booking.customer?.name || 'Guest'}</strong>
        <p>{booking.customer?.email}</p>
        <p>{formatDateRange(booking.dateFrom, booking.dateTo)}</p>
        <p>{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</p>
      </div>
    </li>
  );
}

// Helper to format date range
function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start).toLocaleDateString();
  const endDate = new Date(end).toLocaleDateString();
  return `${startDate} – ${endDate}`;
}

// Main component
export default function UpcomingBookings({ isManager }: UpcomingBookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [venues, setVenues] = useState<VenueWithBookings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  const sectionTitle = isManager ? 'Bookings on Your Venues' : 'Upcoming Bookings';
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    async function loadManagerBookings() {
      const data = await fetchWithAuth(
        `https://v2.api.noroff.dev/holidaze/profiles/${userName}/venues?_bookings=true`
      );
      
      const venuesWithBookings = data.data
        .filter((venue: VenueWithBookings) => venue.bookings?.length)
        .map((venue: VenueWithBookings) => ({
          ...venue,
          bookings: sortBookingsByDate(venue.bookings)
        }));
      
      setVenues(venuesWithBookings);
    }

    async function loadCustomerBookings() {
      const data = await fetchWithAuth(
        `https://v2.api.noroff.dev/holidaze/profiles/${userName}/bookings?_venue=true`
      );
      
      const upcomingBookings = sortBookingsByDate(
        filterUpcomingBookings(data.data)
      );
      
      setBookings(upcomingBookings);
    }

    async function loadData() {
      try {
        setLoading(true);
        
        if (!userName || !getToken()) {
          setError('Please log in to view bookings');
          return;
        }

        if (isManager) {
          await loadManagerBookings();
        } else {
          await loadCustomerBookings();
        }
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [isManager, userName]);

  function handleError(err: unknown) {
    console.error('Error loading bookings:', err);
    const message = err instanceof Error ? err.message : 'Failed to load bookings';
    setError(message);
  }

  if (loading) {
    return (
      <section className="upcoming-bookings">
        <h3>{sectionTitle}</h3>
        <p>Loading bookings…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="upcoming-bookings">
        <h3>{sectionTitle}</h3>
        <p className="error">{error}</p>
      </section>
    );
  }

  // Manager view
  if (isManager) {
    if (!venues.length) {
      return (
        <section className="upcoming-bookings">
          <h3>{sectionTitle}</h3>
          <p>No bookings on your venues yet</p>
        </section>
      );
    }

    return (
      <section className="upcoming-bookings">
        <h3>{sectionTitle}</h3>
        {venues.map(venue => (
          <div key={venue.id} className="venue-bookings-group">
            <h4>{venue.name}</h4>
            <ul className="bookings-list">
              {venue.bookings.map(booking => (
                <ManagerBookingItem key={booking.id} booking={booking} />
              ))}
            </ul>
          </div>
        ))}
      </section>
    );
  }

  // Customer view
  if (!bookings.length) {
    return (
      <section className="upcoming-bookings">
        <h3>{sectionTitle}</h3>
        <p>No upcoming bookings</p>
      </section>
    );
  }

  return (
    <section className="upcoming-bookings">
      <h3>{sectionTitle}</h3>
      <ul className="bookings-list">
        {bookings.map(booking => (
          <CustomerBookingItem key={booking.id} booking={booking} />
        ))}
      </ul>
    </section>
  );
}
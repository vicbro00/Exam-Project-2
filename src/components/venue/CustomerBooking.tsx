import { useState } from "react";
import { isVenueManager, getToken, getApiKey } from "../../services/auth";
import { toast } from "react-toastify";
import Spinner from "../Spinner";

interface CustomerBookingProps {
  venueId: string;
  maxGuests: number;
  selectedDateFrom: string | null;
  selectedDateTo: string | null;
}

export default function CustomerBooking({ 
  venueId, 
  maxGuests,
  selectedDateFrom,
  selectedDateTo 
}: CustomerBookingProps) {
  const token = getToken();
  const venueManager = isVenueManager();

  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Only customers can book a venue
  if (!token) return <p className="auth-notice">Please log in to book this venue.</p>;
  if (venueManager) return <p className="auth-notice">Venue managers cannot make bookings.</p>;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    setError(null);
    setSuccess(false);

    // Booking is on available dates only, and at least one night
    if (!selectedDateFrom || !selectedDateTo) {
      const msg = "Please select dates on the calendar above";
      setError(msg);
      toast.info(msg);
      return;
    }

    if (selectedDateFrom === selectedDateTo) {
      setError("Booking must be for at least one night");
      return;
    }

    setLoading(true);

    try {
      const apiKey = getApiKey();
      
      const res = await fetch("https://v2.api.noroff.dev/holidaze/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey,
        },
        body: JSON.stringify({
          dateFrom: selectedDateFrom,
          dateTo: selectedDateTo,
          guests: Number(guests),
          venueId,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        const errorMessage = result.errors?.[0]?.message || "Booking failed. Please check availability.";
        throw new Error(errorMessage);
      }

      setSuccess(true);
      setGuests(1);
      toast.success("Your booking is confirmed!");
    } catch (err) {
      const fallback = "Could not create booking. Please try again.";
      setError(err instanceof Error ? err.message : fallback);
      toast.error(err instanceof Error ? err.message : fallback);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Spinner />;

  return (
    <section className="customer-booking">
      <h3>Complete your booking</h3>
      {selectedDateFrom && selectedDateTo && (
        <div className="selected-dates">
          <p>
            <strong>Selected:</strong> {new Date(selectedDateFrom).toLocaleDateString()} - {new Date(selectedDateTo).toLocaleDateString()}
          </p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label>
          Number of guests
          <input
            type="number"
            min={1}
            max={maxGuests}
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
            required
          />
          <small>Up to {maxGuests} guests allowed</small>
        </label>
        <button 
          type="submit" 
          disabled={loading || !selectedDateFrom || !selectedDateTo}
          className="btn-confirm-booking"
        >
          {loading ? "Processing..." : "Confirm booking"}
        </button>
        {error && <p className="error-message" role="alert">{error}</p>}
        {success && <p className="success-message" role="status">Success! Booking confirmed.</p>}
      </form>
    </section>
  );
}
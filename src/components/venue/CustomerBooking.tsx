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

  if (!token) {
    return <p>Please log in to book this venue.</p>;
  }

  if (venueManager) {
    return <p>Venue managers cannot make bookings.</p>;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!selectedDateFrom || !selectedDateTo) {
      setError("Please select dates on the calendar above");
      return;
    }

    if (new Date(selectedDateTo) <= new Date(selectedDateFrom)) {
      setError("End date must be after start date");
      return;
    }

    setLoading(true);

    try {
      const apiKey = getApiKey();
      
      const res = await fetch(
        "https://v2.api.noroff.dev/holidaze/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey,
          },
          body: JSON.stringify({
            dateFrom: selectedDateFrom,
            dateTo: selectedDateTo,
            guests,
            venueId,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Booking error:", data);
        const errorMessage = data.errors?.[0]?.message || data.message || "Booking failed";
        throw new Error(errorMessage);
      }

      setSuccess(true);
      setGuests(1);
      toast.success("Booking confirmed!");
    } catch (err) {
      console.error("Booking error:", err);
      setError(err instanceof Error ? err.message : "Could not create booking. Please try logging in again.");
      toast.error(err instanceof Error ? err.message : "Could not create booking. Please try logging in again.");
    } finally {
      setLoading(false);
    }
  } if (loading) return <Spinner />;

  return (
    <section className="customer-booking">
      <h3>Complete your booking</h3>

      {selectedDateFrom && selectedDateTo && (
        <div className="selected-dates">
          <p>
            <strong>Selected dates:</strong> {new Date(selectedDateFrom).toLocaleDateString()} - {new Date(selectedDateTo).toLocaleDateString()}
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
            onChange={(e) => setGuests(Number(e.target.value))}
            required
          />
          <small>Maximum {maxGuests} guests</small>
        </label>

        <button type="submit" disabled={loading || !selectedDateFrom || !selectedDateTo}>
          {loading ? "Booking..." : "Confirm booking"}
        </button>

        {error && <p>{error}</p>}
        {success && <p>Booking confirmed!</p>}
      </form>
    </section>
  );
}
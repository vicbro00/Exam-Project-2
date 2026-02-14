import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import '../../pages/venues-details/venues-details.css';
import { toast } from 'react-toastify';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface VenueCalendarProps {
  venueId: string;
  onDateSelect: (dateFrom: string, dateTo: string) => void;
}

interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
}

export default function VenueCalendar({ venueId, onDateSelect }: VenueCalendarProps) {
  const [value, setValue] = useState<Value>(null);
  const [bookedDates, setBookedDates] = useState<[Date, Date][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${venueId}?_bookings=true`);
        const result = await response.json();
        
        if (result.data?.bookings) {
          const ranges: [Date, Date][] = result.data.bookings.map((b: Booking) => [
            new Date(b.dateFrom),
            new Date(b.dateTo)
          ]);
          setBookedDates(ranges);
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        toast.error('Could not load availability');
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [venueId]);

  // Checks if a venue is booked on the specific date
  const isBooked = (date: Date) => {
    const timeToCompare = new Date(date).setHours(0, 0, 0, 0);
    
    return bookedDates.some(([start, end]) => {
      const startTime = new Date(start).setHours(0, 0, 0, 0);
      const endTime = new Date(end).setHours(0, 0, 0, 0);
      return timeToCompare >= startTime && timeToCompare <= endTime;
    });
  };

  const tileContent = ({ date, view, activeStartDate }: { date: Date; view: string; activeStartDate: Date }) => {
    const isCurrentMonth = date.getMonth() === activeStartDate.getMonth();

    if (view === 'month' && !isBooked(date) && isCurrentMonth) {
      return <span className="available-dot"></span>;
    }
    return null;
  };

  const tileDisabled = ({ date }: { date: Date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Previous dates and booked dates aren't available
    return date < today || isBooked(date);
  };

 const handleDateChange = (newValue: Value) => {
    setValue(newValue);
    
    if (Array.isArray(newValue) && newValue[0] && newValue[1]) {
      // Fixed the timezone issues
      const formatLocalDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const dateFrom = formatLocalDate(newValue[0]);
      const dateTo = formatLocalDate(newValue[1]);
      
      onDateSelect(dateFrom, dateTo);
    }
  };

  if (loading) {
    return (
      <div className="venue-calendar-container">
        <h2>Booking Calendar</h2>
        <p>Loading availability...</p>
      </div>
    );
  }

  return (
    <div className="venue-calendar-container">
      <h2>Booking Calendar</h2>
      <Calendar
        onChange={handleDateChange}
        value={value}
        selectRange={true}
        tileDisabled={tileDisabled}
        tileContent={tileContent}
        minDate={new Date()}
      />
      <div className="calendar-legend">
        <p>
          <span className="legend-dot available"></span>
          Available
        </p>
        <p>
          <span className="legend-dot booked"></span>
          Booked
        </p>
      </div>
    </div>
  );
}
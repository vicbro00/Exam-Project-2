import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import '../../pages/venues-details/venues-details.css'

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
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues/${venueId}?_bookings=true`
        );
        const data = await response.json();
        
        if (data.data?.bookings) {
          const dates: [Date, Date][] = data.data.bookings.map((booking: Booking) => [
            new Date(booking.dateFrom),
            new Date(booking.dateTo)
          ]);
          setBookedDates(dates);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [venueId]);

  const isBooked = (date: Date) => {
    return bookedDates.some(([start, end]) => {
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      
      const startDate = new Date(start);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(end);
      endDate.setHours(0, 0, 0, 0);
      
      return checkDate >= startDate && checkDate <= endDate;
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
    
    if (date < today) {
      return true;
    }
    
    return isBooked(date);
  };

  const handleDateChange = (newValue: Value) => {
    setValue(newValue);
    
    if (Array.isArray(newValue) && newValue[0] && newValue[1]) {
      const dateFrom = newValue[0].toISOString().split('T')[0];
      const dateTo = newValue[1].toISOString().split('T')[0];
      onDateSelect(dateFrom, dateTo);
    }
  };

  if (loading) {
    return <div className="venue-calendar-container">
      <h2>Booking Calendar</h2>
      <p>Loading availability...</p>
    </div>;
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
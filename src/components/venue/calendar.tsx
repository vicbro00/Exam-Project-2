import { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import '../../pages/venues-details/venues-details.css'

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function VenueCalendar() {
  const [value, setValue] = useState<Value>(null);

  const bookedDates = [
    [new Date('2026-02-05'), new Date('2026-02-08')],
    [new Date('2026-02-12'), new Date('2026-02-15')],
  ];

  const isBooked = (date: Date) => {
    return bookedDates.some(([start, end]) => date >= start && date <= end);
  };

  const tileContent = ({ date, view, activeStartDate }: { date: Date; view: string; activeStartDate: Date }) => {
  const isCurrentMonth = date.getMonth() === activeStartDate.getMonth();

  if (view === 'month' && !isBooked(date) && isCurrentMonth) {
    return <span className="available-dot"></span>;
  }
  return null;
};

  const tileDisabled = ({ date }: { date: Date }) => {
    return bookedDates.some(
      ([start, end]) => date >= start && date <= end
    );
  };

  return (
    <div className="venue-calendar-container">
      <h2>Booking Calendar</h2>
      <Calendar
        onChange={setValue}
        value={value}
        selectRange={true}
        tileDisabled={tileDisabled}
        tileContent={tileContent}
      />
      <div className="calendar-legend">
        <p>
          <span className="legend-dot available"></span>
          Available
        </p>
      </div>
    </div>
  );
}
import { useState } from 'react';

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  filter: string;
  onFilterChange: (value: string) => void;
}

export default function Search({
  value,
  onChange,
  filter,
  onFilterChange,
}: SearchProps) {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="search-wrapper">
      <div className="search-input">
        <input
          type="text"
          placeholder="Search venues..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="venue-search"
        />
        <i
          className="bi bi-funnel filter-icon"
          onClick={() => setOpen(!open)}
        ></i>
      </div>
      {open && (
        <div className="filter-dropdown">
          <select
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
          >
            <option value="">No filter</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rating</option>
          </select>
        </div>
      )}
    </div>
  );
}
import { useState } from 'react';

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  filter: string;
  onFilterChange: (value: string) => void;
}

export default function Search({ value, onChange, filter, onFilterChange }: SearchProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Handles search and filter inputs
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange(e.target.value);
  };

  return (
    <div className="search-wrapper">
      <div className="search-input">
        <input
          aria-label="Search venues"
          type="text"
          placeholder="Search venues..."
          value={value}
          onChange={handleSearch}
          className="venue-search"
        />
        <i
          className="bi bi-funnel filter-icon"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          style={{ cursor: 'pointer' }}
        ></i>
      </div>
      {/* Shows filters when icon is clicked */}
      {isFilterOpen && (
        <div className="filter-dropdown">
          <select
            value={filter}
            onChange={handleFilter}
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
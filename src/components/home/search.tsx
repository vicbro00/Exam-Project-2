interface SearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function Search({ value, onChange }: SearchProps) {
  return (
    <input
      type="text"
      placeholder="Search venues..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="venue-search"
    />
  );
}
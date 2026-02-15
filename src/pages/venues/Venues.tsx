import { useEffect, useState, useMemo } from "react";
import { API_BASE_URL } from "../../services/api";
import VenueCard from "../../components/home/VenueCard";
import Search from "../../components/home/Search";
import "./venues.css";
import Spinner from "../../components/Spinner";

interface Venue {
  id: string;
  name: string;
  price: number;
  rating: number;
  created: string;
  [key: string]: unknown;
}

export default function Venues() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const VENUES_PER_PAGE = 10;

  useEffect(() => {
    async function fetchVenues() {
      setLoading(true);
      try {
        const url = `${API_BASE_URL}/holidaze/venues?limit=${VENUES_PER_PAGE}&page=${page}&sort=created&sortOrder=desc`;
        const res = await fetch(url);
        
        if (!res.ok) throw new Error("Failed to fetch venues");
        
        const data = await res.json();
        setVenues(data.data || []);

        // Calculates total pages based on API
        if (data.meta?.totalCount) {
          setTotalPages(Math.ceil(data.meta.totalCount / VENUES_PER_PAGE));
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVenues();
  }, [page]);

  const filteredVenues = useMemo(() => {
    let result = [...venues];

    if (search) {
      result = result.filter((v) => 
        v.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter === "price-low") result.sort((a, b) => a.price - b.price);
    if (filter === "price-high") result.sort((a, b) => b.price - a.price);
    if (filter === "rating") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [venues, search, filter]);

  useEffect(() => {
    setPage(1);
  }, [search, filter]);

  const goToPage = (pageNum: number) => setPage(pageNum);

  return (
    <div className="venues-page">
      <Search
        value={search}
        onChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
      />
      {loading ? (
        <Spinner />
      ) : (
        <>
          {filteredVenues.length === 0 ? (
            <div className="no-results">
              <p>No venues match your search!</p>
            </div>
          ) : (
            <div className="venues-grid">
              {filteredVenues.map((venue) => (
                <VenueCard
                  key={venue.id}
                  {...venue}
                  variant="list"
                />
              ))}
            </div>
          )}
          {totalPages > 1 && (
            <nav className="pagination" aria-label="Venue navigation">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="previous-btn"
              >Previous
              </button>
              <div className="pages-number">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`pagination-number ${page === pageNum ? "active" : ""}`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className="next-btn"
              >Next
              </button>
            </nav>
          )}
          <div className="pages-text">
            Showing page {page} of {totalPages}
          </div>
        </>
      )}
    </div>
  );
}
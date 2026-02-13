import { useEffect, useState } from "react";
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
        const res = await fetch(
          `${API_BASE_URL}/holidaze/venues?limit=${VENUES_PER_PAGE}&page=${page}&sort=created&sortOrder=desc`
        );
        const data = await res.json();
        setVenues(data.data || []);

        if (data.meta?.totalCount) {
          setTotalPages(Math.ceil(data.meta.totalCount / VENUES_PER_PAGE));
        } else {
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching venues:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVenues();
  }, [page]);

  const filteredVenues = venues
    .filter((venue) =>
      venue.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (filter === "price-low") return a.price - b.price;
      if (filter === "price-high") return b.price - a.price;
      if (filter === "rating") return b.rating - a.rating;
      return 0;
    });

  useEffect(() => {
    setPage(1);
  }, [search, filter]);

  const goToNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const goToPrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const goToPage = (pageNum: number) => {
    setPage(pageNum);
  };

  if (loading) return <Spinner />;

  return (
    <div className="venues-page">
      <Search
        value={search}
        onChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
      />

      {filteredVenues.length === 0 && <p>No venues found.</p>}

      <div className="venues-grid">
        {filteredVenues.map((venue) => (
          <VenueCard
            key={venue.id}
            {...venue}
            name={venue.name}
            variant="list"
          />
        ))}
      </div>

      {/* Pages Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={goToPrevPage}
            disabled={page === 1}
            className="previous-btn"
          >
            Previous
          </button>

          <div className="pages-number">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`pagination-number ${
                    page === pageNum ? "active" : ""
                  }`}
                >
                  {pageNum}
                </button>
              )
            )}
          </div>

          <button
            onClick={goToNextPage}
            disabled={page === totalPages}
            className="next-btn"
          >
            Next
          </button>
        </div>
      )}

      <div className="pages-text">
        Page {page} of {totalPages}
      </div>
    </div>
  );
}

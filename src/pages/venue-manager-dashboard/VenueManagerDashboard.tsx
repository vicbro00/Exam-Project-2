import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn, isVenueManager, getToken, getApiKey } from "../../services/auth";
import UpcomingBookings from "../../components/dashboards/UpcomingBookings";
import VenueCard from "../../components/dashboards/VenueCard";
import CreateEditVenue from "../../components/dashboards/CreateEditVenue";
import "./../customer-dashboard/dashboard.css";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";

interface VenueMedia {
  url: string;
  alt?: string;
}

interface VenueLocation {
  address?: string;
  city?: string;
  country?: string;
}

interface Venue {
  id: string;
  name: string;
  description: string;
  media?: VenueMedia[];
  price: number;
  maxGuests: number;
  location?: VenueLocation;
  rating?: number;
  meta?: {
    wifi?: boolean;
    parking?: boolean;
    breakfast?: boolean;
    pets?: boolean;
  };
}

export default function VenueManagerDashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
  const loggedIn = isLoggedIn();
  const isManager = isVenueManager();

  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateEdit, setShowCreateEdit] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);

  const fetchVenues = useCallback(async () => {
    try {
      const token = getToken();
      const apiKey = getApiKey();

      if (!userName || !token) throw new Error("Authentication credentials missing");

      const res = await fetch(`https://v2.api.noroff.dev/holidaze/profiles/${userName}/venues`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey,
        },
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.errors?.[0]?.message || "Failed to load your venues");

      setVenues(result.data || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not load venues";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [userName]);

  useEffect(() => {
    if (!loggedIn) {
      navigate("/login", { replace: true });
    } else if (!isManager) {
      navigate("/customer-dashboard", { replace: true });
    } else {
      fetchVenues();
    }
  }, [navigate, loggedIn, isManager, fetchVenues]);

  //Confirms venue delete
  async function handleDelete(venueId: string) {
    const confirmDelete = window.confirm("Are you sure you want to delete this venue?");
    if (!confirmDelete) return;

    try {
      const token = getToken();
      const apiKey = getApiKey();

      const res = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${venueId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey,
        },
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.errors?.[0]?.message || "Delete failed");
      }

      setVenues(prev => prev.filter(v => v.id !== venueId));
      toast.success("Venue successfully removed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error deleting venue");
    }
  }

  const handleCreateNew = () => { setEditingVenue(null); setShowCreateEdit(true); };
  const handleEdit = (venue: Venue) => { setEditingVenue(venue); setShowCreateEdit(true); };
  const closeForm = () => { setShowCreateEdit(false); setEditingVenue(null); };
  
  // Refreshes list and shows message after creating or editing
  const handleSuccess = () => {
    closeForm();
    fetchVenues();
    toast.success(editingVenue ? "Venue updated!" : "New venue created!");
  };

  if (!loggedIn || !isManager) return null;
  if (loading) return <Spinner />;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Venue Manager Dashboard</h1>
        <p>Welcome back, <strong>{userName}</strong></p>
      </header>
      <div className="dashboard-content">
        <section className="manager-venues">
          <div className="venues-header">
            <h3>Your Venues</h3>
            <button className="btn-create-venue" onClick={handleCreateNew}>
              <i className="bi bi-plus-circle"></i> Create New Venue
            </button>
          </div>
          {error && <p className="error-message" role="alert">{error}</p>}
          {!error && venues.length === 0 ? (
            <div className="empty-state">
              <p>You haven't created any venues yet.</p>
            </div>
          ) : (
            <div className="venues-grid">
              {venues.map((venue) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
        <UpcomingBookings isManager={true} />
      </div>
      {showCreateEdit && (
        <CreateEditVenue
          venue={editingVenue}
          onClose={closeForm}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
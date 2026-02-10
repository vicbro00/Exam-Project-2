import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn, isVenueManager, getToken, getApiKey } from '../../services/auth';
import UpcomingBookings from '../../components/dashboards/UpcomingBookings';
import VenueCard from '../../components/dashboards/VenueCard';
import CreateEditVenue from '../../components/dashboards/CreateEditVenue';
import './venue-manager-dashboard.css';

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
  const userName = localStorage.getItem('userName');
  
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

      if (!userName || !token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      const res = await fetch(
        `https://v2.api.noroff.dev/holidaze/profiles/${userName}/venues`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Noroff-API-Key': apiKey,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.errors?.[0]?.message || 'Failed to fetch venues');
      }

      const data = await res.json();
      setVenues(data.data);
    } catch (err) {
      console.error('Error fetching venues:', err);
      setError(err instanceof Error ? err.message : 'Could not load venues');
    } finally {
      setLoading(false);
    }
  }, [userName]);

  useEffect(() => {
    if (!loggedIn) {
      navigate('/login');
    } else if (!isManager) {
      navigate('/customer-dashboard');
    } else {
      fetchVenues();
    }
  }, [navigate, loggedIn, isManager, fetchVenues]);

  async function handleDelete(venueId: string) {
    if (!window.confirm('Are you sure you want to delete this venue?')) {
      return;
    }

    try {
      const token = getToken();
      const apiKey = getApiKey();

      const res = await fetch(
        `https://v2.api.noroff.dev/holidaze/venues/${venueId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Noroff-API-Key': apiKey,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.errors?.[0]?.message || 'Failed to delete venue');
      }

      // Remove venue from list
      setVenues(venues.filter(v => v.id !== venueId));
      alert('Venue deleted successfully!');
    } catch (err) {
      console.error('Error deleting venue:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete venue');
    }
  }

  function handleCreateNew() {
    setEditingVenue(null);
    setShowCreateEdit(true);
  }

  function handleEdit(venue: Venue) {
    setEditingVenue(venue);
    setShowCreateEdit(true);
  }

  function handleCloseModal() {
    setShowCreateEdit(false);
    setEditingVenue(null);
  }

  function handleSuccess() {
    // Refresh venues list
    fetchVenues();
  }

  if (!loggedIn || !isManager) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Venue Manager Dashboard</h1>
        <p>Welcome back, {userName || 'Manager'}!</p>
      </header>

      <div className="dashboard-content">
        {/* Venues Section */}
        <section className="manager-venues">
          <div className="venues-header">
            <h3>Your Venues</h3>
            <button className="btn-create-venue" onClick={handleCreateNew}>
              <i className="bi bi-plus-circle"></i> Create New Venue
            </button>
          </div>

          {loading && <p>Loading venues...</p>}
          {error && <p className="error">{error}</p>}

          {!loading && !error && venues.length === 0 && (
            <div className="no-venues">
              <p>You haven't created any venues yet.</p>
              <button className="btn-create-venue" onClick={handleCreateNew}>
                Create Your First Venue
              </button>
            </div>
          )}

          {!loading && !error && venues.length > 0 && (
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

        {/* Bookings Section */}
        <UpcomingBookings isManager={true} />
      </div>

      {/* Create/Edit Modal */}
      {showCreateEdit && (
        <CreateEditVenue
          venue={editingVenue}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
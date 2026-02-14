/**
 * Global API URL and API KEY fetching.
 * Note: In a production environment, the API_KEY should be stored in an .env file.
 */

export const API_BASE_URL = "https://v2.api.noroff.dev";
export const REGISTER_ENDPOINT = "/auth/register";
export const LOGIN_ENDPOINT = "/auth/login";
export const BOOKINGS_ENDPOINT = "/holidaze/bookings";

export const API_KEY = import.meta.env.VITE_API_KEY;

/**
 * A container for the API fetch logic.
 * * @param {string} endpoint - The API endpoint.
 * @param {RequestInit} [options={}] - Standard fetch options.
 * @returns {Promise<Response>} The fetch response.
 * * @example:
 * authFetch("/holidaze/venues", { method: "POST", body: JSON.stringify(data) }); 
 */
function authFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("accessToken");
  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };
  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });
}

export default authFetch;
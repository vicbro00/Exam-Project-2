export const API_BASE_URL = "https://v2.api.noroff.dev";

export const REGISTER_ENDPOINT = "/auth/register";
export const LOGIN_ENDPOINT = "/auth/login";
export const BOOKINGS_ENDPOINT = "/holidaze/bookings";

export const API_KEY = "b430fe28-0dc4-4858-82db-a67e6f526c48"

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
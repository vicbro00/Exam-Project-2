/**
 * Retrieves the Noroff API key from .env file.
 * @returns {string} The valid API key.
 * @throws {Error} If API key is missing in .env file.
 */
export function getApiKey(): string {
  const apiKey = import.meta.env.VITE_NOROFF_API_KEY;
  
  if (!apiKey) {
    throw new Error('VITE_NOROFF_API_KEY is not set in environment variables');
  }
  
  return apiKey;
}

/**
 * Checks if the currently logged-in user has the 'Venue Manager' role.
 * For protecting routes and showing manager-only elements.
 * @returns {boolean} True if the user is a manager and authenticated.
 */
function isVenueManager() {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return false;
  }
  return localStorage.getItem("venueManager") === "true";
}

/**
 * Determines if a user is currently authenticated based on the presence of an access token.
 * @returns {boolean} True if a token exists in local storage.
 */
function isLoggedIn() {
  const token = localStorage.getItem("accessToken");
  return !!token;
}

/**
 * Helper to fetch the JWT token for API requests.
 * @returns {string | null} The access token or null if not found.
 */
function getToken() {
  return localStorage.getItem("accessToken");
}

/**
 * Retrieves the current user's profile data from local storage.
 * If avatar is "undefined", it will be stored as null.
 * @returns {object | null} An object containing user details, stored as null if not found.
 */
function getUser() {
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");
  const avatar = localStorage.getItem("avatar");
  
  if (!userName) return null;
  
  return {
    name: userName,
    email: userEmail,
    avatar: avatar && avatar !== 'undefined' ? avatar : null,
  };
}

export { isVenueManager, isLoggedIn, getToken, getUser };
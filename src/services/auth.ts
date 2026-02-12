export function getApiKey(): string {
  const apiKey = import.meta.env.VITE_NOROFF_API_KEY;
  
  if (!apiKey) {
    throw new Error('VITE_NOROFF_API_KEY is not set in environment variables');
  }
  
  return apiKey;
}

function isVenueManager() {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return false;
  }
  return localStorage.getItem("venueManager") === "true";
}

function isLoggedIn() {
  const token = localStorage.getItem("accessToken");
  return !!token;
}

function getToken() {
  return localStorage.getItem("accessToken");
}

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
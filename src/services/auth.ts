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

export { isVenueManager, isLoggedIn };
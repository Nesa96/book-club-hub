const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

export const API_URL = isLocal 
    ? "http://localhost:8000" 
    : "https://book-club-uqix.onrender.com";
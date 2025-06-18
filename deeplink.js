
const fallbackUrl = "https://play.google.com/store/apps/details?id=com.kundlitalk"; 
const intentUrl = "intent://open#Intent;scheme=https;package=com.example.myapp;S.browser_fallback_url=" + encodeURIComponent(fallbackUrl) + ";end";

window.location.replace(intentUrl);

function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

const inAppUrl = getQueryParam("url") || "https://appkundli.innovatia.co.in/";

// ✅ Just redirect directly to the URL
// This lets the Android App Link system trigger the app and pass full URL to React Native
window.location.href = inAppUrl;


// function getQueryParam(name) {
//   const urlParams = new URLSearchParams(window.location.search);
//   return urlParams.get(name);
// }

// const inAppUrl = getQueryParam("url") || "https://appkundli.innovatia.co.in/";
// const fallbackUrl = "https://play.google.com/store/apps/details?id=com.kundlitalk";

// const intentUrl =
//   "intent://openapp.html?url=" + encodeURIComponent(inAppUrl) +
//   "#Intent;scheme=https;" +
//   "package=com.kundlitalk;" +
//   "S.browser_fallback_url=" + encodeURIComponent(fallbackUrl) + ";" +
//   "end";

// // window.location.replace(intentUrl);

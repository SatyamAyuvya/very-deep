function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  const inAppUrl = getQueryParam("url") || "https://appkundli.innovatia.co.in/";
  const playStoreUrl = "https://play.google.com/store/apps/details?id=com.kundlitalk"; // replace with your actual package

  // Start timer to fallback to Play Store
  const fallbackTimeout = setTimeout(() => {
    window.location.href = playStoreUrl;
  }, 200);

  // Try opening the app (deep link)
  window.location.href = inAppUrl;

  // Optional: Clear fallback if app opens (in some edge cases)
  window.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
      clearTimeout(fallbackTimeout);
    }
  });


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

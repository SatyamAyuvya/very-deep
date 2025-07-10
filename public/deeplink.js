(function () {
  const userAgent = navigator.userAgent || navigator.vendor;
  const fallbackDelay = 1500; // milliseconds
  const API_BASE_URL = "https://kundlitalk.innovatia.co.in/";
  const playStoreUrl = "https://play.google.com/store/apps/details?id=com.kundlitalk";
  const appStoreUrl = "https://apps.apple.com/app/idXXXXXXXX";

  const appDeepLink = window.location.href;
  const pathOnly = appDeepLink.replace(/^https?:\/\//, "");

  const intentLink =
    "intent://" + pathOnly +
    "#Intent;scheme=https;package=com.kundlitalk;" +
    "S.browser_fallback_url=" + encodeURIComponent(playStoreUrl) + ";end";

  const sendDeepLinkInfo = (deeplink_url) => {
    navigator.sendBeacon?.( // use sendBeacon if supported to not block redirect
      `${API_BASE_URL}api/user/get_deep_link_url/`,
      new Blob([JSON.stringify({ url: deeplink_url })], { type: "application/json" })
    );
    // For older browsers:
    fetch(`${API_BASE_URL}api/user/get_deep_link_url/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: deeplink_url }),
      keepalive: true,
    }).catch((e) => console.warn("API fallback error:", e));
  };

  const isAndroid = /android/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
  let didHide = false;

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      didHide = true;
    }
  });

  const fallback = () => {
    if (!didHide) {
      console.log("❌ App not opened, hitting API and redirecting to store");
      sendDeepLinkInfo(appDeepLink);
      window.location.href = isIOS ? appStoreUrl : playStoreUrl;
    } else {
      console.log("✅ App opened, skipping store & API call.");
    }
  };

  if (isAndroid) {
    setTimeout(fallback, fallbackDelay);
    // Delay launching intent to allow fallback timer setup
    setTimeout(() => {
      window.location.replace(intentLink);
    }, 500);
  } else if (isIOS) {
    const iosScheme = appDeepLink.replace(/^https?:\/\//, "kundlitalks://");
    setTimeout(fallback, fallbackDelay);
    setTimeout(() => {
      window.location.href = iosScheme;
    }, 500);
  } else {
    // Desktop (always hit API and redirect)
    sendDeepLinkInfo(appDeepLink);
    window.location.href = playStoreUrl;
  }
})();
(function () {
  const userAgent = navigator.userAgent || navigator.vendor;
  const fallbackDelay = 1500;
  const API_BASE_URL = "https://kundlitalk.innovatia.co.in/";
  const playStoreUrl = "https://play.google.com/store/apps/details?id=com.kundlitalk";
  const appStoreUrl = "https://apps.apple.com/app/idXXXXXXXX";

  const appDeepLink = window.location.href;
  const pathOnly = appDeepLink.replace(/^https?:\/\//, "");

  const intentLink = 
    "intent://" + pathOnly +
    "#Intent;scheme=https;package=com.kundlitalk;" +
    "S.browser_fallback_url=" + encodeURIComponent(playStoreUrl) +
    ";end";

  const sendDeepLinkInfo = (deeplink_url) => {
    fetch(`${API_BASE_URL}api/user/get_deep_link_url/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: deeplink_url }),
    })
    .then(res => res.json())
    .then(data => console.log("✅ API success:", data))
    .catch(error => console.error("❌ API error:", error));
  };

  const isAndroid = /android/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
  let didHide = false;

  // Detect if tab is hidden (indicates app opened)
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      didHide = true;
    }
  });

  const fallback = () => {
    if (!didHide) {
      console.log("❌ App not opened, calling API and redirecting to store");
      sendDeepLinkInfo(appDeepLink);
      window.location.href = isIOS ? appStoreUrl : playStoreUrl;
    } else {
      console.log("✅ App opened, no need to call API or redirect.");
    }
  };

  // Platform-specific logic
  if (isAndroid) {
    setTimeout(fallback, fallbackDelay);
    setTimeout(() => {
      window.location.href = intentLink;
    }, 100);
  } else if (isIOS) {
    const iosScheme = appDeepLink.replace(/^https?:\/\//, "kundlitalks://");
    setTimeout(fallback, fallbackDelay);
    setTimeout(() => {
      window.location.href = iosScheme;
    }, 100);
  } else {
    // Desktop fallback
    sendDeepLinkInfo(appDeepLink);
    window.location.href = playStoreUrl;
  }
})();
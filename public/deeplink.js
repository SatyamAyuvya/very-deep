(function () {
  const API_BASE_URL = "https://kundlitalk.innovatia.co.in/";
  const fallbackDelay = 1500;
  const playStoreUrl =
    "https://play.google.com/store/apps/details?id=com.kundlitalk";
  const appStoreUrl = "https://apps.apple.com/app/idXXXXXXXX";

  const userAgent = navigator.userAgent || navigator.vendor;
  const isAndroid = /android/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

  const appDeepLink = window.location.href;
  const pathOnly = appDeepLink.replace(/^https?:\/\//, "");

  const intentLink = `intent://${pathOnly}#Intent;scheme=https;package=com.kundlitalk;S.browser_fallback_url=${encodeURIComponent(
    playStoreUrl
  )};end`;
  const iosScheme = appDeepLink.replace(/^https?:\/\//, "kundlitalks://");

  const sendDeepLinkInfo = (deeplink_url) => {
    fetch(`${API_BASE_URL}api/user/get_deep_link_url/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: deeplink_url }),
      keepalive: true,
    })
      .then(() => console.log("✅ API called"))
      .catch((err) => console.error("❌ API error:", err));
  };

  const launchedAt = Date.now();

  const fallback = () => {
    const now = Date.now();
    const timeDiff = now - launchedAt;

    if (timeDiff < fallbackDelay + 100) {
      console.log("❌ App not opened → API + store redirect");
      sendDeepLinkInfo(appDeepLink);
      window.location.href = isIOS ? appStoreUrl : playStoreUrl;
    } else {
      console.log("✅ App opened → skipping API");
    }
  };

  if (isAndroid) {
    window.location.href = intentLink;
    setTimeout(fallback, fallbackDelay);
  } else if (isIOS) {
    window.location.href = iosScheme;
    setTimeout(fallback, fallbackDelay);
  } else {
    sendDeepLinkInfo(appDeepLink);
    window.location.href = playStoreUrl;
  }
})();

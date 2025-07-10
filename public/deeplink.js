(function () {
  const fallbackDelay = 1500;
  const API_BASE_URL = "https://kundlitalk.innovatia.co.in/";
  const playStoreUrl = "https://play.google.com/store/apps/details?id=com.kundlitalk";
  const appStoreUrl = "https://apps.apple.com/app/idXXXXXXXX";

  const userAgent = navigator.userAgent || navigator.vendor;
  const isAndroid = /android/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

  const appDeepLink = window.location.href;
  const pathOnly = appDeepLink.replace(/^https?:\/\//, "");

  const intentLink = `intent://${pathOnly}#Intent;scheme=https;package=com.kundlitalk;S.browser_fallback_url=${encodeURIComponent(playStoreUrl)};end`;
  const iosScheme = appDeepLink.replace(/^https?:\/\//, "kundlitalks://");

  const sendDeepLinkInfo = (deeplink_url) => {
    fetch(`${API_BASE_URL}api/user/get_deep_link_url/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: deeplink_url }),
      keepalive: true,
    }).then(() => console.log("✅ API called"))
      .catch(err => console.error("❌ API error:", err));
  };

  let didHide = false;
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      didHide = true;
    }
  });

  const fallback = () => {
    if (!didHide) {
      console.log("❌ App not opened → calling API + redirect to store");
      sendDeepLinkInfo(appDeepLink);
      window.location.href = isIOS ? appStoreUrl : playStoreUrl;
    } else {
      console.log("✅ App opened → skipping fallback");
    }
  };

  if (isAndroid) {
    setTimeout(fallback, fallbackDelay);
    setTimeout(() => {
      window.location.replace(intentLink);
    }, 300); // Give enough time for fallback to set
  } else if (isIOS) {
    setTimeout(fallback, fallbackDelay);
    setTimeout(() => {
      window.location.href = iosScheme;
    }, 300);
  } else {
    // Desktop: always call API + redirect
    sendDeepLinkInfo(appDeepLink);
    window.location.href = playStoreUrl;
  }
})();
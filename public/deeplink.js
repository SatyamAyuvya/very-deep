(function () {
  const userAgent = navigator.userAgent || navigator.vendor;
  const fallbackDelay = 1500;
  const API_BASE_URL = "https://kundlitalk.innovatia.co.in/";

  const playStoreUrl = "https://play.google.com/store/apps/details?id=com.kundlitalk";
  const appStoreUrl = "https://apps.apple.com/app/idXXXXXXXX";

  const appDeepLink = window.location.href;
  const pathOnly = appDeepLink.replace(/^https?:\/\//, "");

  const intentLink =
    "intent://" +
    pathOnly +
    "#Intent;scheme=https;package=com.kundlitalk;S.browser_fallback_url=" +
    encodeURIComponent(playStoreUrl) +
    ";end";

  const sendDeepLinkInfo = async (deeplink_url) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}api/user/get_deep_link_url/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: deeplink_url }),
        }
      );
      const data = await response.json();
      alert("✅ API called: " + JSON.stringify(data));
    } catch (error) {
      alert("❌ API error: " + error.message);
    }
  };

  const isAndroid = /android/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

  if (isAndroid) {
    const timer = setTimeout(() => {
      sendDeepLinkInfo(appDeepLink).finally(() => {
        window.location.href = playStoreUrl;
      });
    }, fallbackDelay);

    window.addEventListener("blur", () => clearTimeout(timer));

    setTimeout(() => {
      window.location.href = intentLink;
    }, 100);

  } else if (isIOS) {
    const iosScheme = appDeepLink.replace(/^https?:\/\//, "kundlitalks://");

    const timer = setTimeout(() => {
      sendDeepLinkInfo(appDeepLink).finally(() => {
        window.location.href = appStoreUrl;
      });
    }, fallbackDelay);

    window.addEventListener("blur", () => clearTimeout(timer));

    setTimeout(() => {
      window.location.href = iosScheme;
    }, 100);

  } else {
    window.location.href = playStoreUrl;
  }
})();

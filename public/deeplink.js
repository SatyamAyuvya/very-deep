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
      console.log("Deep link API response:", data);
      alert("✅ API called: " + JSON.stringify(data));
    } catch (error) {
      console.error("Error sending deep link data:", error);
      alert("❌ API error: " + error.message);
    }
  };

  const isAndroid = /android/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

  if (isAndroid) {
    window.location.href = intentLink;

    const timer = setTimeout(() => {
      sendDeepLinkInfo(appDeepLink).finally(() => {
        window.location.href = playStoreUrl;
      });
    }, fallbackDelay);

    window.addEventListener("blur", () => clearTimeout(timer));
  } else if (isIOS) {
    const iosScheme = appDeepLink.replace(/^https?:\/\//, "kundlitalks://");
    window.location.href = iosScheme;

    const timer = setTimeout(() => {
      sendDeepLinkInfo(appDeepLink).finally(() => {
        window.location.href = appStoreUrl;
      });
    }, fallbackDelay);

    window.addEventListener("blur", () => clearTimeout(timer));
  } else {
    window.location.href = playStoreUrl;
  }
})();

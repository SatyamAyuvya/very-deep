(function () {
  const userAgent = navigator.userAgent || navigator.vendor;
  const fallbackDelay = 1500;

  const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.kundlitalk';
  const appStoreUrl = 'https://apps.apple.com/app/idXXXXXXXX'; // 🔁 Replace with your iOS App ID

  // Get `?url=` from query params, fallback to homepage
  const urlParam = new URLSearchParams(window.location.search).get('url');
  const appDeepLink = urlParam || 'https://appkundli.innovatia.co.in/app/astro-profile/10';

  const pathOnly = appDeepLink.replace(/^https?:\/\//, '');

  const intentLink =
    'intent://' +
    pathOnly +
    '#Intent;scheme=https;package=com.kundlitalk;S.browser_fallback_url=' +
    encodeURIComponent(playStoreUrl) +
    ';end';

  if (/android/i.test(userAgent)) {
    // ✅ Android - open app or redirect to Play Store
    window.location.href = intentLink;
  } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
    // ✅ iOS - open app via scheme or fallback to App Store
    const iosScheme = appDeepLink.replace(/^https?:\/\//, 'kundlitalks://');

    window.location.href = iosScheme;

    setTimeout(() => {
      window.location.href = appStoreUrl;
    }, fallbackDelay);
  } else {
    // ✅ Desktop fallback
    window.location.href = playStoreUrl;
  }
})();

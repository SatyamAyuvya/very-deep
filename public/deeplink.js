(function () {
  const userAgent = navigator.userAgent || navigator.vendor;
  const fallbackDelay = 1500;

  const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.kundlitalk';
  const appStoreUrl = 'https://apps.apple.com/app/idXXXXXXXX';

  // ✅ This is the full clicked URL
  const appDeepLink = window.location.href;

  console.log('Deep link user clicked:', appDeepLink);

  const pathOnly = appDeepLink.replace(/^https?:\/\//, '');

  const intentLink =
    'intent://' +
    pathOnly +
    '#Intent;scheme=https;package=com.kundlitalk;S.browser_fallback_url=' +
    encodeURIComponent(playStoreUrl) +
    ';end';

  if (/android/i.test(userAgent)) {
    window.location.href = intentLink;
  } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
    const iosScheme = appDeepLink.replace(/^https?:\/\//, 'kundlitalks://');
    window.location.href = iosScheme;

    setTimeout(() => {
      window.location.href = appStoreUrl;
    }, fallbackDelay);
  } else {
    window.location.href = playStoreUrl;
  }
})();

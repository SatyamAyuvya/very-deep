(function () { 
  const fallbackDelay = 1500; 
  
  const playStoreUrl = "https://play.google.com/store/apps/details?id=com.kundlitalk"; 
  const appStoreUrl = "https://apps.apple.com/app/idXXXXXXXX"; 
 
  const userAgent = navigator.userAgent || navigator.vendor; 
  const isAndroid = /android/i.test(userAgent); 
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent); 
 
  const appDeepLink = window.location.href; 
  const pathOnly = appDeepLink.replace(/^https?:\/\//, ""); 
 
  const intentLink = `intent://${pathOnly}#Intent;scheme=https;package=com.kundlitalk;S.browser_fallback_url=${encodeURIComponent(playStoreUrl)};end`; 
  const iosScheme = appDeepLink.replace(/^https?:\/\//, "kundlitalks://"); 

  const API_BASE_URL = "https://kundlitalk.innovatia.co.in/"; 
 
  const sendDeepLinkInfo = (deeplink_url) => { 
    try { 
      fetch(`${API_BASE_URL}api/user/get_deep_link_url/`, { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ url: deeplink_url }), 
        keepalive: true, 
      }).then(() => console.log("✅ API called")) 
        .catch(err => console.error("❌ API error:", err)); 
    } catch (e) { 
      console.warn("Fetch error:", e); 
    } 
  }; 
 
  let appOpened = false;
  let fallbackTimer = null;
 
  const markAppOpened = () => { 
    if (!appOpened) {
      appOpened = true;
      console.log("✅ App opened - canceling fallback");
      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
        fallbackTimer = null;
      }
    }
  }; 
  
  document.addEventListener("visibilitychange", () => { 
    if (document.visibilityState === "hidden") markAppOpened(); 
  }); 
  window.addEventListener("pagehide", markAppOpened); 
  window.addEventListener("blur", markAppOpened); 
  
  window.addEventListener("beforeunload", markAppOpened);
 
  const fallback = () => { 
    if (!appOpened) { 
      console.log("❌ App not opened → API + redirect to store"); 
      sendDeepLinkInfo(appDeepLink); 
      window.location.href = isIOS ? appStoreUrl : playStoreUrl; 
    } else { 
      console.log("✅ App opened → skipping API call and store redirect"); 
    } 
  }; 
 
  if (isAndroid) { 
    fallbackTimer = setTimeout(fallback, fallbackDelay);
    window.location.replace(intentLink);
  } else if (isIOS) { 
    fallbackTimer = setTimeout(fallback, fallbackDelay);
    window.location.href = iosScheme;
  } else { 
    sendDeepLinkInfo(appDeepLink); 
    window.location.href = playStoreUrl; 
  } 
})();
import { useCallback, useEffect, useRef, useState } from "react";

export function useConnectivity() {
  const [internetAvailable, setInternetAvailable] = useState(() =>
    navigator.onLine ? null : false,
  );
  const [isCheckingInternet, setIsCheckingInternet] = useState(false);
  const activeCheck = useRef(null);
  const [hasServiceWorkerController, setHasServiceWorkerController] = useState(
    () => Boolean(navigator.serviceWorker?.controller),
  );

  const checkInternet = useCallback(async () => {
    if (!navigator.onLine) {
      activeCheck.current?.abort();
      activeCheck.current = null;
      setInternetAvailable(false);
      setIsCheckingInternet(false);
      return false;
    }

    activeCheck.current?.abort();
    setIsCheckingInternet(true);
    const controller = new AbortController();
    activeCheck.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(
        `${window.location.origin}/?connectivity-check=${Date.now()}`,
        {
          method: "HEAD",
          cache: "no-store",
          credentials: "omit",
          signal: controller.signal,
        },
      );
      const isAvailable = response.status < 500;
      if (activeCheck.current === controller) {
        setInternetAvailable(isAvailable);
      }
      return isAvailable;
    } catch {
      if (activeCheck.current === controller) {
        setInternetAvailable(false);
      }
      return false;
    } finally {
      window.clearTimeout(timeout);
      if (activeCheck.current === controller) {
        activeCheck.current = null;
        setIsCheckingInternet(false);
      }
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      void checkInternet();
    };
    const handleOffline = () => {
      activeCheck.current?.abort();
      activeCheck.current = null;
      setInternetAvailable(false);
      setIsCheckingInternet(false);
    };
    const handleControllerChange = () => {
      setHasServiceWorkerController(
        Boolean(navigator.serviceWorker?.controller),
      );
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void checkInternet();
      }
    };

    const initialCheck = window.setTimeout(() => {
      void checkInternet();
    }, 0);
    const connectivityInterval = window.setInterval(() => {
      void checkInternet();
    }, 30000);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    navigator.serviceWorker?.addEventListener(
      "controllerchange",
      handleControllerChange,
    );

    return () => {
      window.clearTimeout(initialCheck);
      window.clearInterval(connectivityInterval);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      navigator.serviceWorker?.removeEventListener(
        "controllerchange",
        handleControllerChange,
      );
    };
  }, [checkInternet]);

  return {
    internetAvailable,
    isCheckingInternet,
    hasServiceWorkerController,
    checkInternet,
  };
}

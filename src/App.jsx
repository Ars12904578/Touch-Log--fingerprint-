import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useConnectivity } from "./hooks/useConnectivity";
import OfflineAttendance from "./components/OfflineAttendance";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

function AppUpdateNotice() {
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const showUpdatingNotice = () => setIsUpdating(true);
    window.addEventListener("touch-log:pwa-updating", showUpdatingNotice);
    return () =>
      window.removeEventListener("touch-log:pwa-updating", showUpdatingNotice);
  }, []);

  if (!isUpdating) return null;

  return (
    <div
      role="status"
      className="fixed left-1/2 top-4 z-200 -translate-x-1/2 rounded-full bg-slate-950/90 px-4 py-2 text-sm text-white shadow-lg"
    >
      Updating application...
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="absolute inset-0"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const {
    internetAvailable,
    isCheckingInternet,
    hasServiceWorkerController,
    checkInternet,
  } = useConnectivity();
  const isOffline = internetAvailable === false;
  const appAssetsAvailable = !isOffline || hasServiceWorkerController;

  return (
    <div>
      {internetAvailable === true && (
        <div className="fixed inset-0 h-dvh w-full object-cover">
          <motion.img
            src="/bg.png"
            alt="Background"
            className="h-full w-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: backgroundLoaded ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onLoad={() => setBackgroundLoaded(true)}
          />
        </div>
      )}
      <div className="fixed inset-0 bg-black/10">
        {isOffline ? (
          <OfflineAttendance
            internetAvailable={internetAvailable}
            isCheckingInternet={isCheckingInternet}
            appAssetsAvailable={appAssetsAvailable}
            onRetry={checkInternet}
          />
        ) : (
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        )}
      </div>
      <AppUpdateNotice />
    </div>
  );
}

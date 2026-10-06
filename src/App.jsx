import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import OfflineAttendance from "./components/OfflineAttendance";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { WifiOff } from "lucide-react";

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
          <Route path="/offline" element={<OfflineAttendance />}></Route>
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function ManualOfflineNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPrompt, setShowPrompt] = useState(false);

  if (location.pathname === "/offline") {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowPrompt(true)}
        className="fixed bottom-5 right-5 z-100 rounded-full border border-white/20 bg-slate-950/90 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800"
      >
        <WifiOff className="h-5 w-5" />
      </button>
      {showPrompt && (
        <div
          className="fixed inset-0 z-200 flex items-center justify-center bg-black/70 p-5"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowPrompt(false);
            }
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="offline-page-prompt-title"
            className="w-full max-w-md rounded-3xl border border-white/15 bg-slate-950 p-6 text-white shadow-2xl"
          >
            <h2 id="offline-page-prompt-title" className="text-xl font-bold">
              Do you want to use the Offline Attendance Page?
            </h2>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowPrompt(false)}
                className="min-h-11 rounded-full border border-white/25 px-5 font-semibold text-white transition hover:bg-white/10"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPrompt(false);
                  navigate("/offline");
                }}
                className="min-h-11 rounded-full bg-white px-5 font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Go to Offline Page
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default function App() {
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);

  return (
    <div>
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
      <div className="fixed inset-0 bg-black/10">
        <BrowserRouter>
          <ManualOfflineNavigation />
          <AnimatedRoutes />
        </BrowserRouter>
      </div>
    </div>
  );
}

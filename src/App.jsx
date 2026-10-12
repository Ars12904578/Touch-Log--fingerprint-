import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import OfflineAttendance from "./components/OfflineAttendance";
import PwaRegistration from "./components/PwaRegistration";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { ArrowLeft, Cpu, LoaderCircle } from "lucide-react";

function AnimatedRoutes() {
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  const isLowEndDevice =
    typeof navigator !== "undefined" &&
    typeof navigator.hardwareConcurrency === "number" &&
    navigator.hardwareConcurrency <= 4;
  const shouldReduceMotion = reducedMotion || isLowEndDevice;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
        transition={{ duration: shouldReduceMotion ? 0.1 : 0.18, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/offline" element={<OfflineAttendance />}></Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-dvh items-center justify-center px-5 py-10 text-white">
      <section className="w-full max-w-lg rounded-4xl border border-white/20 bg-slate-950/75 p-8 text-center shadow-2xl shadow-slate-950/30 backdrop-blur-sm sm:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-200">
          Touch Log
        </p>
        <h1 className="mt-4 text-7xl font-black tracking-tight text-white sm:text-8xl">
          404
        </h1>
        <h2 className="mt-3 text-2xl font-bold">Page not found</h2>
        <p className="mx-auto mt-3 max-w-sm text-slate-300">
          Looks like this page isn&apos;t part of the attendance record.
        </p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 font-semibold text-slate-950 transition hover:bg-cyan-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Back to Home
        </button>
      </section>
    </main>
  );
}

function ManualOfflineNavigation({ offlineStatus }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPrompt, setShowPrompt] = useState(false);

  if (location.pathname === "/") {
    const isDownloading = offlineStatus === "loading";
    const offlineStatusLabel =
      offlineStatus === "error"
        ? "Offline resources failed to download"
        : isDownloading
          ? "Downloading offline resources"
          : "Open Offline Attendance Page";

    return (
      <>
        <button
          type="button"
          onClick={() => setShowPrompt(true)}
          aria-label={offlineStatusLabel}
          title={offlineStatusLabel}
          className="fixed bottom-5 right-5 z-100 rounded-full border border-white/20 bg-slate-950/90 p-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800"
        >
          {isDownloading ? (
            <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin" />
          ) : (
            <Cpu aria-hidden="true" className="h-5 w-5" />
          )}
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
  } else {
    return null;
  }
}

export default function App() {
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [offlineStatus, setOfflineStatus] = useState("ready");

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
          <PwaRegistration onStatusChange={setOfflineStatus} />
          <ManualOfflineNavigation offlineStatus={offlineStatus} />
          <AnimatedRoutes />
        </BrowserRouter>
      </div>
    </div>
  );
}

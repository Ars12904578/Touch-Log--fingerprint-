import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import FadeImage from "./components/FadeImage";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { ArrowLeft } from "lucide-react";

function AnimatedRoutes() {
  const location = useLocation();
  const reducedMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: reducedMotion ? 0 : 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reducedMotion ? 0 : -2 }}
        transition={{ duration: reducedMotion ? 0.08 : 0.14, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
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

export default function App() {
  return (
    <div>
      <div className="fixed inset-0 h-dvh w-full object-cover">
        <FadeImage
          src="/bg.png"
          alt="Background"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="fixed inset-0">
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </div>
    </div>
  );
}

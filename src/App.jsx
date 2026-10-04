import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

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
  return (
    <div>
      <div className="fixed inset-0 w-full h-dvh object-cover">
        <img src="/bg2.png" alt="Background" className="w-full h-full object-cover" />
      </div>
      <div className="fixed inset-0 bg-black/25">
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </div>
    </div>
  );
}

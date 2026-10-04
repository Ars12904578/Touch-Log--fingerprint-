import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
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
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);

  return (
    <div>
      <div className="fixed inset-0 w-full h-dvh object-cover">
        <motion.img
          src="/bg.png"
          alt="Background"
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: backgroundLoaded ? 1 : 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          onLoad={() => setBackgroundLoaded(true)}
        />
      </div>
      <div className="fixed inset-0 bg-black/10">
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </div>
    </div>
  );
}

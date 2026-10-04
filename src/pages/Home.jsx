"use client";

import { motion, AnimatePresence } from "motion/react";
import LoginPage from "../components/LoginContainer";
import { onAuthStateChanged } from "firebase/auth";
import { auth, signOutUser } from "../firebase";
import { Avatar, Badge } from "@heroui/react";

import {
  ArrowUpRight,
  BadgeCheck,
  ShieldCheck,
  ClipboardCheck,
  LogOut,
  ChevronRight,
  FingerprintPattern,
  Fingerprint,
  Clock,
  Zap
} from "lucide-react";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const trustBadges = [
  { icon: Fingerprint, label: "Secure fingerprint", angle: 0 },
  { icon: ShieldCheck, label: "Protected records", angle: 30 },
  { icon: BadgeCheck, label: "Verified identity", angle: 150 },
  { icon: ClipboardCheck, label: "Accurate attendance", angle: 180 },
  { icon: Clock, label: "Real-time tracking", angle: 210 },
  { icon: Zap, label: "Fast check-in", angle: 330 },
];

const heroVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const orbitRingVariants = {
  hidden: { opacity: 0, scale: 0.6 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { delay: 1.2, type: "spring", stiffness: 120, damping: 18 },
  },
};

const orbitBadgeVariants = {
  hidden: ({ angle }) => ({ rotate: angle - 60, opacity: 0 }),
  show: ({ angle, index }) => ({
    rotate: angle,
    opacity: 1,
    transition: {
      delay: 1.2 + index * 0.12,
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const counterRotateVariants = {
  hidden: ({ angle }) => ({ rotate: 60 - angle }),
  show: ({ angle, index }) => ({
    rotate: -angle,
    transition: {
      delay: 1.2 + index * 0.12,
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const getStartedVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 1,
      duration: 0.6,
      scale: { type: "spring", stiffness: 400, damping: 15 },
    },
  },
};

export default function Home() {
  const [isLoggingIn, setLoggingIn] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userIn, setUser] = useState(null);
  const navigate = useNavigate();
  const layoutKey = `${isLoggedIn}:${userIn?.displayName ?? ""}`;

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setLoggedIn(Boolean(user));
      setUser(user);
    });
  }, []);

  return (
    <div>
      <motion.div
        variants={heroVariants}
        initial="hidden"
        animate="show"
        className="scale-90 md:scale-80 fixed inset-x-0 top-0 bottom-4/11 md:bottom-40 p-5 flex flex-col items-center justify-center gap-5"
      >
        <motion.div
          variants={fadeUpVariants}
          className="text-sm sm:text-lg py-2 px-3 pr-5 bg-emerald-800/80 rounded-full text-white flex items-center justify-center gap-1.5"
        >
          <FingerprintPattern /> Fingerprint based attendance system
        </motion.div>

        <motion.h1
          variants={fadeUpVariants}
          className="flex flex-col gap-3 font-extrabold text-6xl text-left md:text-7xl lg:text-8xl sm:text-center text-white text-shadow-[0_0px_80px_rgba(0,0,0,0.5)]"
        >
          <span>Track every touch</span>
          <span className="text-blue-950 text-shadow-[0_0px_50px_rgba(255,255,255,1)]">
            with Touch Log.
          </span>
        </motion.h1>

        <motion.div
          variants={fadeUpVariants}
          className="text-lg md:text-2xl text-left backdrop-blur-sm font-bold text-white bg-slate-950/80 py-2 px-5 sm:text-center rounded-2xl"
        >
          A modern, secure attendance tracking system.
        </motion.div>
      </motion.div>

      {/* Floaters */}
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="relative h-0 w-0">
          {/* Orbit ring */}
          <motion.div
            variants={orbitRingVariants}
            initial="hidden"
            animate="show"
            style={{
              x: "-50%",
              y: "-50%",
            }}
            className="absolute w-130 h-130 md:w-200 md:h-200 lg:w-250 lg:h-250 left-0 top-100 md:top-0 rounded-full border-dashed border-white/25 border-3 pointer-events-none"
          />

          {/* Orbiting badges */}
          {trustBadges.map(({ icon: Icon, label, angle }, i) => (
            <motion.div
              key={label}
              custom={{ angle, index: i }}
              variants={orbitBadgeVariants}
              initial="hidden"
              animate="show"
              className="absolute left-0 top-35 sm:top-25 md:top-0"
              style={{ transformOrigin: "0 0" }}
            >
              <div className="scale-80 translate-x-15 sm:scale-100 sm:translate-x-25 md:scale-80 md:translate-x-100 lg:scale-100 lg:translate-x-120">
                {/* counter-rotation + centering */}
                <motion.div
                  custom={{ angle, index: i }}
                  variants={counterRotateVariants}
                  initial="hidden"
                  animate="show"
                  style={{ x: "-50%", y: "-50%" }}
                  className="flex items-center gap-2 py-2 px-4 bg-slate-950/30 backdrop-blur-sm rounded-full text-sm text-white/80 border border-white/50 shadow-lg w-max"
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Get Started button */}
        <motion.div
          layout
          layoutDependency={layoutKey}
          transition={{
            layout: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-x-0 bottom-0 flex flex-col gap-5 items-center justify-center pb-10"
        >
          <motion.button
            layout
            layoutDependency={layoutKey}
            transition={{
              layout: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
            }}
            onClick={() =>
              isLoggedIn ? navigate("/dashboard") : setLoggingIn(true)
            }
            className={`shadow-xl cursor-pointer relative text-xl w-fit max-w-60 sm:max-w-100 bg-white backdrop-blur-md rounded-full text-black flex items-center justify-center ${
              isLoggedIn ? "py-3 px-3" : "py-3 px-5"
            }`}
            variants={getStartedVariants}
            initial="hidden"
            animate="show"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isLoggedIn ? (
                <motion.span
                  key="account"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="inline-flex min-w-0 max-w-full items-center justify-center gap-3"
                >
                  <Badge.Anchor>
                    <Avatar className="shadow-xs shadow-black bg-black">
                      <Avatar.Fallback className="bg-slate-900 text-white">
                        {userIn?.displayName
                          ?.trim()
                          .slice(0, 2)
                          .toUpperCase() || "TE"}
                      </Avatar.Fallback>
                    </Avatar>
                    <Badge color="success" placement="bottom-right" size="sm" />
                  </Badge.Anchor>
                  <span className="min-w-0 flex-1 truncate">
                    {userIn.displayName}
                  </span>
                  <ChevronRight className="truncate"></ChevronRight>
                </motion.span>
              ) : (
                <motion.span
                  key="get-started"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="inline-flex items-center justify-center gap-3"
                >
                  Get Started <ArrowUpRight />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          <AnimatePresence initial={false}>
            {isLoggedIn && (
              <motion.button
                key="logout"
                layout
                layoutDependency={layoutKey}
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{
                  duration: 0.22,
                  ease: "easeOut",
                  layout: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                }}
                onClick={() => signOutUser()}
                className="shadow-xl cursor-pointer py-2 px-5 relative text-base w-fit max-w-60 sm:max-w-100 bg-red-500 text-white backdrop-blur-md rounded-full flex items-center justify-center gap-1"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
              >
                <LogOut className="h-5"></LogOut> Log Out
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Login Popup */}
      <AnimatePresence>
        <LoginPage
          setLoggingIn={setLoggingIn}
          isLoggingIn={isLoggingIn}
        ></LoginPage>
      </AnimatePresence>
    </div>
  );
}

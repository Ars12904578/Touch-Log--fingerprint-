"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Avatar, Badge } from "@heroui/react";
import {
  BadgeCheck,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Fingerprint,
  ListChecks,
  LogOut,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, signOutUser } from "../firebase";
import LoginPage from "../components/LoginContainer";

const trustBadges = [
  { icon: Fingerprint, label: "Secure fingerprint", angle: 0 },
  { icon: ShieldCheck, label: "Protected records", angle: 30 },
  { icon: BadgeCheck, label: "Verified identity", angle: 150 },
  { icon: ClipboardCheck, label: "Accurate attendance", angle: 180 },
  { icon: Clock, label: "Real-time tracking", angle: 210 },
  { icon: Zap, label: "Fast check-in", angle: 330 },
];

const orbitBadgeVariants = {
  hidden: ({ angle }) => ({ rotate: angle - 60, opacity: 0 }),
  show: ({ angle, index }) => ({
    rotate: angle,
    opacity: 1,
    transition: {
      delay: index * 0.12,
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
      delay: index * 0.12,
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function getInitials(name) {
  return name?.trim().slice(0, 2).toUpperCase() || "TL";
}

export default function Home({ offlineStatus }) {
  const navigate = useNavigate();
  const [isLoggingIn, setLoggingIn] = useState(false);
  const [user, setUser] = useState(null);
  const isLoggedIn = Boolean(user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  return (
    <div>
      <img
        src="/container.png"
        alt="Block"
        className="fixed -bottom-35 left-1/2 w-100 -translate-x-1/2 rotate-[15deg]"
      />
      
      <HeroHeader offlineStatus={offlineStatus} />

      <div className="fixed inset-0 flex items-center justify-center">
        <div className="relative h-0 w-0">
          <div
            className="absolute left-0 top-100 h-130 w-130 -translate-x-1/2 -translate-y-1/2 rounded-full border-3 border-dashed border-white/25 md:top-0 md:h-200 md:w-200 lg:h-250 lg:w-250"
          />

          {trustBadges.map(({ icon: Icon, label, angle }, index) => (
            <motion.div
              key={label}
              custom={{ angle, index }}
              variants={orbitBadgeVariants}
              initial="hidden"
              animate="show"
              className="absolute left-0 top-35 md:top-0"
              style={{ transformOrigin: "0 0" }}
            >
              <div className="translate-x-15 scale-80 sm:translate-x-15 md:translate-x-100 lg:translate-x-120 lg:scale-100">
                <motion.div
                  custom={{ angle, index }}
                  variants={counterRotateVariants}
                  initial="hidden"
                  animate="show"
                  style={{ x: "-50%", y: "-50%" }}
                  className="flex w-max items-center gap-2 rounded-full border border-white/50 bg-slate-950/30 px-4 py-2 text-sm text-white/80 shadow-lg backdrop-blur-xs"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        <GetStartedButton
          navigate={navigate}
          isLoggedIn={isLoggedIn}
          user={user}
          setLoggingIn={setLoggingIn}
        />
      </div>

      <AnimatePresence>
        {isLoggingIn && <LoginPage setLoggingIn={setLoggingIn} />}
      </AnimatePresence>
    </div>
  );
}

function HeroHeader({ offlineStatus }) {
  const offlineStatusLabels = {
    checking: "Downloading resources...",
    ready: "Offline available",
    unavailable: "Offline unavailable",
    error: "Offline unavailable",
  };
  const isOfflineReady = offlineStatus === "ready";
  const isCheckingOffline = offlineStatus === "checking";

  return (
    <div
      className="fixed inset-x-0 top-0 bottom-2/5 flex scale-90 md:scale-75 flex-col items-center justify-center gap-2 p-5 sm:bottom-40"
    >
      <div
        className="flex w-fit min-w-60 max-w-[calc(100vw-2.5rem)] flex-col gap-2 rounded-2xl bg-emerald-800/80 px-4 py-3 text-sm text-white sm:text-base"
      >
        <div className="flex items-center justify-center gap-2">
          <ListChecks aria-hidden="true" className="h-5 w-5 shrink-0" />
          <span
            role="status"
            aria-live="polite"
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold sm:text-sm ${
              isOfflineReady
                ? "border-emerald-200/30 bg-emerald-950/40 text-emerald-100"
                : isCheckingOffline
                  ? "border-sky-200/30 bg-sky-950/40 text-sky-100"
                  : "border-amber-200/30 bg-amber-950/40 text-amber-100"
            }`}
          >
            <span
              aria-hidden="true"
              className={`h-2 w-2 rounded-full ${
                isOfflineReady
                  ? "bg-emerald-300"
                  : isCheckingOffline
                    ? "animate-pulse bg-sky-300"
                    : "bg-amber-300"
              }`}
            />
            {offlineStatusLabels[offlineStatus]}
          </span>
        </div>

        {isCheckingOffline && (
          <div
            role="progressbar"
            aria-label="Downloading offline resources"
            aria-valuetext="Download in progress"
            className="h-1.5 w-full overflow-hidden rounded-full bg-sky-950/60"
          >
            <div className="offline-resource-progress h-full w-2/5 rounded-full bg-sky-200 shadow-[0_0_10px_rgba(186,230,253,0.7)]" />
          </div>
        )}
      </div>

      <h1
        className="mb-5 flex flex-col gap-3 text-left text-6xl font-extrabold tracking-tighter text-white text-shadow-[0_0px_80px_rgba(0,0,0,0.5)] sm:text-center md:text-7xl lg:text-8xl"
      >
        <span>Track every touch</span>
        <span className="text-blue-950 text-shadow-[0_0px_50px_rgba(255,255,255,1)]">
          with Touch Log
        </span>
      </h1>

      <div
        className="rounded-2xl bg-slate-950/50 px-5 py-2 text-left text-lg font-bold text-white backdrop-blur-xs md:text-2xl sm:text-center"
      >
        A Group 4 Project <br /> Built by Arvi Jay Tungpalan
      </div>
    </div>
  );
}

function GetStartedButton({ navigate, isLoggedIn, user, setLoggingIn }) {
  const displayName = user?.displayName || "Touch Log User";

  return (
    <div
      className="fixed inset-x-0 bottom-0 flex flex-col items-center justify-center gap-2 pb-5 md:pb-10"
    >
      <button
        type="button"
        onClick={() => (isLoggedIn ? navigate("/dashboard") : setLoggingIn(true))}
        className="relative flex w-fit max-w-60 items-center justify-center rounded-full bg-white px-3 py-3 text-xl text-black drop-shadow-[0_0px_30px_#0f85ff] backdrop-blur-xs transition-transform hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 sm:max-w-100"
      >
        {isLoggedIn ? (
          <span className="inline-flex min-w-0 max-w-full items-center justify-center gap-3">
              <Badge.Anchor>
                <Avatar className="bg-black shadow-xs shadow-black">
                  <Avatar.Fallback className="bg-slate-900 text-white">
                    {getInitials(displayName)}
                  </Avatar.Fallback>
                </Avatar>
                <Badge color="success" placement="bottom-right" size="sm" />
              </Badge.Anchor>
              <span className="min-w-0 flex-1 truncate">{displayName}</span>
              <ChevronRight className="truncate" />
          </span>
        ) : (
          <span className="aspect-square w-20">
            <Fingerprint className="h-full w-full text-slate-900" />
          </span>
        )}
      </button>

      {isLoggedIn && (
          <button
            type="button"
            onClick={() => signOutUser()}
            className="relative flex w-fit max-w-60 items-center justify-center gap-1 rounded-full bg-red-500 px-5 py-2 text-base text-white shadow-xl backdrop-blur-xs transition-transform hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 sm:max-w-100"
          >
            <LogOut className="h-5" />
            Log Out
          </button>
      )}
    </div>
  );
}

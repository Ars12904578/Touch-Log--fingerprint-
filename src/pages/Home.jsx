"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
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

function getInitials(name) {
  return name?.trim().slice(0, 2).toUpperCase() || "TL";
}

function useLightMotion() {
  const reducedMotion = useReducedMotion();
  const isLowEndDevice =
    typeof navigator !== "undefined" &&
    typeof navigator.hardwareConcurrency === "number" &&
    navigator.hardwareConcurrency <= 4;

  return reducedMotion || isLowEndDevice;
}

export default function Home() {
  const navigate = useNavigate();
  const [isLoggingIn, setLoggingIn] = useState(false);
  const [user, setUser] = useState(null);
  const shouldReduceMotion = useLightMotion();
  const isLoggedIn = Boolean(user);
  const layoutKey = `${isLoggedIn}:${user?.displayName ?? ""}`;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  return (
    <div>
      <motion.img
        src="/container.png"
        alt="Block"
        initial={
          shouldReduceMotion
            ? { opacity: 0 }
            : { opacity: 0, y: 50, rotate: 10 }
        }
        animate={
          shouldReduceMotion
            ? { opacity: 1 }
            : { opacity: 1, y: 0, rotate: 15 }
        }
        transition={{ duration: shouldReduceMotion ? 0.12 : 0.7 }}
        className="fixed -bottom-35 left-1/2 w-100 -translate-x-1/2"
      />
      
      <HeroHeader />

      <div className="fixed inset-0 flex items-center justify-center">
        <div className="relative h-0 w-0">
          <motion.div
            variants={orbitRingVariants}
            initial="hidden"
            animate="show"
            style={{ x: "-50%", y: "-50%" }}
            className="absolute left-0 top-100 h-130 w-130 rounded-full border-3 border-dashed border-white/25 md:top-0 md:h-200 md:w-200 lg:h-250 lg:w-250"
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
          layoutKey={layoutKey}
          navigate={navigate}
          isLoggedIn={isLoggedIn}
          user={user}
          setLoggingIn={setLoggingIn}
        />
      </div>

      <AnimatePresence>
        <LoginPage setLoggingIn={setLoggingIn} isLoggingIn={isLoggingIn} />
      </AnimatePresence>
    </div>
  );
}

function HeroHeader() {
  const shouldReduceMotion = useLightMotion();

  return (
    <motion.div
      variants={
        shouldReduceMotion
          ? { hidden: {}, show: { transition: { duration: 0.08 } } }
          : heroVariants
      }
      initial="hidden"
      animate="show"
      className="fixed inset-x-0 top-0 bottom-2/5 flex scale-90 md:scale-75 flex-col items-center justify-center gap-2 p-5 sm:bottom-40"
    >
      <motion.div
        variants={
          shouldReduceMotion
            ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.08 } } }
            : fadeUpVariants
        }
        className="flex items-center justify-center gap-1.5 rounded-full bg-emerald-800/80 px-3 py-2 pr-4 text-sm text-white sm:text-lg"
      >
        <ListChecks />
        Fingerprint-Based Attendance System
      </motion.div>

      <motion.h1
        variants={
          shouldReduceMotion
            ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.08 } } }
            : fadeUpVariants
        }
        className="mb-5 flex flex-col gap-3 text-left text-6xl font-extrabold tracking-tighter text-white text-shadow-[0_0px_80px_rgba(0,0,0,0.5)] sm:text-center md:text-7xl lg:text-8xl"
      >
        <span>Track every touch</span>
        <span className="text-blue-950 text-shadow-[0_0px_50px_rgba(255,255,255,1)]">
          with Touch Log
        </span>
      </motion.h1>

      <motion.div
        variants={
          shouldReduceMotion
            ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.08 } } }
            : fadeUpVariants
        }
        className="rounded-2xl bg-slate-950/50 px-5 py-2 text-left text-lg font-bold text-white backdrop-blur-xs md:text-2xl sm:text-center"
      >
        A Group 4 Project <br /> Built by Arvi Jay Tungpalan
      </motion.div>
    </motion.div>
  );
}

function GetStartedButton({ layoutKey, navigate, isLoggedIn, user, setLoggingIn }) {
  const displayName = user?.displayName || "Touch Log User";
  const shouldReduceMotion = useLightMotion();

  return (
    <motion.div
      layout
      layoutDependency={layoutKey}
      transition={{
        layout: {
          duration: shouldReduceMotion ? 0.08 : 0.35,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      className="fixed inset-x-0 bottom-0 flex flex-col items-center justify-center gap-2 pb-5 md:pb-10"
    >
      <motion.button
        layout
        layoutDependency={layoutKey}
        transition={{
          layout: {
            duration: shouldReduceMotion ? 0.08 : 0.35,
            ease: [0.22, 1, 0.36, 1],
          },
        }}
        onClick={() => (isLoggedIn ? navigate("/dashboard") : setLoggingIn(true))}
        className="relative flex w-fit max-w-60 items-center justify-center rounded-full bg-white px-3 py-3 text-xl text-black drop-shadow-[0_0px_30px_#0f85ff] backdrop-blur-xs sm:max-w-100"
        variants={
          shouldReduceMotion
            ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.08 } } }
            : getStartedVariants
        }
        initial="hidden"
        animate="show"
        whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isLoggedIn ? (
            <motion.span
              key="account"
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: shouldReduceMotion ? 0.08 : 0.18 }}
              className="inline-flex min-w-0 max-w-full items-center justify-center gap-3"
            >
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
            </motion.span>
          ) : (
            <motion.span
              key="get-started"
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: shouldReduceMotion ? 0.08 : 0.18 }}
              className="aspect-square w-20 cursor-pointer"
            >
              <Fingerprint className="h-full w-full text-slate-900" />
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
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.96 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
            transition={{
              duration: shouldReduceMotion ? 0.08 : 0.22,
              ease: "easeOut",
              layout: {
                duration: shouldReduceMotion ? 0.08 : 0.35,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
            onClick={() => signOutUser()}
            className="relative flex w-fit max-w-60 items-center justify-center gap-1 rounded-full bg-red-500 px-5 py-2 text-base text-white shadow-xl backdrop-blur-xs sm:max-w-100"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
          >
            <LogOut className="h-5" />
            Log Out
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

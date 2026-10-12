import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import {
  LoaderCircle,
  RefreshCw,
  ServerOff,
  WifiOff,
} from "lucide-react";

const attendanceUrl = import.meta.env.VITE_ESP32_ATTENDANCE_URL?.trim();

function useLightMotion() {
  const reducedMotion = useReducedMotion();
  const isLowEndDevice =
    typeof navigator !== "undefined" &&
    typeof navigator.hardwareConcurrency === "number" &&
    navigator.hardwareConcurrency <= 4;

  return reducedMotion || isLowEndDevice;
}

export default function OfflineAttendance() {
  const shouldReduceMotion = useLightMotion();
  const [localNetworkStatus, setLocalNetworkStatus] = useState(
    attendanceUrl ? "checking" : "unconfigured",
  );
  const [attendance, setAttendance] = useState(null);

  const checkLocalAttendance = useCallback(async () => {
    if (!attendanceUrl) {
      setLocalNetworkStatus("unconfigured");
      return;
    }

    setLocalNetworkStatus("checking");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 7000);

    try {
      const response = await fetch(attendanceUrl, {
        method: "GET",
        cache: "no-store",
        credentials: "omit",
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`ESP32 returned HTTP ${response.status}`);
      }

      setAttendance(await response.json());
      setLocalNetworkStatus("available");
    } catch (error) {
      console.error("Local attendance network check failed:", error);
      setAttendance(null);
      setLocalNetworkStatus("unavailable");
    } finally {
      window.clearTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    const initialCheck = window.setTimeout(() => {
      void checkLocalAttendance();
    }, 0);

    return () => window.clearTimeout(initialCheck);
  }, [checkLocalAttendance]);

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.22),transparent_34%),linear-gradient(135deg,#020817_0%,#0b1120_35%,#111827_100%)] px-5 py-10 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute -left-14 top-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <motion.section
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.08 : 0.45, ease: "easeOut" }}
        className="relative z-10 w-full max-w-xl rounded-[32px] border border-white/15 bg-slate-950/60 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.9)] backdrop-blur-xl sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500/25 to-cyan-400/15 text-blue-200 ring-1 ring-white/10">
            <WifiOff aria-hidden="true" className="h-7 w-7" />
          </div>

          <span className="inline-flex items-center rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-200">
            Offline mode
          </span>
        </div>

        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] text-blue-200">
          Offline Attendance Page
        </p>
        <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
          Local attendance status
        </h1>
        <p className="mt-3 max-w-lg leading-relaxed text-slate-300">
          This page checks the configured local attendance service and surfaces
          its latest data when the device is online.
        </p>

        <div className="mt-7 space-y-3">
          <ConnectionStatus
            icon={ServerOff}
            label="Local ESP32 attendance network"
            status={localNetworkStatus}
          />
        </div>

        {localNetworkStatus === "available" && attendance !== null && (
          <div className="mt-5 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 p-4 shadow-inner shadow-emerald-950/20">
            <h2 className="mb-2 font-semibold text-emerald-200">
              ESP32 attendance data
            </h2>
            <pre className="max-h-56 overflow-auto whitespace-pre-wrap wrap-break-word rounded-xl bg-slate-950/40 p-3 text-xs leading-6 text-slate-200">
              {JSON.stringify(attendance, null, 2)}
            </pre>
          </div>
        )}

        {localNetworkStatus === "unconfigured" && (
          <p className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
            Configure <code className="rounded bg-white/5 px-1.5 py-0.5 text-cyan-200">VITE_ESP32_ATTENDANCE_URL</code> to connect to the ESP32 attendance endpoint.
          </p>
        )}

        <button
          type="button"
          onClick={() => void checkLocalAttendance()}
          disabled={localNetworkStatus === "checking"}
          className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-5 font-semibold text-slate-950 transition duration-200 hover:bg-slate-200 active:scale-[0.99] disabled:cursor-wait disabled:opacity-70"
        >
          {localNetworkStatus === "checking" ? (
            <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin" />
          ) : (
            <RefreshCw aria-hidden="true" className="h-5 w-5" />
          )}
          Retry connections
        </button>
      </motion.section>
    </main>
  );
}

function ConnectionStatus({ icon: Icon, label, status }) {
  const statusLabels = {
    checking: "Checking",
    available: "Available",
    unavailable: "Unavailable",
    unconfigured: "Not configured",
  };
  const statusDotClasses = {
    checking: "bg-sky-300",
    available: "bg-emerald-300",
    unavailable: "bg-amber-300",
    unconfigured: "bg-slate-400",
  };
  const statusContainerClasses = {
    checking: "border-sky-400/30 bg-sky-500/10 text-sky-200",
    available: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
    unavailable: "border-amber-400/30 bg-amber-500/10 text-amber-200",
    unconfigured: "border-slate-400/20 bg-white/5 text-slate-300",
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <span className="flex min-w-0 items-center gap-3 text-sm text-slate-200">
        <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-slate-400" />
        <span>{label}</span>
      </span>

      <span
        className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusContainerClasses[status]}`}
      >
        <span className={`h-2 w-2 rounded-full ${statusDotClasses[status]}`} />
        {statusLabels[status]}
      </span>
    </div>
  );
}

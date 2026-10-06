import { useCallback, useEffect, useState } from "react";
import {
  LoaderCircle,
  RefreshCw,
  ServerOff,
  WifiOff,
} from "lucide-react";

const attendanceUrl = import.meta.env.VITE_ESP32_ATTENDANCE_URL?.trim();

export default function OfflineAttendance() {
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
    <main className="flex min-h-dvh items-center justify-center overflow-y-auto bg-slate-950 px-5 py-10 text-white">
      <section className="w-full max-w-xl rounded-3xl border border-white/15 bg-slate-950/85 p-6 shadow-2xl backdrop-blur-md sm:p-9">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-400/15 text-orange-300">
          <WifiOff aria-hidden="true" className="h-7 w-7" />
        </div>

        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-orange-300">
          Offline Attendance Page
        </p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Local attendance
        </h1>
        <p className="mt-3 leading-relaxed text-slate-300">
          This page checks the configured local attendance service and displays
          its latest data when available.
        </p>

        <div className="mt-7 space-y-3">
          <ConnectionStatus
            icon={ServerOff}
            label="Local ESP32 attendance network"
            status={localNetworkStatus}
          />
        </div>

        {localNetworkStatus === "available" && attendance !== null && (
          <div className="mt-5 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 p-4">
            <h2 className="mb-2 font-semibold text-emerald-200">
              ESP32 attendance data
            </h2>
            <pre className="max-h-56 overflow-auto whitespace-pre-wrap wrap-break-word text-xs text-slate-200">
              {JSON.stringify(attendance, null, 2)}
            </pre>
          </div>
        )}

        {localNetworkStatus === "unconfigured" && (
          <p className="mt-4 text-sm text-slate-400">
            Configure <code>VITE_ESP32_ATTENDANCE_URL</code> to connect to the
            ESP32 attendance endpoint.
          </p>
        )}

        <button
          type="button"
          onClick={() => void checkLocalAttendance()}
          disabled={localNetworkStatus === "checking"}
          className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-5 font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-wait disabled:opacity-70"
        >
          {localNetworkStatus === "checking" ? (
            <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin" />
          ) : (
            <RefreshCw aria-hidden="true" className="h-5 w-5" />
          )}
          Retry connections
        </button>
      </section>
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
  const statusColors = {
    checking: "text-sky-200",
    available: "text-emerald-300",
    unavailable: "text-orange-300",
    unconfigured: "text-slate-400",
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 px-4 py-3">
      <span className="flex min-w-0 items-center gap-3 text-sm text-slate-200">
        <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-slate-400" />
        <span>{label}</span>
      </span>
      <span
        className={`shrink-0 text-xs font-semibold ${statusColors[status]}`}
      >
        {statusLabels[status]}
      </span>
    </div>
  );
}

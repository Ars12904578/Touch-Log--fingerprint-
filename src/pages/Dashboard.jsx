import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Badge, Table } from "@heroui/react";
import {
  ArrowRight,
  CalendarCheck,
  ClipboardList,
  Fingerprint,
  HomeIcon,
  Sparkles,
  UserRoundKey,
  UsersRound,
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { auth } from "../firebase";

const teamMembers = [
  { name: "Student #1", lrn: "1", isPresent: false },
  { name: "Student #2", lrn: "2", isPresent: true },
  { name: "Student #3", lrn: "3", isPresent: true },
  { name: "Student #3", lrn: "3", isPresent: false },
  { name: "Student #4", lrn: "4", isPresent: true },
];

const navItems = [
  {
    icon: ClipboardList,
    title: "Attendance",
    page: "attendance",
  },
  { icon: UsersRound, title: "Students", page: "students" },
];

const buttonStyle =
  "flex w-fit cursor-pointer items-center justify-center gap-1 rounded-full px-4 py-3 transition-colors transition-transform hover:scale-[1.02] active:scale-[0.97]";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState("default");
  const isAdmin = false;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col-reverse md:flex-col">
      <Navbar
        navigate={navigate}
        user={user}
        activePage={activePage}
        setActivePage={setActivePage}
        isAdmin={isAdmin}
        Home={HomeIcon}
        UserRoundKey={UserRoundKey}
      />
      <Content activePage={activePage} setActivePage={setActivePage} />
    </div>
  );
}

function Content({ activePage, setActivePage }) {
  const reducedMotion = useReducedMotion();
  let Page;

  switch (activePage) {
    case "admin":
      Page = AdminPage;
      break;
    case "students":
      Page = StudentsPage;
      break;
    case "attendance":
      Page = AttendancePage;
      break;
    case "default":
    default:
      Page = DefaultPage;
  }

  return (
    <div className="min-h-0 flex-1">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activePage}
          initial={{ opacity: 0, y: reducedMotion ? 0 : 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reducedMotion ? 0 : -2 }}
          transition={{
            duration: reducedMotion ? 0.08 : 0.14,
            ease: "easeOut",
          }}
          className="h-full"
        >
          <Page setActivePage={setActivePage} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function DefaultPage({ setActivePage }) {
  return (
    <div className="flex h-full items-center justify-center overflow-y-auto p-4 sm:p-6 md:p-8">
      <section className="relative isolate w-full max-w-6xl overflow-hidden rounded-4xl border border-white/70 bg-white/75 text-slate-900 shadow-xl shadow-blue-950/15 backdrop-blur-md">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 -z-10 h-64 w-64 rounded-full bg-cyan-300/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-16 -z-10 h-64 w-64 rounded-full bg-blue-300/25 blur-3xl"
        />

        <div className="grid min-h-96 items-center gap-8 px-6 py-8 sm:px-9 md:grid-cols-[1.2fr_0.8fr] md:gap-6 md:px-12 md:py-10">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/90 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-800">
              <Sparkles aria-hidden="true" className="h-4 w-4" />
              Touch Log dashboard
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Attendance,
              <span className="block text-blue-700">
                made effortless.
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Your dashboard is ready. Head to Attendance to check today&apos;s
              records and keep every check-in in one place.
            </p>

            <button
              type="button"
              onClick={() => setActivePage("attendance")}
              className="group mt-7 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-slate-900 px-5 py-3 font-semibold text-white shadow-md shadow-blue-950/20 transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-blue-800 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
            >
              <ClipboardList aria-hidden="true" className="h-5 w-5" />
              Go to Attendance
              <ArrowRight
                aria-hidden="true"
                className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
              />
            </button>

            <p className="mt-3 text-sm text-slate-500">
              View your attendance records in one tap.
            </p>
          </div>

          <div className="relative mx-auto flex w-full max-w-sm items-center justify-center py-5 md:py-0">
            <div
              aria-hidden="true"
              className="absolute h-52 w-52 rounded-full border border-dashed border-blue-300/70 sm:h-60 sm:w-60"
            />
            <div
              aria-hidden="true"
              className="absolute h-40 w-40 rounded-full border border-blue-200/80 sm:h-48 sm:w-48"
            />
            <div className="relative flex h-32 w-32 items-center justify-center rounded-[2rem] border border-blue-200 bg-linear-to-br from-white to-blue-100 shadow-lg shadow-blue-900/10 sm:h-36 sm:w-36">
              <Fingerprint
                aria-hidden="true"
                className="h-20 w-20 text-blue-800 sm:h-24 sm:w-24"
                strokeWidth={1.4}
              />
              <span className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-white bg-white text-emerald-600 shadow-md">
                <CalendarCheck aria-hidden="true" className="h-5 w-5" />
              </span>
            </div>

            <div className="absolute bottom-0 right-0 flex items-center gap-3 rounded-2xl border border-white bg-white/95 px-3 py-2.5 shadow-lg shadow-blue-950/15 sm:bottom-2 sm:right-0">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <ClipboardList aria-hidden="true" className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Your next stop
                </span>
                <span className="mt-0.5 block font-bold text-slate-900">
                  Attendance
                </span>
              </span>
              <ArrowRight
                aria-hidden="true"
                className="ml-1 h-4 w-4 text-blue-700"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Navbar({
  navigate,
  user,
  activePage,
  setActivePage,
  isAdmin,
  Home,
  UserRoundKey,
}) {
  const initials = user?.displayName?.trim().slice(0, 2).toUpperCase() || "TL";

  return (
    <div
      className="bg-white/5 backdrop-blur-xs flex h-fit items-center justify-center px-0 py-2 md:inset-x-0 md:top-0 md:bottom-auto md:justify-between md:px-10 md:py-5"
    >
      <img
        src="/android-chrome-192x192.png"
        alt="Logo"
        className="hidden w-20 cursor-pointer md:block drop-shadow-[0_0px_30px_#0f85ff]"
        onClick={() => navigate("/")}
      />

      <div
        className="flex items-center justify-center drop-shadow-[0_0px_30px_#0f85ff] shadow-lg gap-2 rounded-full bg-white/50 p-3 pr-5 backdrop-blur-xs"
      >
        <div
          onClick={() => {
            navigate("/");
          }}
          className={`bg-white text-black ${buttonStyle}`}
        >
          <Home className="h-full w-full" />
          <div className="hidden text-lg sm:block">Home</div>
        </div>
        {isAdmin && (
          <div
            onClick={() => {
              setActivePage("admin");
            }}
            className={`${activePage === "admin" ? "bg-slate-900 text-white" : "bg-white text-slate-900"} ${buttonStyle}`}
          >
            <UserRoundKey className="h-full w-full" />
            <div className="hidden text-lg sm:block">Admin</div>
          </div>
        )}

        {navItems.map(({ icon: Icon, title, path, page }, index) => {
          if (isAdmin) {
            return null;
          }

          const isActive = page ? activePage === page : false;

          return (
            <div
              key={`${title}-${index}`}
              onClick={() => {
                if (path) {
                  navigate(path);
                  return;
                }

                setActivePage(page);
              }}
              className={[
                buttonStyle,
                isActive
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-900",
              ].join(" ")}
            >
              <Icon className="h-full w-full" />
              <div className="hidden text-lg sm:block">{title}</div>
            </div>
          );
        })}

        <div className="cursor-pointer">
          <Badge.Anchor>
            <Avatar size="lg">
              <Avatar.Fallback className="bg-slate-900 text-white">
                {initials}
              </Avatar.Fallback>
            </Avatar>
            <Badge color="success" placement="bottom-right" size="sm" />
          </Badge.Anchor>
        </div>
      </div>
    </div>
  );
}

function AttendancePage() {
  return (
    <div className="h-full w-full overflow-y-auto p-5 md:p-10">
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Team members" className="min-w-150">
            <Table.Header>
              <Table.Column>Name</Table.Column>
              <Table.Column>LRN</Table.Column>
              <Table.Column>Status</Table.Column>
            </Table.Header>
            <Table.Body>
              {teamMembers.map(({ name, lrn, isPresent }, index) => (
                <Table.Row key={`${name}-${lrn}-${index}`}>
                  <Table.Cell>{name}</Table.Cell>
                  <Table.Cell>{lrn}</Table.Cell>
                  <Table.Cell>{isPresent ? "Present" : "Absent"}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </div>
  );
}

function AdminPage() {
  return (
    <div className="flex h-full items-center justify-center p-10 text-2xl text-white">
      Admin
    </div>
  );
}

function StudentsPage() {
  return (
    <div className="flex h-full items-center justify-center p-10 text-2xl text-white">
      Students
    </div>
  );
}

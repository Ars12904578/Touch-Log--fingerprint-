import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Badge, Table } from "@heroui/react";
import {
  ClipboardList,
  HomeIcon,
  UserRoundKey,
  UsersRound,
  Search,
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { auth } from "../firebase";
import FadeImage from "../components/FadeImage";

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

// const role = "parent"
// roles: parent, teacher, admin

import { useMemo } from "react";
import { ChevronRight, SearchX, Users, X } from "lucide-react";

const SECTIONS = [
  { id: 1, grade: 7, name: "Rizal", adviser: "Ms. Dela Cruz", students: 42 },
  { id: 2, grade: 7, name: "Bonifacio", adviser: "Mr. Santos", students: 40 },
  { id: 3, grade: 8, name: "Mabini", adviser: "Ms. Reyes", students: 38 },
  { id: 4, grade: 8, name: "Luna", adviser: "Mr. Garcia", students: 41 },
  {
    id: 5,
    grade: 9,
    name: "Aguinaldo",
    adviser: "Ms. Villanueva",
    students: 39,
  },
  { id: 6, grade: 9, name: "Del Pilar", adviser: "Mr. Ramos", students: 37 },
  { id: 7, grade: 10, name: "Quezon", adviser: "Ms. Mendoza", students: 36 },
  { id: 8, grade: 10, name: "Osmeña", adviser: "Mr. Bautista", students: 35 },
];

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
      <div className="bg-slate-950/90 backdrop-blur-xs w-full h-full flex overflow-auto">
        <Content
          activePage={activePage}
          setActivePage={setActivePage}
          user={user}
        />
      </div>
    </div>
  );
}

function Content({ activePage, setActivePage, user }) {
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
          <Page setActivePage={setActivePage} user={user} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function DefaultPage({ user }) {
  const name = user?.displayName?.trim();
  const initials = name?.slice(0, 2).toUpperCase() || "TL";
 
  const [query, setQuery] = useState("");
 
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SECTIONS;
    return SECTIONS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.adviser.toLowerCase().includes(q) ||
        `grade ${s.grade}`.includes(q),
    );
  }, [query]);
 
  return (
    // min-h-0 + flex-col lets the list below scroll inside the page on mobile
    <div className="flex h-full min-h-0 flex-col text-white md:flex-row">
      {/* Profile card: compact strip on mobile, full card on desktop */}
      <div className="flex w-full shrink-0 items-center justify-center p-3 pb-0 md:h-full md:w-100 md:p-0">
        <div className="relative flex w-full items-center gap-4 overflow-hidden rounded-3xl border border-white/10 bg-slate-800/50 p-4 text-left shadow-2xl shadow-black/40 backdrop-blur-xl md:h-9/10 md:w-9/10 md:flex-col md:justify-center md:gap-6 md:rounded-4xl md:p-6 md:text-center">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl" />
 
          {/* avatar: solid ring, no gradient */}
          <div className="relative shrink-0 rounded-full bg-blue-500 p-0.5 shadow-lg shadow-blue-500/20 md:p-1">
            <div className="flex aspect-square w-14 items-center justify-center rounded-full bg-slate-950 text-xl font-bold tracking-wide md:w-36 md:text-5xl">
              {initials}
            </div>
          </div>
 
          <div className="min-w-0 flex-1 md:w-full md:flex-none">
            <p className="text-sm text-slate-300 md:text-base">
              Welcome to Touch Log!
            </p>
            <h1 className="truncate text-xl font-bold md:mt-1 md:text-3xl">
              {name || "Guest"}
            </h1>
            {/* mobile-only summary line */}
            <p className="mt-0.5 text-xs text-slate-400 md:hidden">
              CTNHS · Student
            </p>
          </div>
 
          <div className="hidden h-px w-2/3 bg-white/10 md:block" />
 
          {/* desktop-only chips */}
          <div className="hidden flex-wrap items-center justify-center gap-2 text-sm md:flex">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-slate-300">
              Registered: <strong className="text-white">CTNHS</strong>
            </span>
            <span className="rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-1.5 text-blue-200">
              Role: <strong className="text-blue-100">STUDENT</strong>
            </span>
          </div>
        </div>
      </div>
 
      {/* do not edit this part */}
      <div className="flex min-h-0 w-full flex-1 flex-col gap-4 p-3 md:h-full md:gap-5 md:p-5">
        {/* Search: the main action on this page */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="section-search"
            className="pl-4 text-xl font-bold md:text-2xl"
          >
            Search
          </label>
 
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-950 p-1.5 pl-5 shadow-lg shadow-black/30 transition focus-within:border-blue-400/60 focus-within:ring-4 focus-within:ring-blue-500/20">
            <input
              id="section-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by section, adviser, or grade..."
              autoComplete="off"
              // text-base (16px) also stops iOS from zooming in on focus
              className="min-w-0 flex-1 bg-transparent py-3 text-base text-white outline-none placeholder:text-slate-500 md:text-lg"
            />
 
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            )}
 
            <div className="rounded-full bg-blue-500 p-3.5 text-white">
              <Search size={22} />
            </div>
          </div>
        </div>
 
        {/* Sections list */}
        <div className="flex min-h-0 flex-1 flex-col gap-2">
          <p className="pl-4 text-sm text-slate-400">
            {filtered.length} {filtered.length === 1 ? "section" : "sections"}
          </p>
 
          {filtered.length > 0 ? (
            <ul className="min-h-0 flex-1 touch-pan-y divide-y divide-white/5 overflow-y-auto overscroll-contain rounded-3xl border border-white/10 bg-slate-800/40">
              {filtered.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className="group flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-white/5 focus-visible:bg-white/5 focus-visible:outline-none"
                  >
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/15 text-lg font-bold text-blue-200">
                      {s.grade}
                    </span>
 
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">
                        {s.name}
                      </span>
                      <span className="block truncate text-sm text-slate-400">
                        Adviser: {s.adviser}
                      </span>
                    </span>
 
                    <span className="hidden items-center gap-1.5 text-sm text-slate-400 sm:flex">
                      <Users size={16} />
                      {s.students}
                    </span>
 
                    <ChevronRight
                      size={20}
                      className="shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-white"
                    />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-white/10 text-center text-slate-400">
              <SearchX size={32} />
              <p className="font-semibold text-slate-200">No sections found</p>
              <p className="text-sm">
                Try a different section, adviser, or grade.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NavButton({ icon: Icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={[
        // mobile: equal-width tabs, icon on top of a small label
        "flex min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-full px-2 py-2 text-[11px] font-medium",
        // desktop: compact pill, icon beside label
        "md:flex-none md:flex-row md:gap-2 md:px-4 md:py-2.5 md:text-base",
        "transition duration-150 active:scale-95",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400",
        active
          ? "bg-white text-slate-950"
          : "text-slate-400 hover:bg-white/10 hover:text-white",
      ].join(" ")}
    >
      <Icon className="size-5 shrink-0" />
      <span className={`truncate`}>
        {label}
      </span>
    </button>
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
    <header className="flex items-center justify-center border-t border-white/10 bg-slate-950 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:justify-between md:border-t-0 md:border-b md:px-10 md:py-4">
      <FadeImage
        src="/android-chrome-192x192.png"
        alt="Touch Log logo"
        className="hidden w-16 cursor-pointer drop-shadow-[0_0_10px_#0f85ff66] md:block"
        onClick={() => navigate("/")}
      />
 
      <nav
        aria-label="Main"
        className="flex w-full max-w-md items-center gap-1 border border-white/10 bg-slate-900/80 p-1.5 shadow-lg shadow-black/30 backdrop-blur-md md:w-auto md:max-w-none rounded-full"
      >
        <NavButton
          icon={Home}
          label="Home"
          active={activePage === "default"}
          onClick={() => setActivePage("default")}
        />
 
        {isAdmin ? (
          <NavButton
            icon={UserRoundKey}
            label="Admin"
            active={activePage === "admin"}
            onClick={() => setActivePage("admin")}
          />
        ) : (
          navItems.map(({ icon, title, path, page }) => (
            <NavButton
              key={title}
              icon={icon}
              label={title}
              active={page ? activePage === page : false}
              onClick={() => (path ? navigate(path) : setActivePage(page))}
            />
          ))
        )}
 
        {/* separator before the profile avatar */}
        <span aria-hidden="true" className="mx-1 h-8 w-px shrink-0 bg-white/10" />
 
        <div className="flex shrink-0 items-center justify-center px-2 md:px-1">
          <Badge.Anchor>
            <Avatar size="md">
              <Avatar.Fallback className="bg-blue-900 font-semibold text-white">
                {initials}
              </Avatar.Fallback>
            </Avatar>
          </Badge.Anchor>
        </div>
      </nav>
    </header>
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

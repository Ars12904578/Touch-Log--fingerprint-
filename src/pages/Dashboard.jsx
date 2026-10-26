import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Badge, Table } from "@heroui/react";
import {
  ClipboardList,
  HomeIcon,
  UserRoundKey,
  UsersRound,
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
      <div className="bg-slate-950/90 backdrop-blur-sm w-full h-full overflow-auto">
        <Content activePage={activePage} setActivePage={setActivePage} />
      </div>
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
  return <div className="flex h-full items-center justify-center"></div>;
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
    <div className="bg-slate-950 flex h-fit items-center justify-center px-0 py-2 md:inset-x-0 md:top-0 md:bottom-auto md:justify-between md:px-10 md:py-5">
      <FadeImage
        src="/android-chrome-192x192.png"
        alt="Logo"
        className="hidden w-20 cursor-pointer md:block drop-shadow-[0_0px_10px_#0f85ffb3]"
        onClick={() => navigate("/")}
      />

      <div className="flex items-center justify-center drop-shadow-[0_0px_10px_#0f85ffb3] shadow-lg gap-2 rounded-full bg-white/50 p-3 pr-5 backdrop-blur-xs">
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

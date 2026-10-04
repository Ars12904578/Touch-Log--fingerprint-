import { useNavigate } from "react-router-dom";
import { ClipboardList, UsersRound, UserRoundKey } from "lucide-react";
import { Avatar, Badge } from "@heroui/react";
import { Table } from "@heroui/react";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userIn, setUser] = useState(null);
  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);

  return (
    <div>
      <div className="fixed inset-x-0 top-20 bottom-0 p-5 md:p-10">
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Team members" className="min-w-150">
              <Table.Header>
                <Table.Column>Name</Table.Column>
                <Table.Column>LRN</Table.Column>
                <Table.Column>Status</Table.Column>
              </Table.Header>
              <Table.Body>
                {[
                  {
                    name: "Student #1",
                    lrn: "1",
                    isPresent: false,
                  },
                  {
                    name: "Student #2",
                    lrn: "2",
                    isPresent: true,
                  },
                  {
                    name: "Student #3",
                    lrn: "3",
                    isPresent: true,
                  },
                  {
                    name: "Student #3",
                    lrn: "3",
                    isPresent: false,
                  },
                  {
                    name: "Student #4",
                    lrn: "4",
                    isPresent: true,
                  },
                ].map((val, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{val.name}</Table.Cell>
                    <Table.Cell>{val.lrn}</Table.Cell>
                    <Table.Cell>
                      {val.isPresent ? "Present" : "Absent"}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>
      <Navbar navigate={navigate} userIn={userIn}></Navbar>
    </div>
  );
}

function Navbar({ navigate, userIn }) {
  return (
    <div className="fixed inset-x-0 top-0 flex items-center justify-between px-5 md:px-10 pt-5">
      <img
        src="/android-chrome-192x192.png"
        alt="Logo"
        className="w-20 cursor-pointer"
        onClick={() => navigate("/")}
      />
      <div className="flex items-center justify-center gap-2 bg-white/50 p-3 pr-5 rounded-full backdrop-blur-xs">
        {/* <div className="w-12 bg-white aspect-square rounded-full p-3 cursor-pointer">
            <EllipsisVertical className="w-full h-full"></EllipsisVertical>
          </div> */}
        <div className="w-fit bg-white px-4 py-3 rounded-full cursor-pointer flex items-center justify-center gap-1">
          <UserRoundKey className="w-full h-full"></UserRoundKey>
          <div className="text-lg">Admin</div>
        </div>
        <div className="w-fit bg-white px-4 py-3 rounded-full cursor-pointer flex items-center justify-center gap-1">
          <ClipboardList className="w-full h-full"></ClipboardList>
          <div className="text-lg">Attendance</div>
        </div>
        <div className="w-fit bg-white px-4 py-3 rounded-full cursor-pointer flex items-center justify-center gap-1">
          <UsersRound className="w-full h-full"></UsersRound>
          <div className="text-lg">Students</div>
        </div>
        <div className="cursor-pointer">
          <Badge.Anchor>
            <Avatar size="lg">
              <Avatar.Fallback className="bg-slate-900 text-white">
                {userIn?.displayName
                          ?.trim()
                          .slice(0, 2)
                          .toUpperCase() || "TL"}
              </Avatar.Fallback>
            </Avatar>
            {/* <Badge color="danger" size="md">
                5
                </Badge> */}
                <Badge color="success" placement="bottom-right" size="sm" />
          </Badge.Anchor>
        </div>
      </div>
    </div>
  );
}

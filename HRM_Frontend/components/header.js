"use client";
import { useState, useEffect } from "react";
import UserDropdown from "./DropDown";
import Link from "next/link";
import { MdDashboard } from "react-icons/md";
import {
  FaUsers,
  FaUserCheck,
  FaCalendarTimes,
  FaArrowLeft,
} from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import moment from "moment";
import { postDataWithToken } from "@/app/requestConfig";
import { toast } from "react-toastify";
import { useUser } from "@/app/userContext";
import { BsPersonFillExclamation } from "react-icons/bs";
import { BiSolidHomeAlt2 } from "react-icons/bi";
import { usePathname } from "next/navigation";
import Logo from "./logo";

export default function Navbar() {
  const { user, punchIn, punchOut, isPunchedIn } = useUser();
  const [data, setData] = useState(false);
  const [punchedIn, setPunchedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const pathName = usePathname();

  const navlinks = (role) => {
    if (role == "HR") {
      return [
        { label: "Dashboard", link: "/hr", icon: <MdDashboard /> },
        { label: "Employee", link: "/hr/employee", icon: <FaUsers /> },
        {
          label: "Attendance",
          link: "/hr/attendance",
          icon: <BsPersonFillExclamation />,
        },
        { label: "Leaves", link: "/hr/leaves", icon: <FaCalendarTimes /> },
      ];
    } else if (role == "MANAGER") {
      return [
        {
          label: "Dashboard",
          link: "/manager",
          icon: <MdDashboard />,
        },
        {
          label: "Attendance",
          link: "/manager/attendance",
          icon: <FaUserCheck />,
        },
        {
          label: "Leave Requests",
          link: "/manager/leaverequest",
          icon: <BsPersonFillExclamation />,
        },
        {
          label: "Apply Leave",
          link: "/manager/leaveSubmit",
          icon: <BiSolidHomeAlt2 />,
        },
      ];
    } else if (role == "EMPLOYEE") {
      return [
        {
          label: "Dashboard",
          link: "/employee",
          icon: <MdDashboard />,
        },
        {
          label: "Attendance",
          link: "/employee/attendance",
          icon: <FaUserCheck />,
        },
        {
          label: "Apply Leave",
          link: "/employee/leaveSubmit",
          icon: <BiSolidHomeAlt2 />,
        },
      ];
    }
  };

  const role = user.role;
  const email = user.email;

  const userNavLinks = navlinks(role);

  const handlePunch = async () => {
    const values = {
      user: user.id,
      date: moment().format("MM/DD/YYYY"),
      attendenceType: "Present",
    };

    if (!punchedIn) {
      try {
        const response = await postDataWithToken(
          "http://localhost:3210/attendance",
          values
        );
        if (response.status == 2) {
          toast.info("Attendance already marked");
          return;
        }
        if (response.status == 3) {
          toast.warn("On leave today");
          return;
        }
        punchIn();
        toast.success("Punched in");
      } catch (error) {
        console.log(error);
      }
    } else {
      setShowModal(true);
    }
  };

  const confirmPunchOut = async () => {
    setShowModal(false);
    try {
      const values = {
        user: user.id,
        date: moment().format("MM/DD/YYYY"),
        attendenceType: "",
      };
      const response = await postDataWithToken(
        "http://localhost:3210/attendance",
        values
      );
      if (response.status == 2) {
        toast.info("Attendance marked already");
        return;
      }
      if (response.status == 3) {
        toast.warn("On leave today");
        return;
      }
      punchOut();
      toast.success("Punched out");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await postDataWithToken(
          "http://localhost:3210/filterAttendance",
          { userInput: email }
        );
        const filteredData = response.data.reverse();
        const hasCheckInTime = filteredData[0]?.checkInTime != null;
        const hasCheckOutTime = filteredData[0]?.checkOutTime != null;
        if (hasCheckInTime && !hasCheckOutTime) {
          console.log("red");
          setPunchedIn(true);
        } else {
          console.log("green");
          setPunchedIn(false);
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    fetchData();
  }, [isPunchedIn]);

  const helo = () => {
    setData(!data);
  };

  return (
    <>
      <div>
        <nav className="fixed w-full bg-gray-100 py-4 px-4 border border-b-gray-200 z-50">
          <div className="flex flex-row justify-between items-center">
            <img
              src="/chaincode_logo.svg"
              width={200}
              height={200}
              className="xs:hidden lg:block "
            />
            <div className="cursor-pointer" onClick={helo}>
              <GiHamburgerMenu className="text-2xl lg:hidden xs:block" />
            </div>

            {/* Profile */}
            <div className="flex flex-row gap-8">
              <button
                onClick={handlePunch}
                className={`px-4 py-2 rounded transform transition duration-300 w-28 h-10 ${
                  punchedIn ? "btn_red" : "btn_green"
                } text-white`}
              >
                {punchedIn ? "Punch Out" : "Punch In"}
              </button>
              <UserDropdown />
            </div>
          </div>

          {/* <Slider/> */}
          <div
            className={
              data
                ? "fixed left-0 w-[100%] top-0 h-screen ease-in duration-500 z-40 lg:hidden xs:block"
                : "fixed left-[-100%] w-[100%] h-screen ease-in duration-500 top-0 lg:hidden xs:block"
            }
          >
            <div className="w-[100%] h-screen bg-gray-100">
              <div className="flex flex-col justify-between w-[90%] h-[78vh] mx-auto">
                <div className="text-end" onClick={helo}>
                  <div className="text-2xl flex justify-start mt-5 cursor-pointer">
                    <FaArrowLeft />
                  </div>
                  <div className="flex justify-center">
                    <img src="/chaincode_logo.svg" />
                  </div>
                  <div className="pt-10 text-lg">
                    <ul className="flex flex-col gap-3">
                      {userNavLinks.map((d, i) => (
                        <Link
                          key={i}
                          className={`text-black hover:bg-orange-500 hover:rounded-lg hover:text-white transition-all pl-4 p-2 rounded-md ${
                            pathName == d.link
                              ? "bg-orange-500 text-white rounded-[4px]"
                              : ""
                          }`}
                          href={d.link}
                        >
                          <div className="sm:w-1/4 xs:w-2/4 mx-auto">
                            <div className="flex flex-row items-center gap-4">
                              <div className="text-xl">{d.icon}</div>
                              <div className="text-xl">{d.label}</div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Modal for confirmation */}
        {showModal && (
          <div className="fixed rounded-xl top-0 left-0 w-full h-full bg-gray-700 bg-opacity-50 flex justify-center items-center z-[10000]">
            <div className="bg-white flex flex-col gap-4 rounded-xl px-4">
              <h1
                className="flex justify-end mt-2 text-xl"
                onClick={() => setShowModal(false)}
              ></h1>
              <p>Are you sure you want to Punch Out?</p>
              <div className="flex justify-center gap-3 mb-4">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded"
                  onClick={confirmPunchOut}
                >
                  Confirm
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 text-black rounded mr-4"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* sidebar */}
        <div className="fixed z-40 lg:block xs:hidden bg-gray-100 w-2/12 h-screen p-6 border shadow-xl">
          {/* <img src="/chaincode_logo.svg" /> */}
          <div className="pt-20 text-lg">
            <ul className="flex flex-col gap-3">
              {userNavLinks.map((d, i) => (
                <Link
                  key={i}
                  className={`text-gray-900 hover:bg-orange-500 hover:rounded-[4px] hover:text-white transition-all pl-4 p-2 rounded-[4xl] ${
                    pathName == d.link
                      ? "bg-orange-500 text-white rounded-[4px]"
                      : ""
                  }`}
                  href={d.link}
                >
                  <div className="flex flex-row items-center gap-2">
                    <div>{d.icon}</div>
                    {d.label}
                  </div>
                </Link>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="mb-[74px]" />
    </>
  );
}

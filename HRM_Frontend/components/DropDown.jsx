import React, { useState, useEffect, useRef } from "react";
import { IoMdPerson } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { RiProfileFill } from "react-icons/ri";
import { IoLogOut } from "react-icons/io5";
import { useUser } from "@/app/userContext";
import Modal from "./Modal";

const UserDropdown = () => {
  const { userDetails } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const name = userDetails.first_name;
  const last_name = userDetails.last_name;
  const full_name = name + " " + last_name;

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
    setIsOpen(false);
  };

  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
    setIsOpen(false);
  };

  const closeModal = () => {
    setIsProfileModalOpen(false);
    setIsLogoutModalOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const router = useRouter();
  const [cookies, , removeCookie] = useCookies(["token"]);

  const handleLogout = () => {
    setLoading(true);
    removeCookie("token");
    router.push("/login");

    setIsLogoutModalOpen(false);
    setIsOpen(false);
    setLoading(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <div
        className="p-2 rounded-full bg-white hover:bg-purple-800 hover:text-white transition-all hover:rounded-full hover:cursor-pointer"
        onClick={toggleDropdown}
      >
        <IoMdPerson className="text-[25px]" />
      </div>
      {isOpen && (
        <div className="absolute top-10 right-0 bg-white border rounded shadow-lg z-10 cursor-pointer">
          <ul>
            <li
              className="flex items-center gap-2 text-gray-900 cursor-pointer hover:bg-orange-500 hover:rounded-[4px] hover:text-white transition-all px-4 p-2 rounded-md"
              onClick={openProfileModal}
            >
              <RiProfileFill />
              Profile
            </li>
            <li
              className="flex items-center gap-2 text-gray-900 cursor-pointer hover:bg-orange-500 hover:rounded-[4px] hover:text-white transition-all px-4 p-2 rounded-md"
              onClick={openLogoutModal}
            >
              <IoLogOut />
              Logout
            </li>
          </ul>
        </div>
      )}
      <Modal
        showModal={isProfileModalOpen}
        handleClose={closeModal}
        title="Profile"
      >
        <div className="grid md:grid-cols-2 xs:grid-cols-1 gap-2 text-lg">
          <p>
            <span className="font-medium">Name: </span> {full_name}
          </p>
          <p>
            <span className="font-medium">Email: </span> {userDetails.email}
          </p>
          <p>
            <span className="font-medium">Date of Birth: </span>{" "}
            {userDetails.dob}
          </p>
          <p>
            <span className="font-medium">Phone: </span> {userDetails.phone}
          </p>
          <p>
            <span className="font-medium">Manager: </span> {userDetails.manager}
          </p>
          <p>
            <span className="font-medium">Overtime: </span>{" "}
            {userDetails.overtimeRate}
          </p>
          <p>
            <span className="font-medium">Role: </span> {userDetails.role}
          </p>
          <p>
            <span className="font-medium">Salary: </span> {userDetails.salary}
          </p>
          <p>
            <span className="font-medium">Status: </span> {userDetails.status}
          </p>
        </div>
      </Modal>
      <Modal
        showModal={isLogoutModalOpen}
        handleClose={closeModal}
        title="Logout Confirmation"
      >
        {loading ? (
          <div className="flex justify-center items-center mt-10">
            <div className="loader"></div>
          </div>
        ) : (
          <>
            <p className="text-lg">Are you sure you want to logout?</p>
            <div className="flex justify-end">
              <button
                onClick={handleLogout}
                className="mt-4 bg-red-500 hover:bg-red-600 transition-all text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default UserDropdown;

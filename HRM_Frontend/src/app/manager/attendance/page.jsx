"use client";
import { postDataWithToken } from "@/app/requestConfig";
import { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Table from "../../../../components/Table1";
import { useUser } from "@/app/userContext";
import withAuth from "@/app/withAuth";

const Attendance = () => {
  const { user, isPunchedIn } = useUser();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [users, setUsers] = useState([]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${month}/${day}/${year}`;
  };

  const newStartDate = formatDate(startDate);
  const newEndDate = formatDate(endDate);

  const handleSearch = async () => {
    const values = {
      startDate: newStartDate,
      endDate: newEndDate,
      userInput: user.email,
    };
    if (newStartDate && newEndDate) {
      const response = await postDataWithToken(
        "http://localhost:3210/filterAttendance",
        values
      );
      if (!response) {
        return;
      }
      setUsers(response.data?.reverse());
    }
  };

  useEffect(() => {
    const handleSearch = async () => {
      const values = {
        startDate: "",
        endDate: "",
        userInput: "",
      };
      const response = await postDataWithToken(
        "http://localhost:3210/filterAttendance",
        values
      );
      const filteredUsers = response.data.filter(
        (i) => i.user.role !== "HR" && i.user.role !== "EMPLOYEE"
      );
      setUsers(filteredUsers.reverse());
    };
    handleSearch();
  }, [isPunchedIn]);

  return (
    <div className="container mx-auto py-5 px-8 ">
      <h1 className="text-2xl text-purple-800 font-medium mb-4">
        Attendance Log
      </h1>
      <div className="flex justify-between items-center mb-4 ">
        <div className="flex flex-wrap items-center">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="MM/DD/YYYY"
            className="mr-2 mb-2 px-4 py-2 border border-gray-300 rounded-[5px] sm:w-auto"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="MM/DD/YYYY"
            className="mr-2 mb-2 px-4 py-2 border border-gray-300 rounded-[5px] sm:w-auto"
          />

          <button
            onClick={handleSearch}
            className="px-4 py-2 mb-2 bg-[#F97316] hover:bg-orange-600 text-white rounded"
          >
            Search
          </button>
        </div>
      </div>
      {!users ? (
        "No attendance marked"
      ) : (
        <div className="">
          <Table users={users} />
        </div>
      )}
    </div>
  );
};

export default withAuth(Attendance);

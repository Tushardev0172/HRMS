"use client";
import { getDataWithToken, postDataWithToken } from "@/app/requestConfig";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Table from "../components/Table1";
import { useUser } from "@/app/userContext";

const Attendance = () => {
  const { isPunchedIn } = useUser();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState([]);
  const [employee, setEmployee] = useState([]);

  useEffect(() => {
    const handleAllEmployee = async () => {
      const response = await getDataWithToken(
        "http://localhost:3210/getAllEmp"
      );
      setEmployee(response.data);
    };
    handleAllEmployee();
  }, []);

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
      userInput: searchValue,
    };
    if ((newStartDate && newEndDate) || searchValue) {
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

  const handleEmpty = async () => {
    setStartDate("");
    setEndDate("");
    setSearchValue("");
    const values = {
      startDate: "",
      endDate: "",
      userInput: "",
    };
    const response = await postDataWithToken(
      "http://localhost:3210/filterAttendance",
      values
    );
    if (!response) {
      return;
    }
    setUsers(response.data?.reverse());
  };

  useEffect(() => {
    const handleValue = async () => {
      const values = {
        startDate: newStartDate,
        endDate: newEndDate,
        userInput: searchValue,
      };

      const response = await postDataWithToken(
        "http://localhost:3210/filterAttendance",
        values
      );
      if (!response) {
        return;
      }
      setUsers(response.data?.reverse());
    };
    handleValue();
  }, [isPunchedIn]);

  return (
    <div className="px-8 py-5">
      <h1 className="text-2xl text-purple-800 font-medium mb-6 md:text-left xs:text-center">
        Attendance Log
      </h1>

      <div className="flex md:flex-row xs:flex-col items-center gap-2 mb-10 ">
        <div className="flex flex-row gap-2 justify-center md:w-auto  xs:w-full">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="MM/DD/YYYY"
            className="px-4 py-2 border border-gray-300 rounded-[5px] md:w-auto xs:w-1/2"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="MM/DD/YYYY"
            className="px-4 py-2 border border-gray-300 rounded-[5px] md:w-auto xs:w-1/2"
          />
        </div>

        <select
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="px-4 py-2 md:w-auto xs:w-full border border-gray-300 rounded-[5px]"
        >
          <option value="">Select an option</option>
          {employee.map((i) => {
            return <option key={i.email}>{i.email}</option>;
          })}
        </select>
        <div className="xs:mb-4 md:mb-0 flex flex-row gap-2 md:justify-start xs:justify-center items-center">
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-[#F97316] hover:bg-orange-600 text-white rounded"
          >
            Search
          </button>
          <button
            onClick={handleEmpty}
            className="px-4 py-2 ml-2  bg-gray-200 hover:bg-gray-300 text-gray-700 rounded"
          >
            Reset
          </button>
        </div>
      </div>
      {!users ? (
        "No ked"
      ) : (
        <div className="">
          <Table users={users} />
        </div>
      )}
    </div>
  );
};

export default Attendance;

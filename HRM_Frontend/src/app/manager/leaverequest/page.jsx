"use client";
import { getDataWithToken, postDataWithToken } from "@/app/requestConfig";
import { useUser } from "@/app/userContext";
import React, { useEffect, useState } from "react";
import Table from "../../../../components/Table3";
import withAuth from "@/app/withAuth";
import { toast } from "react-toastify";

const Page = () => {
  const { user } = useUser();

  const [leaves, setLeaves] = useState([]);
  const [manager, setManager] = useState("");
  const [reset, setReset] = useState(false);

  const handleLeaveAction = async ({ id, user, response }) => {
    const data = await postDataWithToken("http://localhost:3210/acceptLeave", {
      id,
      user,
      response,
    });
    if (data.status == 1) {
      toast.success("Leave Accepted");
    } else if (data.status == 0) {
      toast.error("Leave Rejected");
    } else if (data.status == 2) {
      toast.info("Leave Accepted or Rejected or Not Found");
    }
    setReset((prevReset) => !prevReset);
  };

  ///Finding the details of manager
  useEffect(() => {
    const handleManager = async () => {
      const response = await getDataWithToken(
        `http://localhost:3210/getSingleEmp/${user.id}`
      );
      const fullName = response.data.first_name + " " + response.data.last_name;
      setManager(fullName);
    };
    handleManager();
  }, [user]);

  // leaves accordingly to the manager
  useEffect(() => {
    const handleLeaveData = async () => {
      const response = await getDataWithToken("http://localhost:3210/allLeave");
      const data = response.data;
      const filterLeave = await data.filter(
        (i) => i.user.manager == manager && i.status == "Pending"
      );
      setLeaves(filterLeave);
    };
    handleLeaveData();
  }, [manager, reset]);

  return (
    <>
      {/* <Toast/> */}
      <div className="py-5 px-8">
        <div className="flex justify-between ">
          <h1 className="text-2xl text-purple-800 font-medium mb-4">
            Leave Requests
          </h1>
          <button
            onClick={() => setReset(!reset)}
            className="px-6 py-2 mb-2 ml-2  bg-gray-200 text-gray-700 rounded "
          >
            Reset
          </button>
        </div>
        {leaves.length == 0 ? (
          "No leave request!"
        ) : (
          <Table users={leaves} handleLeaveAction={handleLeaveAction} />
        )}
      </div>
    </>
  );
};

export default withAuth(Page);

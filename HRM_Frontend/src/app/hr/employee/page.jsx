"use client";
import React, { useState, useEffect } from "react";
import Table from "../../../../components/Table";
import { getDataWithToken } from "@/app/requestConfig";
import withAuth from "@/app/withAuth";
import Button from "../../../../components/Button";
import { useRouter } from "next/navigation";
const Home = () => {
  const router = useRouter();
  const handleNavigation = () => {
    router.push("/hr/employee/add");
  };
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDataWithToken(
          "http://localhost:3210/getAllEmp"
        );
        if (!response) {
          return;
        }
        setUsers(response.data?.reverse());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {users.length == 0 ? (
        "loading....."
      ) : (
        <div className="container mx-auto px-8 py-5">
          <div className="flex justify-between mb-6  items-center">
            <h1 className="text-2xl text-purple-800 font-medium">User Table</h1>
            <Button
              onClick={() => {
                handleNavigation();
              }}
            >
              + Add Employee
            </Button>
          </div>
          <Table users={users} />
        </div>
      )}
    </>
  );
};

export default withAuth(Home);

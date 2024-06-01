"use client";
import React, { useEffect, useState } from "react";
import withAuth from "../withAuth";
import { FaCalendarDays } from "react-icons/fa6";
import { FaCalendarTimes } from "react-icons/fa";
import { FaCalendarCheck } from "react-icons/fa6";
import { RiCalendarScheduleFill } from "react-icons/ri";
import ReactApexChart from "react-apexcharts";
import { postDataWithToken } from "../requestConfig";
import { useUser } from "../userContext";
import Greeting from "../../../components/greeting";
import moment from "moment";

const employeeDash = () => {
  const { userDetails, isPunchedIn } = useUser();
  const name = userDetails.first_name;
  const email = userDetails.email;
  const [data, setData] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leave, setLeave] = useState([]);
  const [month, setMonth] = useState(moment().month() + 1);

  const stats = [
    {
      count: attendance?.filter((i) => i.attendenceType == "Leave")?.length,
      label: "Leaves Taken (Month)",
      icon: <FaCalendarDays className="text-2xl text-orange-500" />,
    },
    {
      count: attendance?.filter((i) => i.attendenceType == "Present")?.length,
      label: "Working Days (Month)",
      icon: <FaCalendarTimes className="text-2xl text-orange-500" />,
    },
    {
      count: leave?.filter((i) => i.status == "Accepted")?.length,
      label: "Leaves Approved (Month)",
      icon: <FaCalendarCheck className="text-2xl text-orange-500" />,
    },
    {
      count: leave?.filter((i) => i.status == "Pending")?.length,
      label: "Pending Approval (Month)",
      icon: <RiCalendarScheduleFill className="text-2xl text-orange-500" />,
    },
  ];

  const series = [
    {
      name: "Total Hours",
      data: data,
    },
  ];

  const options = {
    chart: {
      type: "area",
      stacked: false,
      height: 350,
    },
    colors: ["#7434B1"],
    dataLabels: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
    markers: {
      size: 0,
    },
    title: {
      text: "Employee Attendance Hours",
      align: "left",
    },
    yaxis: {
      min: 0,
      max: 12,
      tickAmount: 12,
      labels: {
        formatter: function (val) {
          return val.toFixed(1);
        },
      },
      title: {
        text: "Total time",
        style: {
          color: "#7434B1",
        },
      },
    },
    xaxis: {
      type: "datetime",
      categories: data.map((date) => date.x),
    },
  };

  const startOfMonth = moment()
    .month(month - 1)
    .startOf("month")
    .format("MM/DD/YYYY");
  const endOfMonth = moment()
    .month(month - 1)
    .endOf("month")
    .format("MM/DD/YYYY");

  useEffect(() => {
    const handleLeave = async () => {
      const values = {
        startDate: startOfMonth,
        endDate: endOfMonth,
        user: email,
      };
      if (values.user) {
        const leavesPending = await postDataWithToken(
          "http://localhost:3210/filterLeave",
          values
        );
        setLeave(leavesPending?.data);
      }
    };
    handleLeave();
  }, [userDetails, isPunchedIn]);

  useEffect(() => {
    const handleAttendance = async () => {
      const values = {
        startDate: startOfMonth,
        endDate: endOfMonth,
        userInput: email,
      };
      if (values.userInput) {
        const workingDays = await postDataWithToken(
          "http://localhost:3210/filterAttendance",
          values
        );
        setAttendance(workingDays?.data);
      }
    };
    handleAttendance();
  }, [userDetails, isPunchedIn]);

  useEffect(() => {
    const handleEmployee = async () => {
      const today = new Date();
      const dates = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        const formatDate = (date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${month}/${day}/${year}`;
        };
        const newDate = formatDate(date);
        const values = {
          startDate: newDate,
          endDate: newDate,
          userInput: email,
        };
        if (values.userInput) {
          const response = await postDataWithToken(
            "http://localhost:3210/filterAttendance",
            values
          );

          const totalHours = response?.data?.map((i) => i.totalHours) || 0;
          const newFormattedDate = date.toISOString().split("T")[0];
          dates.push({ x: newFormattedDate, y: totalHours });
        }
      }
      setData(dates);
    };
    handleEmployee();
  }, [userDetails, isPunchedIn]);

  return (
    <>
      <div className="bg-gray-100 min-h-screen px-8 py-5">
        <div className="flex flex-col md:flex-row justify-between mb-4 items-center ">
          <h1 className="text-xl text-orange-500 font-semibold  mb-4 md:mb-0 md:mr-4  p-1 ">
            <Greeting name={name} />
          </h1>
        </div>
        <section>
          <div className="mx-auto max-w-screen-xl">
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center rounded-xl justify-between bg-white p-6 md:flex-row md:text-left"
                >
                  <div className="flex items-center justify-center rounded-full bg-orange-100 w-12 h-12 ">
                    {stat.icon}
                  </div>
                  <div className="flex gap-3 mt-2 sm:mt-0 sm:gap-0 flex-row-reverse items-center justify-between sm:items-end  md:flex-col ">
                    <dd className="text-lg sm:text-2xl font-bold text-gray-800 md:text-3xl">
                      {stat.count}
                    </dd>
                    <dt className="text-md font-medium text-gray-500">
                      {stat.label}
                    </dt>
                  </div>
                </div>
              ))}
            </dl>
            <div className="flex gap-4 pt-10">
              <div className="w-full p-2 bg-white rounded-xl">
                <div id="chart">
                  <ReactApexChart
                    options={options}
                    series={series}
                    type="area"
                    height={350}
                  />
                </div>
                <div id="html-dist"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
export default withAuth(employeeDash);

"use client";
import React, { useEffect, useState } from "react";
import withAuth from "../withAuth";
import { HiUserGroup } from "react-icons/hi";
import {
  BsPersonFillCheck,
  BsPersonFillX,
  BsPersonFillExclamation,
} from "react-icons/bs";
import ReactApexChart from "react-apexcharts";
import { getDataWithToken, postDataWithToken } from "../requestConfig";
import { useUser } from "../userContext";
import Greeting from "../../../components/greeting";

const Page = () => {
  const { isPunchedIn, userDetails } = useUser();
  const name = userDetails.first_name;

  const [employee, setEmployee] = useState([]);

  const [attendance, setAttendance] = useState([]);
  const [leave, setLeave] = useState([]);
  const [dates, setDates] = useState([]);

  const stats = [
    {
      count: employee?.length,
      label: "Total Employees",
      icon: <HiUserGroup className="text-3xl text-orange-500" />,
    },
    {
      count: attendance?.filter((i) => i.attendenceType == "Present")?.length,
      label: "Total Present",
      icon: <BsPersonFillCheck className="text-3xl text-orange-500" />,
    },
    {
      count:
        employee?.length -
        (attendance?.filter((i) => i.attendenceType == "Present")?.length +
          leave?.length),
      label: "Total Absent",
      icon: <BsPersonFillX className="text-3xl text-orange-500" />,
    },
    {
      count: leave?.length,
      label: "Total Leaves",
      icon: <BsPersonFillExclamation className="text-3xl text-orange-500" />,
    },
  ];
  const series = [
    {
      name: "Employees Present",
      data: dates,
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
      text: "Employee Attendance",
      align: "left",
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    yaxis: {
      min: 0,
      max: employee?.length,
      tickAmount: 10,
      labels: {
        formatter: function (val) {
          return val.toFixed(1);
        },
      },
      title: {
        text: "Total Present",
        colors: ["#7434B1"],
      },
    },
    xaxis: {
      type: "datetime",
      categories: dates?.map((date) => date.x),
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          return val.toFixed(1);
        },
      },
      zoom: {
        enabled: false,
      },
    },
  };

  useEffect(() => {
    const handleEmployee = async () => {
      const employees = await getDataWithToken(
        "http://localhost:3210/getAllEmp"
      );
      const attendances = await postDataWithToken(
        "http://localhost:3210/filterAttendance"
      );
      const leaves = await postDataWithToken(
        "http://localhost:3210/filterLeave"
      );
      console.log(leaves);
      setEmployee(employees?.data);
      setAttendance(attendances?.data);
      setLeave(leaves?.data);
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
        };
        const response = await postDataWithToken(
          "http://localhost:3210/filterAttendance",
          values
        );
        const yValue = response?.data?.length;
        const newFormateDate = date.toISOString().split("T")[0];
        dates.push({ x: newFormateDate, y: yValue });
      }
      setDates(dates);
    };
    handleEmployee();
  }, [isPunchedIn]);

  console.log(dates);
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
export default withAuth(Page);

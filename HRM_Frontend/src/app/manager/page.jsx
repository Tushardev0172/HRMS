"use client";
import React, { useEffect, useState } from "react";
import withAuth from "../withAuth";
import { HiUserGroup } from "react-icons/hi";
import { MdGroups } from "react-icons/md";
import {
  BsPersonFillCheck,
  BsPersonFillX,
  BsPersonFillExclamation,
} from "react-icons/bs";
import ReactApexChart from "react-apexcharts";
import { getDataWithToken, postDataWithToken } from "../requestConfig";
import { useUser } from "../userContext";
import Greeting from "../../../components/greeting";
import Card from "../../../components/card";
import Modal from "../../../components/Modal";
import UserProfile from "../../../components/UserProfile";

const Page = () => {
  const { isPunchedIn, userDetails } = useUser();
  const name = userDetails.first_name;
  const last_name = userDetails.last_name;
  const full_name = name + " " + last_name;

  const [employee, setEmployee] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleCardClick = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  const [attendance, setAttendance] = useState([]);
  const [leave, setLeave] = useState([]);
  const [dates, setDates] = useState([]);
  const stats = [
    {
      count: employee?.length,
      label: "Total Team",
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
      tickAmount: 6,
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
      const employeesResponse = await getDataWithToken(
        "http://localhost:3210/getAllEmp"
      );
      const attendancesResponse = await postDataWithToken(
        "http://localhost:3210/filterAttendance"
      );
      const leavesResponse = await postDataWithToken(
        "http://localhost:3210/filterLeave"
      );

      const employeesData = employeesResponse?.data || [];
      const attendancesData = attendancesResponse?.data || [];
      const leavesData = leavesResponse?.data || [];

      const filteredEmployees = employeesData.filter(
        (i) => i.manager === full_name
      );
      const filteredAttendances = attendancesData.filter(
        (i) => i.manager === full_name
      );
      const filteredLeaves = leavesData.filter((i) => i.manager === full_name);

      setEmployee(filteredEmployees);
      setAttendance(filteredAttendances);
      setLeave(filteredLeaves);

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
  }, [isPunchedIn, userDetails]);

  console.log(employee);

  return (
    <>
      <div className="bg-gray-100 min-h-screen px-8 py-5">
        <div className="flex flex-col md:flex-row justify-between mb-6 items-center">
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
        <div className="mt-8">
          <h1 className="text-2xl capitalize text-purple-800 mb-4 font-medium flex items-center gap-2">
            team <MdGroups className="text-4xl" />
          </h1>

          <div className="grid grid-cols-12 items-center gap-4 ">
            {employee.map((i) => (
              <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
                <Card
                  name={i.first_name + " " + i.last_name}
                  id={i._id}
                  email={i.email}
                  mobile={i.phone}
                  dob={i.dob}
                  jd={i.joiningDate}
                  role={i.role}
                  status={i.status}
                  gender={i.gender}
                  onClick={() => handleCardClick(i)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {showModal && (
        <Modal showModal={showModal} handleClose={closeModal}>
          {selectedEmployee && <UserProfile employee={selectedEmployee} />}
        </Modal>
      )}
    </>
  );
};

export default withAuth(Page);

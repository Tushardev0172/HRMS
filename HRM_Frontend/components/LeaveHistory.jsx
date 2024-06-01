"use client";
import React, { useState, useEffect } from "react";
import Button from "./Button";
import { postDataWithToken, getDataWithToken } from "@/app/requestConfig";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { getDataWithToken } from "@/app/requestConfig";
import "react-toastify/dist/ReactToastify.css";
import Table from "./Table2";
import { useUser } from "@/app/userContext";

const LeaveForm = () => {
  const user = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employee, setEmployee] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const initialValues = {
    startDate: "",
    endDate: "",
    user: "",
  };

  const validationSchema = Yup.object().shape({
    startDate: Yup.string().required("Start date is required"),
    endDate: Yup.string().required("End date is required"),
    user: Yup.string().required("User is required"),
  });

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${month}/${day}/${year}`;
  };

  const handleLeaveSubmit = async (values, { setSubmitting, reset }) => {
    const formattedValues = {
      ...values,
      startDate: formatDate(values.startDate),
      endDate: formatDate(values.endDate),
    };
    try {
      const response = await postDataWithToken(
        "http://localhost:3210/applyLeave",
        formattedValues
      );
      console.log(response);
      handleCloseModal();
      toast.success("Leave request submitted");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Some error occured");
    }
    setSubmitting(false);
    reset();
  };

  useEffect(() => {
    const handleAllEmployee = async () => {
      const response = await getDataWithToken(
        "http://localhost:3210/getAllEmp"
      );
      setEmployee(response.data?.reverse());
    };
    handleAllEmployee();
  }, []);

  const handleSearch = async (values, { setSubmitting, resetForm }) => {
    const { endDate, startDate, user } = values;
    const formattedValues = {
      endDate: formatDate(endDate),
      startDate: formatDate(startDate),
      user: user,
    };
    const response = await postDataWithToken(
      "http://localhost:3210/filterLeave",
      formattedValues
    );
    setLeaves(response.data?.reverse());
    resetForm();
    setSubmitting(false);
  };

  const handleEmpty = async () => {
    const values = initialValues;
    const response = await postDataWithToken(
      "http://localhost:3210/filterLeave",
      values
    );
    if (!response) {
      return;
    }
    setLeaves(response.data?.reverse());
  };

  useEffect(() => {
    handleEmpty();
  }, []);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between mb-4 items-center px-8 py-5">
        <h1 className="text-2xl text-purple-800 font-medium  mb-4 md:mb-0 md:mr-4">
          Leaves
        </h1>
        <Button onClick={handleOpenModal}>+ Add Leave</Button>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="flex flex-col md:flex-row items-center w-full md:w-auto">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) =>
              handleSearch(values, { setSubmitting, resetForm })
            }
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col md:flex-row items-center w-full md:w-auto">
                <Field
                  type="date"
                  name="startDate"
                  placeholder="MM/DD/YYYY"
                  className="mr-2 px-4 py-2 mb-2 md:mb-0 md:mr-0 w-full md:w-[18rem] border border-gray-300 rounded-[5px]"
                />
                <ErrorMessage
                  name="startDate"
                  component="div"
                  className="text-red-500 text-sm mb-2 md:mb-0 md:ml-4"
                />

                <Field
                  type="date"
                  name="endDate"
                  placeholder="MM/DD/YYYY"
                  className="mr-2 px-4 py-2 mb-2 md:mb-0 md:mr-0 w-full md:w-[18rem] border border-gray-300 rounded-[5px]"
                />
                <ErrorMessage
                  name="endDate"
                  component="div"
                  className="text-red-500 text-sm mb-2 md:mb-0 md:ml-4"
                />

                <Field
                  as="select"
                  name="user"
                  className="mr-2 px-4 py-2 mb-2 md:mb-0 md:mr-0 w-full md:w-[18rem] border border-gray-300 rounded-[5px]"
                >
                  <option value="">select a user</option>
                  {employee.map((i) => (
                    <option key={i.email}>{i.email}</option>
                  ))}
                </Field>
                <ErrorMessage
                  name="user"
                  component="div"
                  className="text-red-500 text-sm mb-2 md:mb-0 md:ml-4"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#F97316]  hover:bg-orange-600 text-white rounded md:ml-4"
                >
                  Search
                </button>
              </Form>
            )}
          </Formik>
          <button
            onClick={handleEmpty}
            className="px-4 py-2 mt-4 md:mt-0 bg-gray-200  hover:bg-gray-300 text-gray-700 rounded md:ml-2"
          >
            Reset
          </button>
        </div>
      </div>
      {!leaves ? "No records" : <Table users={leaves} />}

      {/* Modal */}
      <div
        className={`fixed z-[10000] inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 transition-opacity ${
          isModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="bg-white relative p-8 rounded-lg shadow-lg w-full md:max-w-xl transform transition-transform ease-in-out duration-300"
          style={{
            opacity: isModalOpen ? 1 : 0,
            transform: isModalOpen ? "translateY(0)" : "translateY(-50px)",
          }}
        >
          <span
            className="absolute top-0 right-3 p-2 cursor-pointer text-3xl"
            onClick={handleCloseModal}
          >
            &times;
          </span>
          <h2 className="text-2xl mb-4">Add Leave</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleLeaveSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <label htmlFor="startDate" className="mt-4 mb-2">
                  From
                </label>
                <Field
                  type="date"
                  name="startDate"
                  className="px-4 py-2 w-full border border-gray-300 rounded-[5px]"
                />
                <ErrorMessage
                  name="startDate"
                  component="div"
                  className="text-red-500 text-sm"
                />
                <label htmlFor="endDate" className="mt-4 mb-2">
                  To
                </label>
                <Field
                  type="date"
                  name="endDate"
                  className="px-4 py-2 w-full border border-gray-300 rounded-[5px]"
                />
                <ErrorMessage
                  name="endDate"
                  component="div"
                  className="text-red-500 text-sm"
                />
                <div className="mt-4 mb-2 flex items-center">
                  <label htmlFor="isHalfDay" className="mr-3">
                    Half Day
                  </label>
                  <Field type="checkbox" name="isHalfDay" className="w-4 h-4" />
                </div>

                <label htmlFor="message" className="mt-4 mb-2 block">
                  Leave Reason
                </label>
                <textarea
                  placeholder=""
                  name="message"
                  className="px-4 py-2 w-full border border-gray-300 rounded-[5px]"
                ></textarea>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn_orange mt-4"
                >
                  {isSubmitting ? "Sending request" : "Submit"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default LeaveForm;

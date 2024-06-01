"use client";
import React, { useState, useEffect } from "react";
import Button from "./Button";
import { postDataWithToken } from "@/app/requestConfig";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { getDataWithToken } from "@/app/requestConfig";
import "react-toastify/dist/ReactToastify.css";
import Table from "./Table2";
import { useUser } from "@/app/userContext";

const LeaveForm = () => {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employee, setEmployee] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const initialValues1 = {
    startDate: "",
    endDate: "",
    user: user.id,
    isHalfDay: false,
    message: "",
  };

  const validationSchema1 = Yup.object().shape({
    startDate: Yup.string().required("Start date is required"),
    endDate: Yup.string().required("End date is required"),
  });

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

  const handleLeaveSubmit = async (values, { setSubmitting, resetForm }) => {
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
      if (response.status == 0) {
        toast.info("Already on leave");
      } else if (response.status == 1) {
        toast.success("Leave request submitted");
      } else if (response.status == 2) {
        toast.error("Invalid Data submission");
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Some error occurred");
    }
    setSubmitting(false);
    resetForm();
  };

  const handleCheckboxChange = (e, setFieldValue) => {
    const isChecked = e.target.checked;
    setFieldValue("isHalfDay", isChecked);
    const today = new Date().toISOString().split("T")[0];
    if (isChecked) {
      setFieldValue("startDate", today);
      setFieldValue("endDate", today);
    } else {
      setFieldValue("startDate", "");
      setFieldValue("endDate", "");
    }
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
      {/* <Toast /> */}
      <div className="py-5 px-8">
        <div className="flex justify-between mb-4 items-center">
          <h1 className="text-2xl text-purple-800 font-medium ">Leaves</h1>
          <Button onClick={handleOpenModal}>+ Add Leave</Button>
        </div>

        <div className="mb-4">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) =>
              handleSearch(values, { setSubmitting, resetForm })
            }
          >
            {({ isSubmitting, resetForm }) => (
              <Form className="flex md:flex-row xs:flex-col gap-2">
                <div className="flex flex-row gap-2 xs:justify-center md:justify-start">
                  <div className="md:w-auto xs:w-full">
                    <Field
                      type="date"
                      name="startDate"
                      required
                      placeholder="MM/DD/YYYY"
                      className="px-4 py-2 md:w-auto xs:w-full border border-gray-300 rounded-[5px]"
                    />
                  </div>
                  <div className="md:w-auto xs:w-full">
                    <Field
                      type="date"
                      name="endDate"
                      required
                      placeholder="MM/DD/YYYY"
                      className="px-4 py-2 md:w-auto xs:w-full border border-gray-300 rounded-[5px]"
                    />
                  </div>
                </div>

                <div className="flex justify-center">
                  <Field
                    as="select"
                    name="user"
                    required
                    className="px-4 py-[9.2px] md:w-auto xs:w-full border border-gray-300 rounded-[5px]"
                  >
                    <option value="">Select a user</option>
                    {employee.map((i) => (
                      <option key={i.email}>{i.email}</option>
                    ))}
                  </Field>
                </div>

                <div className="flex flex-row gap-2 md:justify-start xs:justify-center items-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-[#F97316] hover:bg-orange-600 text-white rounded"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEmpty()}
                    className="px-4 py-2 bg-gray-200  hover:bg-gray-300 rounded"
                  >
                    Reset
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {!leaves ? "No records found!" : <Table users={leaves} />}

        {/* Modal */}
        <div
          className={`fixed z-[10000] inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 transition-opacity ${
            isModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className="bg-white relative p-8 rounded-lg shadow-lg w-3/4 md:max-w-xl transform transition-transform ease-in-out duration-300"
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
            <h2 className="text-2xl font-medium text-purple-800 mb-4">
              Add Leave
            </h2>
            <Formik
              initialValues={initialValues1}
              validationSchema={validationSchema1}
              onSubmit={handleLeaveSubmit}
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form>
                  <label htmlFor="startDate" className="mt-4 mb-2 font-medium">
                    From:
                  </label>
                  <Field
                    type="date"
                    name="startDate"
                    className="px-4 py-2 w-[100%] border border-gray-300 rounded-[5px]"
                  />
                  <ErrorMessage
                    name="startDate"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                  <label htmlFor="endDate" className="mt-4 mb-2 font-medium">
                    To
                  </label>
                  <Field
                    type="date"
                    name="endDate"
                    className="px-4 py-2 w-[100%] border border-gray-300 rounded-[5px]"
                  />
                  <ErrorMessage
                    name="endDate"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                  <div className="mt-4 mb-2 flex items-center">
                    <label htmlFor="isHalfDay" className="mr-3 font-medium">
                      Half Day
                    </label>
                    <Field
                      type="checkbox"
                      name="isHalfDay"
                      className="w-4 h-4"
                      onChange={(e) => handleCheckboxChange(e, setFieldValue)}
                    />
                  </div>

                  <label
                    htmlFor="message"
                    className="mt-4 mb-2 block font-medium"
                  >
                    Leave Reason
                  </label>
                  <Field
                    as="textarea"
                    name="message"
                    placeholder="Add comment"
                    className="px-4 py-2 w-[100%] border border-gray-300 rounded-[5px]"
                  />
                  <ErrorMessage
                    name="message"
                    component="div"
                    className="text-red-500 text-sm"
                  />

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
        </div>
      </div>
    </>
  );
};

export default LeaveForm;

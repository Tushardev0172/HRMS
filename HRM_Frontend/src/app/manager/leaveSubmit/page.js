"use client";
import React from "react";
import { postDataWithToken } from "@/app/requestConfig";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import withAuth from "@/app/withAuth";
import { useUser } from "@/app/userContext";

const Page = () => {
  const { user } = useUser();

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${month}/${day}/${year}`;
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

  return (
    <>
      <div className="px-8 py-5">
        <h2 className="text-2xl mb-4 text-purple-800 font-medium ">
          Add Leave
        </h2>
        <div className="py-8">
          <Formik
            initialValues={initialValues1}
            validationSchema={validationSchema1}
            onSubmit={handleLeaveSubmit}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form className="w-3/4">
                <label
                  htmlFor="startDate"
                  className="mt-4 mb-2 font-medium text-gray-700"
                >
                  From:
                </label>
                <Field
                  type="date"
                  name="startDate"
                  className="px-4 py-2 w-[100%] border border-gray-300 rounded-[5px] mb-6"
                />
                <ErrorMessage
                  name="startDate"
                  component="div"
                  className="text-red-500 text-sm"
                />
                <label
                  htmlFor="endDate"
                  className="  font-medium text-gray-700"
                >
                  To:
                </label>
                <Field
                  type="date"
                  name="endDate"
                  className="px-4 py-2 w-[100%] border border-gray-300 rounded-[5px] mb-4"
                />
                <ErrorMessage
                  name="endDate"
                  component="div"
                  className="text-red-500 text-sm"
                />
                <div className="mt-4 mb-2 flex items-center">
                  <label
                    htmlFor="isHalfDay"
                    className="mr-3 font-medium text-gray-700"
                  >
                    Half Day:
                  </label>
                  <Field
                    type="checkbox"
                    name="isHalfDay"
                    className="w-4 h-4 "
                    onChange={(e) => handleCheckboxChange(e, setFieldValue)}
                  />
                </div>

                <label
                  htmlFor="message"
                  className="mt-6 mb-2 block font-medium text-gray-700"
                >
                  Leave Reason:
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
    </>
  );
};

export default withAuth(Page);

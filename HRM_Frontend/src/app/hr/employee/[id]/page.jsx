"use client";
import withAuth from "@/app/withAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getDataWithToken, postDataWithToken } from "@/app/requestConfig";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import AddButton from "../../../../../components/AddButton";
import BackButton from "../../../../../components/backButton";
import Button from "../../../../../components/Button";

const Horm = ({ params }) => {
  const [manager, setManager] = useState([]);
  const [prevData, setPrevData] = useState([]);
  const [isLoading, setIsLoading] = useState([]);
  console.log(prevData);
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    dob: "",
    password: "",
    role: "",
    manager: "",
    phone: "",
    gender: "",
    address: {
      pinCode: "",
      city: "",
      country: "",
      streetAddress: "",
    },
    joiningDate: "",
    status: "",
    salary: "",
    allowances: "",
    overtimeRate: "",
    taxInformation: "",
    bankAccount: {
      accountNumber: "",
      bankName: "",
      accountIfsc: "",
    },
  };

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("First Name is required"),
    last_name: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    dob: Yup.date().nullable().required("Date of Birth is required"),
    password: Yup.string()
      .required("*mandatory field")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@%$#*?&]).+$/,
        "must contain at least a number, special character, uppercase letter, lowercase letter"
      )
      .min(8, "must be at least 8 characters long")
      .max(15, "not more than 15 characters."),
    address: Yup.object().shape({
      pinCode: Yup.string().required("Pin Code is required"),
      city: Yup.string().required("City is required"),
      country: Yup.string().required("Country is required"),
      streetAddress: Yup.string().required("Street Address is required"),
    }),
    role: Yup.string().required("Role is required"),
    manager: Yup.string().required("Manager is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Invalid phone number")
      .max(10)
      .required("Phone number is required"),
    gender: Yup.string().required("Gender is required"),
    joiningDate: Yup.date().nullable().required("Joining Date is required"),
    status: Yup.string().required("Status is required"),
    salary: Yup.number()
      .positive("Salary must be a positive number")
      .required("Salary is required"),
    bankAccount: Yup.object().shape({
      bankName: Yup.string().required("Bank Name is required"),
      accountNumber: Yup.string().required("Account Number is required"),
      accountIfsc: Yup.string().required("IFSC Code is required"),
    }),
    allowances: Yup.number()
      .positive("Allowances must be a positive number")
      .required("Allowances are required"),
    overtimeRate: Yup.number()
      .positive("Overtime rate must be a positive number")
      .required("Overtime rate is required"),
    taxInformation: Yup.string().required("Tax Information is required"),
  });

  const handleFormSubmit = async (values, { setSubmitting }) => {
    console.log(values);
    try {
      const data = await postDataWithToken(
        `http://localhost:3210/updateEmp/${params}`,
        values
      );
      console.log(data);
      alert("User Updated.");
      router.push("/hr/employee");
    } catch (error) {
      console.error("Error:", error);
    }
    setSubmitting(false);
  };

  useEffect(() => {
    const handle = async () => {
      const response = await getDataWithToken(
        "http://localhost:3210/getAllEmp"
      );
      if (!response) {
        return;
      }
      setManager(response.data);
    };
    handle();
  }, []);

  const handlePrevData = async (id) => {
    try {
      setIsLoading(true);
      const response = await getDataWithToken(
        `http://localhost:3210/getSingleEmp/${id}`
      );
      if (!response) {
        return;
      }
      setPrevData(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    handlePrevData(params);
  }, [params]);

  return (
    <>
      {isLoading ? (
        <>Loaddddddddddddddddddd</>
      ) : (
        <div className="bg-white shadow-md rounded  p-8 relative">
          <BackButton />
          <div className="flex justify-between my-6 items-center">
            <h1 className="font-bold text-lg mb-3 w-max text-orange-500">
              Update Employee
            </h1>
            <div className="text-orange-700">
              Step: {currentStep} / {totalSteps}
            </div>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleFormSubmit}
          >
            {({ isSubmitting }) => (
              <>
                {console.log(isSubmitting)}

                <Form className="mb-4">
                  {currentStep === 1 && (
                    <>
                      <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                          <label
                            htmlFor="first_name"
                            className="block text-gray-700 text-sm font-bold mb-2"
                          >
                            First Name:
                          </label>
                          <Field
                            type="text"
                            id="first_name"
                            name="first_name"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                          <ErrorMessage
                            name="first_name"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                        <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                          <label
                            htmlFor="last_name"
                            className="block text-gray-700 text-sm font-bold mb-2"
                          >
                            Last Name:
                          </label>
                          <Field
                            type="text"
                            id="last_name"
                            name="last_name"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                          <ErrorMessage
                            name="last_name"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                          <label
                            htmlFor="phone"
                            className="block text-gray-700 text-sm font-bold mb-2"
                          >
                            Phone:
                          </label>
                          <Field
                            type="tel"
                            id="phone"
                            name="phone"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                          <ErrorMessage
                            name="phone"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                          <label
                            htmlFor="gender"
                            className="block text-gray-700 text-sm font-bold mb-2"
                          >
                            Gender:
                          </label>
                          <Field
                            as="select"
                            id="gender"
                            name="gender"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </Field>
                          <ErrorMessage
                            name="gender"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3">
                          <label
                            htmlFor="email"
                            className="block text-gray-700 text-sm font-bold mb-2"
                          >
                            Email:
                          </label>
                          <Field
                            type="email"
                            id="email"
                            name="email"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                        <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                          <label
                            htmlFor="dob"
                            className="block text-gray-700 text-sm font-bold mb-2"
                          >
                            D.O.B:
                          </label>
                          <Field
                            type="date"
                            id="dob"
                            name="dob"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                          <ErrorMessage
                            name="dob"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <h1 className="mb-3 text-orange-500 border-b-2 border-orange-300">
                          Address
                        </h1>
                        <div className="flex flex-wrap -mx-3 mb-4">
                          <div className="w-full md:w-1/3 px-3 mb-4">
                            <label
                              htmlFor="address.pinCode"
                              className="block text-gray-700 text-sm font-bold mb-2"
                            >
                              Pin Code:
                            </label>
                            <Field
                              type="text"
                              id="address.pinCode"
                              name="address.pinCode"
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <ErrorMessage
                              name="address.pinCode"
                              component="div"
                              className="text-red-500 text-sm"
                            />
                          </div>
                          <div className="w-full md:w-1/3 px-3 mb-4">
                            <label
                              htmlFor="address.city"
                              className="block text-gray-700 text-sm font-bold mb-2"
                            >
                              City:
                            </label>
                            <Field
                              type="text"
                              id="address.city"
                              name="address.city"
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <ErrorMessage
                              name="address.city"
                              component="div"
                              className="text-red-500 text-sm"
                            />
                          </div>
                          <div className="w-full md:w-1/3 px-3 mb-4">
                            <label
                              htmlFor="address.country"
                              className="block text-gray-700 text-sm font-bold mb-2"
                            >
                              Country:
                            </label>
                            <Field
                              type="text"
                              id="address.country"
                              name="address.country"
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <ErrorMessage
                              name="address.country"
                              component="div"
                              className="text-red-500 text-sm"
                            />
                          </div>
                        </div>
                        <div className="w-full mb-4">
                          <label
                            htmlFor="address.streetAddress"
                            className="block text-gray-700 text-sm font-bold mb-2"
                          >
                            Street Address:
                          </label>
                          <Field
                            id="address.streetAddress"
                            name="address.streetAddress"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          ></Field>
                          <ErrorMessage
                            name="address.streetAddress"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {currentStep === 2 && (
                    <>
                      <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                          <label
                            htmlFor="joiningDate"
                            className="block text-gray-700 text-sm font-bold mb-2"
                          >
                            Joining Date:
                          </label>
                          <Field
                            type="date"
                            id="joiningDate"
                            name="joiningDate"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                          <ErrorMessage
                            name="joiningDate"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                        <div className="mb-4 w-full md:w-1/2 px-3 ">
                          <label
                            htmlFor="manager"
                            className="block text-gray-700 text-sm font-bold mb-2"
                          >
                            Manager:
                          </label>
                          <Field
                            as="select"
                            id="manager"
                            name="manager"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          >
                            <option value="">Select Manager</option>
                            {manager.map((item) => {
                              if (item.role == "MANAGER") {
                                return (
                                  <option
                                    key={item.id}
                                    value={`${item.first_name} ${item.last_name}`}
                                  >
                                    {`${item.first_name} ${item.last_name}`}
                                  </option>
                                );
                              }
                              return null;
                            })}
                          </Field>
                          <ErrorMessage
                            name="manager"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="status"
                          className="block text-gray-700 text-sm font-bold mb-2"
                        >
                          Status:
                        </label>
                        <Field
                          as="select"
                          id="status"
                          name="status"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                          <option value="">Select Status</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="other">Other</option>
                        </Field>
                        <ErrorMessage
                          name="status"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </>
                  )}
                  {currentStep === 3 && (
                    <>
                      <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                          <label
                            htmlFor="bankAccount.bankName"
                            className="block text-gray-700 text-sm font-bold mb-2"
                          >
                            Bank Name:
                          </label>
                          <Field
                            type="text"
                            id="bankAccount.bankName"
                            name="bankAccount.bankName"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                          <ErrorMessage
                            name="bankAccount.bankName"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                          <label
                            htmlFor="bankAccount.accountNumber"
                            className="block text-gray-700 text-sm font-bold mb-2"
                          >
                            Bank Account Number:
                          </label>
                          <Field
                            type="text"
                            id="bankAccount.accountNumber"
                            name="bankAccount.accountNumber"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                          <ErrorMessage
                            name="bankAccount.accountNumber"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="bankAccount.accountIfsc"
                          className="block text-gray-700 text-sm font-bold mb-2"
                        >
                          IFSC Code:
                        </label>
                        <Field
                          type="text"
                          id="bankAccount.accountIfsc"
                          name="bankAccount.accountIfsc"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        <ErrorMessage
                          name="bankAccount.accountIfsc"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </>
                  )}
                  {currentStep === 4 && (
                    <>
                      <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                          <label
                            htmlFor="salary"
                            className="block text-gray-700 text-sm font-bold mb-2"
                          >
                            Salary:
                          </label>
                          <Field
                            type="number"
                            id="salary"
                            name="salary"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                          <ErrorMessage
                            name="salary"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                          <label
                            htmlFor="allowances"
                            className="block text-gray-700 text-sm font-bold mb-2"
                          >
                            Allowances:
                          </label>
                          <Field
                            type="number"
                            id="allowances"
                            name="allowances"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                          <ErrorMessage
                            name="allowances"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                          <label
                            htmlFor="overtimeRate"
                            className="block text-gray-700 text-sm font-bold mb-2"
                          >
                            Overtime Rate:
                          </label>
                          <Field
                            type="number"
                            id="overtimeRate"
                            name="overtimeRate"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                          <ErrorMessage
                            name="overtimeRate"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                          <label
                            htmlFor="taxInformation"
                            className="block text-gray-700 text-sm font-bold mb-2"
                          >
                            Tax Information:
                          </label>
                          <Field
                            type="number"
                            id="taxInformation"
                            name="taxInformation"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                          <ErrorMessage
                            name="taxInformation"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {currentStep === 5 && (
                    <>
                      <div className="grid grid-cols-12 gap-6">
                        <div className="mb-4 col-span-6">
                          <label
                            htmlFor="email"
                            className="block text-gray-700 text-sm font-bold mb-2"
                          >
                            Email:
                          </label>
                          <Field
                            type="email"
                            id="email1"
                            name="email"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                        <div className="mb-4 col-span-6">
                          <label
                            htmlFor="password"
                            className="block text-gray-700 text-sm font-bold mb-2"
                          >
                            Password:
                          </label>
                          <Field
                            type="password"
                            id="password"
                            name="password"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="role"
                          className="block text-gray-700 text-sm font-bold mb-2"
                        >
                          Role:
                        </label>
                        <Field
                          as="select"
                          id="role"
                          name="role"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                          <option value="">Select Role</option>
                          <option value="HR">HR</option>
                          <option value="MANAGER">Manager</option>
                          <option value="EMPLOYEE">Employee</option>
                        </Field>
                        <ErrorMessage
                          name="role"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </>
                  )}

                  {/* Navigation buttons */}
                  <div className="flex justify-between mt-8">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="btn_blue px-3 py-2 text-sm rounded-xl"
                      >
                        Previous
                      </Button>
                    )}
                    {currentStep < totalSteps && (
                      <Button
                        type="button"
                        onClick={() => setCurrentStep(currentStep + 1)}
                        className="btn_orange px-3 py-2 text-sm rounded-xl"
                      >
                        Next
                      </Button>
                    )}
                    {currentStep === totalSteps && (
                      <AddButton
                        type="submit"
                        disabled={isSubmitting}
                        className={` text-white text-sm ${
                          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isSubmitting ? "Loading..." : "Update Employee"}
                      </AddButton>
                    )}
                  </div>
                </Form>
              </>
            )}
          </Formik>
        </div>
      )}
    </>
  );
};

export default withAuth(Horm);

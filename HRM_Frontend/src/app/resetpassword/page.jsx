"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BsEyeSlash, BsEye } from "react-icons/bs";
import { toast } from "react-toastify";
import Logo from "../../../components/logo";
import Link from "next/link";
import { postDataWithoutToken } from "../requestConfig";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("*mandatory field")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@%$#*?&]).+$/,
        "must contain at least a number, special character, uppercase letter, lowercase letter"
      )
      .min(8, "must be at least 8 characters long")
      .max(15, "not more than 15 characters."),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Please confirm your password"),
    otp: Yup.string().required("OTP is required"),
  });

  const router = useRouter();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const { otp, password } = values;
    try {
      const data = await postDataWithoutToken(
        "http://localhost:3210/resetEmp",
        { otp, password }
      );
      resetForm();
      setSubmitting(false);
      router.push("/login");
      toast.success("Password reset successful!");
    } catch (error) {
      toast.error("Incorrect OTP. Please try again.");
    }
  };

  return (
    <>
      <section className="bg-white min-h-screen xs:pt-28 md:pt-0">
        <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
          <section className="relative flex items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
            <img
              alt=""
              src="/reset_img.jpg"
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />
          </section>
          <main className="flex items-center justify-center px-4 sm:px-12 lg:col-span-7 lg:px-16 xl:col-span-6">
            <div className="flex-col items-center justify-center w-full max-w-md">
              <div className="relative block mb-8">{<Logo />}</div>
              <div className="w-full text-black">
                <h1 className="text-center font-semibold text-3xl mb-2">
                  Reset Password
                </h1>
                <p className="text-center mb-3">
                  Please Enter your new password to sign in!
                </p>
                <Formik
                  initialValues={{ password: "", confirmPassword: "", otp: "" }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form className="flex flex-col justify-between">
                      <div className="mb-5">
                        <Field
                          type="text"
                          name="otp"
                          maxLength={6}
                          placeholder="OTP"
                          className="bg-transparent border border-gray-500 outline-none text-xl rounded-[4px] p-2 w-full"
                        />
                        <ErrorMessage
                          name="otp"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                      <div className="mb-5">
                        <Field
                          type="password"
                          name="password"
                          placeholder="New Password"
                          className="bg-transparent border border-gray-500 outline-none text-xl rounded-[4px] p-2 w-full"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                      <div className="relative mb-5">
                        <Field
                          type={showPassword ? "text" : "password"}
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          className="bg-transparent border border-gray-500 outline-none text-xl rounded-[4px] p-2 w-full"
                        />
                        <span
                          style={{
                            position: "absolute",
                            right: "10px",
                            top: "12px",
                            cursor: "pointer",
                            fontSize: "1.4rem",
                          }}
                          className="text-gray-500"
                          onClick={handlePasswordToggle}
                        >
                          {showPassword ? <BsEye /> : <BsEyeSlash />}{" "}
                        </span>
                        <ErrorMessage
                          name="confirmPassword"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="p-3 rounded-[4px] text-white bg-[#F95103] text-xl mt-5 mb-2"
                      >
                        {isSubmitting ? "Resetting..." : "Reset Password"}
                      </button>
                      <div className="flex justify-between items-center">
                        <Link
                          href="/login"
                          className="capitalize text-blue-500"
                        >
                          Sign In
                        </Link>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </main>
        </div>
      </section>
    </>
  );
};

export default ResetPassword;

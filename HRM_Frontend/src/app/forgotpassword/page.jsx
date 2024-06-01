"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Logo from "../../../components/logo";
import { postDataWithoutToken } from "../requestConfig";
import Link from "next/link";

const Forgot = () => {
  const [user, setUser] = useState({
    email: "",
  });
  const router = useRouter();
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const { email } = values;
      const data = await postDataWithoutToken(
        "http://localhost:3210/forgotEmp",
        { email }
      );
      console.log(data);
      resetForm();
      setSubmitting(false);
      if (data.length !== 0) {
        router.push("/resetpassword");
        toast.success("OTP Sent on your Email");
      }
    } catch (error) {
      console.log(error);
      toast.error("Account not Found");
    }
  };

  return (
    <>
      <section className="bg-white min-h-screen xs:pt-28 md:pt-0">
        <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
          <section className="relative flex items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
            <img
              alt=""
              src="/forgot_img.jpg"
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />
          </section>
          <main className="flex items-center justify-center px-4 sm:px-12 lg:col-span-7 lg:px-16 xl:col-span-6">
            <div className="flex-col items-center justify-center w-full max-w-md">
              <div className="relative block mb-8">{<Logo />}</div>
              <div className="w-full text-black">
                <h1 className="text-center font-semibold text-3xl mb-2">
                  Forgot Password
                </h1>
                <p className="text-center mb-3">
                  Enter your email to forgot your password!
                </p>
                <Formik
                  initialValues={user}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form className="flex flex-col justify-between">
                      <Field
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="bg-transparent border border-gray-500 outline-none text-xl rounded-[4px] p-2 mb-2"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500"
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="p-3 rounded-[4px] text-white bg-[#F95103] text-xl mt-5 mb-2"
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
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

export default Forgot;

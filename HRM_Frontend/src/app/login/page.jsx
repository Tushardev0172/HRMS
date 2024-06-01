"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BsEyeSlash, BsEye } from "react-icons/bs";
import { toast } from "react-toastify";
import Toast from "../../../components/toast/toast";
import Logo from "../../../components/logo";
import withAuth from "../withAuth";
import { useCookies } from "react-cookie";

const Login = () => {
  const [cookies, setCookie] = useCookies(["token"]);
  const [Token, setToken] = useState("");
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .required("*mandatory field")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@%$#*?&]).+$/,
        "must contain at least a number, special character, uppercase letter, lowercase letter"
      )
      .min(8, "must be at least 8 characters long")
      .max(15, "not more than 15 characters."),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const { email, password } = values;
    try {
      const data = await axios.post("http://localhost:3210/login", {
        email,
        password,
      });
      setToken(data.data.token);
      resetForm();
      setSubmitting(false);
      toast.success("Login successful!");
    } catch (error) {
      toast.error("Incorrect email or password. Please try again.");
    }
  };
  useEffect(() => {
    if (Token) {
      setCookie("token", Token, { path: "/", maxAge: 43200 }); // valid for 12 hours
    }
  }, [Token, setCookie]);
  return (
    <>
      {/* <Toast /> */}
      <section className="bg-white min-h-screen xs:pt-28 md:pt-0">
        <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
          <section className="relative flex items-end lg:col-span-5 lg:h-full xl:col-span-6">
            <img
              alt=""
              src="/login_img.svg"
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />
          </section>
          <main className="flex items-center justify-center px-4 sm:px-12 lg:col-span-7 lg:px-16 xl:col-span-6">
            <div className="flex-col items-center justify-center w-full max-w-md">
              <div className="relative block mb-8">
                {<Logo />}
              </div>

              <div className="w-full text-black">
                <h1 className="text-center text-3xl font-semibold mb-2">
                  Sign In
                </h1>
                <p className="text-center mb-3">
                  Enter your email and password to sign in!
                </p>
                <Formik
                  initialValues={user}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form className="flex flex-col justify-between">
                      <div className="mb-5">
                        <Field
                          type="email"
                          name="email"
                          placeholder="Email"
                          className="bg-transparent border border-gray-500 outline-none text-xl rounded-[4px] p-2 w-full"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                      <div className="relative mb-5">
                        <Field
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Password"
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
                          {showPassword ? (
                            <BsEye onClick={setShowPassword} />
                          ) : (
                            <BsEyeSlash onClick={setShowPassword} />
                          )}{" "}
                        </span>
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="p-3 rounded-[4px] text-white bg-[#F95103] hover:bg-orange-600 text-xl mt-5 mb-2"
                      >
                        {isSubmitting ? "Signing in..." : "Sign In"}
                      </button>
                      <div className="flex justify-between items-center">
                        <Link href="/forgotpassword" className="capitalize text-blue-500">
                          forgot password ?
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

export default withAuth(Login);

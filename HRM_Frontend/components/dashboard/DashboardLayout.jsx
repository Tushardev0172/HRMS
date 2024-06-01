"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Navbar from "../header";

const DashboardLayout = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = cookies.token;
    setIsLoggedIn(!!token);
  }, [cookies.token]);

  return (
    <>
      <div className="flex flex-1 flex-col bg-[#fafafa] min-h-screen relative">
        {isLoggedIn ? (
          <>
            {" "}
            <Navbar />
            <div className="lg:ml-[16.5%]">{children}</div>
          </>
        ) : (
          <div>{children}</div>
        )}
      </div>
    </>
  );
};

export default DashboardLayout;

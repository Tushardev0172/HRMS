"use client";
import Attendance from "../../../../components/Attendance";
import withAuth from "../../withAuth";

const Page = () => {
  return (
    <div>
      <Attendance />
    </div>
  );
};
export default withAuth(Page);

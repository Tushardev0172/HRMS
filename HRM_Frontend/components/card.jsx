import React from "react";
import { BsPersonFillCheck } from "react-icons/bs";

const Card = ({ name, email, mobile, dob, onClick }) => {
  return (
    <div
      className=" rounded-xl flex items-start pl-6 justify-center bg-white flex-col gap-2 py-6 cursor-pointer border hover:border-gray-400"
      onClick={onClick}
    >
      <BsPersonFillCheck className="text-3xl text-orange-500" />
      <h3 className="text-xl font-medium capitalize">{name}</h3>
      <p className="text-md">{email}</p>
      <p className="text-md">{mobile}</p>
    </div>
  );
};

export default Card;

"use client";
import React from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="btn_red px-3 py-2 text-sm rounded-xl"
    >
      <IoMdArrowBack className="text-xl" />
    </button>
  );
};

export default BackButton;

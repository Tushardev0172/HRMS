"use client";
import { useState } from "react";

const PunchClock = () => {
  const [punchedIn, setPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState(null);
  const [punchOutTime, setPunchOutTime] = useState(null);

  const handlePunch = () => {
    if (!punchedIn) {
      const currentTime = new Date().toLocaleString();
      setPunchInTime(currentTime);
      setPunchedIn(true);
    } else {
      const currentTime = new Date().toLocaleString();
      setPunchOutTime(currentTime);
      setPunchedIn(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">
          {punchedIn ? "Punched In" : "Punched Out"}
        </h1>
        {punchedIn ? (
          <div>
            <p>Punch In Time: {punchInTime}</p>
            <button
              onClick={handlePunch}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Punch Out
            </button>
          </div>
        ) : (
          <button
            onClick={handlePunch}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Punch In
          </button>
        )}
      </div>
    </div>
  );
};

export default PunchClock;

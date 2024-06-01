import React from "react";

const Greeting = ({ name }) => {
  const currentHour = new Date().getHours();
  let greeting;
  if (currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }
  return (
    <div>
      <p>
        {greeting}, <span className="capitalize ">{name}</span>
      </p>
    </div>
  );
};
export default Greeting;

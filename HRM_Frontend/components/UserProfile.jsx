import React from "react";

const UserProfile = ({ employee }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 capitalize">{`${employee.first_name} ${employee.last_name}`}</h2>
      <div className="text-lg">
        <p>
          <span className="font-medium">Email: </span> {employee.email}
        </p>
        <p>
          <span className="font-medium">Mobile: </span> {employee.phone}
        </p>
        <p>
          <span className="font-medium">Date of Birth: </span> {employee.dob}
        </p>
        <p>
          <span className="font-medium">Role: </span> {employee.role}
        </p>
        <p>
          <span className="font-medium">Status: </span> {employee.status}
        </p>
        <p>
          <span className="font-medium">Gender: </span> {employee.gender}
        </p>
      </div>
    </div>
  );
};

export default UserProfile;

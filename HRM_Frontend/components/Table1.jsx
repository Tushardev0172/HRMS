/// attendance table
import { useState } from "react";

const Table = ({ users }) => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  console.log(users);

  return (
    <>
      <div className="overflow-x-auto  ">
        <table className="table-auto min-w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="px-4 py-2 bg-gray-200 text-gray-600 border border-x-0 border-gray-300 sticky left-0">
                Username
              </th>
              <th className="px-4 py-2 bg-gray-200 text-gray-600 border border-gray-300 border-x-0">
                Employee ID
              </th>
              <th className="px-4 py-2 bg-gray-200 text-gray-600 border border-gray-300 border-x-0">
                Email
              </th>
              <th className="px-4 py-2 bg-gray-200 text-gray-600 border border-gray-300 border-x-0">
                Attendance Type
              </th>
              <th className="px-4 py-2 bg-gray-200 text-gray-600 border border-gray-300 border-x-0">
                Date
              </th>
              <th className="px-4 py-2 bg-gray-200 text-gray-600 border border-gray-300 border-x-0">
                In Time
              </th>
              <th className="px-4 py-2 bg-gray-200 text-gray-600 border border-gray-300 border-x-0">
                Out Time
              </th>
              <th className="px-4 py-2 bg-gray-200 text-gray-600 border border-gray-300 border-x-0">
                Total Hours
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((user, index) => {
              const attendanceDate = user.date ? user.date.split("T")[0] : "";
              if (attendanceDate) {
                const parts = attendanceDate.split("-");
                if (parts.length === 3) {
                  var date = parts.reverse().join("/");
                } else {
                  console.error("Invalid date format:", user.date);
                }
              }
              return (
                <tr
                  key={user._id}
                  className={index % 2 === 0 ? "bg-gray-100 text-left" : ""}
                >
                  <td className="px-4 py-2 border border-gray-300 capitalize sticky left-0 bg-gray-100 border-x-0">
                    {user.user.first_name + " " + user.user.last_name}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 border-x-0">
                    {user.user._id}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 border-x-0">
                    {user.user.email}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 border-x-0">
                    {user.attendenceType}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 border-x-0">
                    {date}
                  </td>

                  <td className="px-4 py-2 border border-gray-300 border-x-0">
                    {user.checkInTime}
                  </td>

                  <td className="px-4 py-2 border border-gray-300 border-x-0">
                    {user.checkOutTime}
                  </td>

                  <td className="px-4 py-2 border border-gray-300 border-x-0">
                    {user.totalHours}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tbody></tbody>
        </table>
      </div>
      <div className="pagination pt-4 flex flex-row gap-2 justify-center">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`px-3 py-[6px] rounded-full text-sm ${
              currentPage === i + 1
                ? "bg-orange-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-500 hover:text-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </>
  );
};

export default Table;

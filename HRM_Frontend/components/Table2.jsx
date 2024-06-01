///Leave tables
import { useState } from "react";

const Table = ({ users }) => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(users.length / itemsPerPage);

  return (
    <>
      <div className="overflow-x-auto ">
        <table className="table-auto min-w-full border-collapse">
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
                Half-day
              </th>
              <th className="px-4 py-2 bg-gray-200 text-gray-600 border border-gray-300 border-x-0">
                Status
              </th>
              <th className="px-4 py-2 bg-gray-200 text-gray-600 border border-gray-300 border-x-0">
                Start Date
              </th>
              <th className="px-4 py-2 bg-gray-200 text-gray-600 border border-gray-300 border-x-0">
                End Date
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((user, index) => {
              const formatDate = (dates) => {
                const attendanceDate = dates ? dates.split("T")[0] : "";
                if (attendanceDate) {
                  const parts = attendanceDate.split("-");
                  if (parts.length === 3) {
                    var date = parts.reverse().join("/");
                  } else {
                    console.error("Invalid date format:", user.date);
                  }
                }
                return date;
              };

              return (
                <tr
                  key={user._id}
                  className={index % 2 === 0 ? "bg-gray-100" : ""}
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
                    {user.isHalfDay == false ? "No" : "Yes"}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 border-x-0">
                    {user.status}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 border-x-0">
                    {formatDate(user.startDate)}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 border-x-0">
                    {formatDate(user.endDate)}
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

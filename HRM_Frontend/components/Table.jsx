"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

const Table = ({ users }) => {
  const router = useRouter();

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(users.length / itemsPerPage);

  return (
    <>
      <div className="overflow-x-auto relative">
        <table className="table-auto min-w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="px-4 py-2 bg-gray-200 text-gray-600 border border-x-0 border-gray-300 sticky left-0">
                Username
              </th>
              <th className="px-4 py-2 bg-gray-200 text-gray-600 border border-x-0 border-gray-300">
                Employee ID
              </th>
              <th className="px-4 py-2 bg-gray-200 text-gray-600 border border-x-0 border-gray-300">
                Email
              </th>
              <th className="px-4 py-2 bg-gray-200 text-gray-600 border border-x-0 border-gray-300">
                Mobile
              </th>
              <th className="px-4 py-2 bg-gray-200 text-gray-600 border border-x-0 border-gray-300">
                Join Date
              </th>
              <th className="px-4 py-2 bg-gray-200 text-gray-600 border border-x-0 border-gray-300">
                Role
              </th>
              <th className="px-4 py-2 bg-gray-200 text-gray-600 border border-x-0 border-gray-300 text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {currentItems.map((user, index) => {
              const joinDate = user.joiningDate
                ? user.joiningDate.split("T")[0]
                : "";
              if (joinDate) {
                const parts = joinDate.split("-");
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
                    {user.first_name + " " + user.last_name}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 border-x-0">
                    {user._id}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 border-x-0">
                    {user.email}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 border-x-0">
                    {user.phone}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 border-x-0">
                    {date}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 border-x-0">
                    {user.role}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 text-left border-x-0">
                    <div className="flex flex-row gap-2 justify-center border-x-0">
                      <button
                        onClick={() => router.push(`/hr/employee/${user._id}`)}
                      >
                        <MdModeEdit className="text-gray-500" />
                      </button>

                      <button>
                        <MdDelete className="text-gray-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
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

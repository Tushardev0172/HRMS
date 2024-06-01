import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { IoClose } from "react-icons/io5";

const Modal = ({
  showModal,
  handleClose,
  title,
  children,
  showLogoutButton,
  handleLogout,
}) => {
  const modalRef = useRef();

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div
            ref={modalRef}
            className="bg-white p-6 rounded shadow-lg lg:w-1/3 xs:w-2/3 relative"
          >
            <h2 className="text-2xl text-purple-800 font-semibold mb-4">
              {title}
            </h2>
            <IoClose
              className="absolute top-2 right-2 text-gray-600 cursor-pointer text-2xl"
              onClick={handleClose}
            />
            <div>{children}</div>
            <div className="flex justify-end mt-4">
              {showLogoutButton && (
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 transition-all text-white px-4 py-2 rounded mr-2"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

Modal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  showLogoutButton: PropTypes.bool,
  handleLogout: PropTypes.func,
};

Modal.defaultProps = {
  showLogoutButton: false,
};

export default Modal;

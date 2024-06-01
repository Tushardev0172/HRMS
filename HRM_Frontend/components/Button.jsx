const Button = ({ children, ...props }) => (
  <button
    className=" bg-orange-500 text-white shadow-md hover:shadow-sm duration-300 disabled:bg-opacity-70 disabled:cursor-not-allowed shadow-orange-500 px-5 py-1.5 rounded"
    {...props}
  >
    {children}
  </button>
);

export default Button;

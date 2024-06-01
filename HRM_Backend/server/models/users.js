const mongoose = require("mongoose")
const empSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, "Employee First Name is required."],
  },
  last_name: {
    type: String,
  },
  dob: {
    type: String,
    required: [true, "DOB is required."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: [true, "Email already exists"],
  },
  password: {
    type: String,
    required: [true, "Password is required."],
  },
  image: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["HR", "EMPLOYEE", "MANAGER"],
    default: "EMPLOYEE",
  },
  manager: {
    type: String,
    required: [true, "manager is required"]
  },
  phone: {
    type: String,
    required: [true, "Phone is required."],
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  address: {
    pinCode: {
      type: String,
      required: [true, "pincode required"],
    },
    city: {
      type: String,
      required: [true, "City name required"],
    },
    country: {
      type: String,
      required: [true, "Country name is required."],
    },
    streetAddress: {
      type: String,
      required: [true, "Address is required"],
    },
  },
  joiningDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "on leave", "terminated", "other"],
    default: "active",
  },
  inactiveDate: {
    type: Date,
  },
  terminatedDate: {
    type: Date,
  },
  salary: {
    type: Number,
    required: [true, "Salary is required and must be a numerical value."],
  },
  allowances: {
    type: Number,
    required: [true, "Allowances is required and must be a numerical value."],
  },
  overtimeRate: {
    type: Number,
    default: 500,
  },
  taxInformation: {
    type: String,
  },
  bankAccount: {
    accountNumber: {
      type: String,
      required: [true, "Bank account number is required."],
    },
    accountIfsc: {
      type: String,
      required: [true, "Bank's IFSC code required"],
    },
    bankName: {
      type: String,
      required: [true, "Bank name is required."],
    },
  },
  verifyOtp: String,
  verifyOtpExpiry: Date
},
  { timestamps: true });
const User = mongoose.models?.employee || mongoose.model("employee", empSchema);
module.exports = User;
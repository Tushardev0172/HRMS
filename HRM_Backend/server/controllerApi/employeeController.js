const User = require("../models/users")
const bcrypt = require("bcrypt")
const sendEmail = require("../helper/mailer")
const jwt = require("jsonwebtoken")

const createEmployee = async (req, res) => {
  try {

    const {
      first_name,
      last_name,
      dob,
      email,
      password,
      role,
      manager,
      phone,
      gender,
      address,
      joiningDate,
      status,
      inactiveDate,
      terminatedDate,
      salary,
      allowances,
      overtimeRate,
      taxInformation,
      bankAccount,
    } = await req.body;

    if (!password) {
      return res.status(400).json({ meassge: "User password is not set." });
    }

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({ meassge: "user already exists" });
    }


    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      first_name,
      last_name,
      dob,
      email,
      password: hashPassword,
      role,
      manager,
      phone,
      gender,
      address,
      joiningDate,
      status,
      inactiveDate,
      terminatedDate,
      salary,
      allowances,
      overtimeRate,
      taxInformation,
      bankAccount,
    });
    return res.status(200).json({ success: true, meassge: "user created", data: user });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ meassge: "Uncaught error", error });
  }

}

const getAllEmployee = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    console.log(error, "error in fetching users");
    return res.status(500).json({ message: "error in fetching users" });
  }
};

const getSingleEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const users = await User.findById({ _id: id });

    res.status(200).json({ data: users });
  } catch (error) {
    console.log(error, "error in fetching users");
    res.status(500).json({ message: "Error while Fetching Users.", error: error });
  }
};


const forgotEmployee = async (req, res) => {
  try {

    const { email } = await req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "no user with this email found" });
    }
    await sendEmail({ email, userId: user._id });
    return res.status(200).json({ message: "user found please check your email", success: true, user });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error in finding the details" });
  }
}

const loginEmployee = async (req, res) => {
  try {

    const { email, password } = await req.body;
    const user = await User.findOne({ email });

    if (!user || user.status == "inactive") {
      return res.status(400).json({ message: "user not found" });
    }

    const validatePassword = await bcrypt.compare(password, user.password);

    if (!validatePassword) {
      return res.status(400).json({ message: "Wrong Password" });
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.SECRET_KEY, { expiresIn: "12h" })

    if (!token) {
      return res.status(400).json({ message: "error in creating token" });
    }
    return res.status(200).json({ message: "successful login", success: true, data: user, token: token })

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error in finding the details" });
  }
}

const resetEmployee = async (req, res) => {
  try {
    const reqBody = await req.body;
    const { otp, password } = reqBody;
    const user = await User.findOne({ verifyOtp: otp, verifyOtpExpiry: { $gt: Date.now() } })
    if (!user) {
      return res.status(400).json({ message: "Invalid otp or otp time is expired" });
    }

    const prevPass = await bcrypt.compare(password, user.password);
    if (prevPass) {
      return res.status(400).json({ message: "Password must be different from previous password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    if (!hashPassword) {
      return res.status(400).json({ message: "Error in generating password" });
    }

    user.password = hashPassword;
    await user.save();
    return res.status(200).json({ message: "Password reset successfully", success: true });
  } catch (error) {
    return res.status(500).json({ error: "error in connecting", error });
  }
}

const deleteEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(400).json({ message: "No user with the provided ID was found." });
    }
    return res.status(200).json({ message: "User Deleted Successfully", data: deletedUser });
  } catch (error) {
    console.log(error, "error during the user deletion");
    return res.status(500).json({ message: "uncaught error", error: error });
  }
};


const updateEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      first_name,
      last_name,
      dob,
      email,
      password,
      role,
      manager,
      phone,
      gender,
      address,
      department,
      joiningDate,
      status,
      inactiveDate,
      terminatedDate,
      salary,
      allowances,
      overtimeRate,
      taxInformation,
      bankAccount,

    } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.findByIdAndUpdate(id, {
      $set: {
        first_name,
        last_name,
        dob,
        email,
        password: hashedPassword,
        role,
        manager,
        phone,
        gender,
        address,
        department,
        joiningDate,
        status,
        inactiveDate,
        terminatedDate,
        salary,
        allowances,
        overtimeRate,
        taxInformation,
        bankAccount,
      },
      new: true,
    });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No user with given ID was found." });
    }
    res.status(200).json({ data: user, message: "User Updated Successfully" });
  } catch (error) {
    console.log(error, "error in updating user");
    res.status(400).json({ error: error, message: "Failed to update user" });
  }
};


module.exports = {
  createEmployee,
  getAllEmployee,
  forgotEmployee,
  loginEmployee,
  resetEmployee,
  deleteEmployee,
  getSingleEmployee,
  updateEmployee
}
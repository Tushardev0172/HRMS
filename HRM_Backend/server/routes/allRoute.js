const express = require("express")
const router = express.Router()
const Attendence = require("../controllerApi/attendanceController")
const Leave = require("../controllerApi/leaveController")
const Employee = require("../controllerApi/employeeController")
const Token = require("../middleware/middleware")

// Attendance routes
router.post("/attendance",Token.tokenAuth,Attendence.markAttendance);
router.post("/filterAttendance",Token.tokenAuth,Attendence.filterAttendance);


//Leave routes
router.post("/applyLeave",Token.tokenAuth,Leave.applyLeave);
router.get("/allLeave",Token.tokenAuth,Leave.allLeave);
router.post("/acceptLeave",Token.tokenAuth,Leave.acceptLeave);
router.post("/filterLeave",Token.tokenAuth,Leave.filterLeave);


//employee routes
router.post("/login",Employee.loginEmployee);
router.post("/createEmp",Token.tokenAuth,Employee.createEmployee);
router.get("/getAllEmp",Token.tokenAuth,Employee.getAllEmployee);
router.get("/getSingleEmp/:id",Token.tokenAuth,Employee.getSingleEmployee);
router.post("/forgotEmp",Employee.forgotEmployee);
router.post("/resetEmp",Employee.resetEmployee);
router.delete("/deleteEmp/:id",Token.tokenAuth,Employee.deleteEmployee);
router.post("/updateEmp/:id",Token.tokenAuth,Employee.updateEmployee);

module.exports = router;
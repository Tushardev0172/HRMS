const Leave = require("../models/leave")
const moment = require("moment");
const Attendance = require("../models/attendance")
const User = require("../models/users")

const applyLeave = async (req, res) => {
    try {
        const { startDate, endDate, message, user, isHalfDay } = await req.body;
        const newStartDate = moment(startDate, "MM/DD/YYYY").format("YYYY-MM-DD");
        const newEndDate = moment(endDate, "MM/DD/YYYY").format("YYYY-MM-DD");

        const actualDate = moment().format("YYYY-MM-DD");

        if (actualDate > newStartDate || actualDate > newEndDate) {
            return res.status(200).json({status:2,message: "Invalid Date! You can only apply for future dates." });
        }

        if (user && isHalfDay) {
            const newStartDate = actualDate;
            const newEndDate = actualDate;
            const newHalfDayLeave = await Leave.findOne({
                user,
                startDate: newStartDate,
                endDate: newEndDate,
                isHalfDay: true
            });

            if (newHalfDayLeave) {
                return res.status(200).json({status:0, message: "Already on half-day leave" });
            }

            const halfDayLeave = await Leave.create({
                user,
                startDate: newStartDate,
                endDate: newEndDate,
                message,
                isHalfDay: true
            });

            return res.status(200).json({status:1, message: "Half-day leave request submitted successfully", data: halfDayLeave });
        }



        if (user && startDate && endDate) {

            const existingLeave = await Leave.findOne({
                user,
                startDate: newStartDate,
                endDate: newEndDate,
            });

            if (existingLeave) {
                return res.status(200).json({status:0, message: "Already on leave" });
            }
            const leave = await Leave.create({
                user,
                startDate: newStartDate,
                endDate: newEndDate,
                message: message,
            });
            return res.status(200).json({status:1, message: "Leave request submitted successfully", data: leave });
        }
        else {
            return res.status(400).json({status:2, message: "Invalid data submission" });
        }
    } catch (error) {
        console.log("error :", error);
        return res.status(500).json({status:2, message: "Error in Adding Leave" });
    }
}

const allLeave = async (req, res) => {
    try {
        const users = await Leave.find({}).populate("user", "first_name last_name email manager");
        if (!users) {
            return res.status(200).json({ message: "no leaves found" });
        }
        return res.status(200).json({ message: "Leaves found", count: users.length, data: users });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "error in fetching leave requests" });
    }
}

const acceptLeave = async (req, res) => {
    try {
        // id leave ki unique id hai naki user wali and response me true ya false bhejna hai
        const { id, user, response } = await req.body;

        const leaveFound = await Leave.findOne({ _id: id, status: "Pending" }).populate("user", "first_name last_name email");
        if (!leaveFound) {
            return res.status(200).json({status:2, message: "No leave request found for this user" });
        }

        if (leaveFound && response) {
            const startDate = leaveFound.startDate;
            const endDate = leaveFound.endDate;
            const currentDate = moment(startDate)
            const formattedDate = moment(currentDate).format("YYYY-MM-DD");
            if (leaveFound.isHalfDay == true) {
                const checkAttendance = await Attendance.find({ user, date: formattedDate });
                if (!checkAttendance) {
                    return res.status(200).json({ message: "You have already marked attendance" });
                }
                const attendance = await Attendance.create({
                    user,
                    date: formattedDate,
                    attendenceType: "Half Day",
                });
            }
            else {
                for (let currentDate = moment(startDate); currentDate.isSameOrBefore(endDate); currentDate.add(1, "days")) {
                    const formattedDate = moment(currentDate).format("YYYY-MM-DD");

                    const checkAttendance = await Attendance.find({ user, date: formattedDate });
                    if (!checkAttendance) {
                        return res.status(200).json({ message: "You have already marked attendance" });
                    }

                    const attendance = await Attendance.create({
                        user,
                        date: formattedDate,
                        attendenceType: "Leave",
                    });
                }
            }
            leaveFound.status = "Accepted"
            await leaveFound.save();
            return res.status(200).json({status:1, message: "leave accepted", data: leaveFound });
        }
        else {
            leaveFound.status = "Rejected"
            await leaveFound.save();
            return res.status(200).json({status:0, message: "leave rejected", data: leaveFound });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Uncaught error" });
    }
}

const filterLeave = async (req, res) => {
    try {
        const { startDate, endDate, user } = await req.body;
        const todaysDate = moment().format("YYYY-MM-DD");

        if (user) {
            var emp = await User.findOne({ email: user });
            var emp_Id = await emp._id;
        }

        if (user && startDate && endDate) {
            const appliedLeaves = await Leave.find({
                user: emp_Id,
                $or: [
                    // Leave starts within the given range
                    { startDate: { $gte: startDate, $lte: endDate } },
                    // Leave ends within the given range
                    { endDate: { $gte: startDate, $lte: endDate } },
                    // Leave spans over the entire given range
                    { startDate: { $lte: startDate }, endDate: { $gte: endDate } }
                ]
            })
            if (appliedLeaves.length === 0) {
                return res.status(200).json({ message: "No record found" });
            }
            return res.status(200).json({ message: "Leaves founded", count: appliedLeaves.length, data: appliedLeaves });
        }

        const onLeaveToday = await Leave.find({
            $or: [
                // Start date is before or equal to today and end date is after or equal to today
                { startDate: { $lte: todaysDate }, endDate: { $gte: todaysDate } },
                // Single day leave on today's date
                { startDate: todaysDate, endDate: todaysDate }
            ]
        }).populate("user", "first_name last_name email")
        if (onLeaveToday.length === 0) {
            return res.status(200).json({data:onLeaveToday, message: "No one on leave today" });
        }
        return res.status(200).json({ message: "On leave today", count: onLeaveToday.length, data: onLeaveToday });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "error in finding Leave" });
    }
}


module.exports = {
    applyLeave,
    allLeave,
    acceptLeave,
    filterLeave
}
const Attendance = require("../models/attendance")
const moment = require("moment");
const User = require("../models/users")
const markAttendance = async (req, res) => {
    try {
        //from frontend format of date must be MM/DD/YYYY

        const { user, date, attendenceType } = req.body;
        const actualDate = moment(date, "MM/DD/YYYY").format("YYYY-MM-DD");

        // to mark attendance for users as weekend on saturdays and sundays.

        // const users = await User.find({});
        // if (users) {
        //     for (let users of users) {
        //         const isWeekend = moment(actualDate).isoWeekday() === 6 || moment(actualDate).isoWeekday() === 7;
        //         if (isWeekend) {
        //             const markedAttendance = await Attendance.create({
        //                 user,
        //                 date: actualDate,
        //                 attendenceType: "Weekend"
        //             });
        //             await markedAttendance.save();
        //         }

        //     }
        //     return res.status(200).json({success: true, message: "Weekends marked as weekend for all users" });
        // }

        if (actualDate == moment().format("YYYY-MM-DD")) {

            const CheckAttendance = await Attendance.findOne({ date: actualDate, user });

            if (CheckAttendance) {
                if (CheckAttendance.attendenceType == "Leave") {
                    return res.status(200).json({ status:3,success: true, message: "on leave for today" });
                }
                if (CheckAttendance.attendenceType !== "Absent") {
                    if (!CheckAttendance.checkOutTime) {
                        CheckAttendance.checkOutTime = moment().format("h:mm:ss a");
                        const checkInTime = moment(CheckAttendance.checkInTime, "h:mm:ss a");
                        const checkOutTime = moment(CheckAttendance.checkOutTime, "h:mm:ss a");
                        const duration = moment.duration(checkOutTime.diff(checkInTime));
                        CheckAttendance.totalHours = moment.utc(duration.asMilliseconds()).format("HH:mm:ss");
                        // Below - this will add attendance according to time difference of check-in and check-out
                        if (CheckAttendance.totalHours <= "08:59:59") {

                            if (CheckAttendance.totalHours <= "04:29:59") {
                                CheckAttendance.attendenceType = "Absent"
                                await CheckAttendance.save()
                            }
                            else {
                                CheckAttendance.attendenceType = "Half Day"
                                await CheckAttendance.save();
                            }
                        }
                        await CheckAttendance.save();
                        return res.status(200).json({ status:1, message: "checkedout", data: CheckAttendance });
                    }
                }
                return res.status(200).json({status:2,message: "You have already marked your attendance for today." });
            }

            const markedAttendance = await Attendance.create({
                user,
                date: actualDate,
                checkInTime: moment().format("h:mm:ss a"),
                attendenceType,
            })
            return res.status(200).json({status:0, message: "Attendance marked", data: markedAttendance });
        }
        else {
            return res.status(400).json({ message: "Invalid date" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "error in adding attendance" });
    }

}

const filterAttendance = async (req, res) => {

    try {
        const { startDate, endDate, userInput } =  req.body;
        const newStartDate = moment(startDate, "MM/DD/YYYY").format("YYYY-MM-DD");
        const newEndDate = moment(endDate, "MM/DD/YYYY").format("YYYY-MM-DD");
        const todaysDate = moment().format("YYYY-MM-DD");

        if (userInput || startDate || endDate) {
            if (!userInput) {
                const user = await Attendance.find({ date: { $gte: newStartDate, $lte: newEndDate } }).populate("user","first_name last_name email role");
                if (user.length == 0) {return res.status(200).json({data:user, message: `No records found` })}
                return res.status(200).json({ success: true, message: "Attendance records found", count: user.length, data: user });
            }
            const isEmail = userInput.includes("@");
            const isValue = isEmail ? "email" : "first_name";

            const emp = await User.findOne({[isValue]: userInput});
               const emp_Id = await emp._id;

            if (userInput && (!startDate || !endDate )) {
                const user = await Attendance.find({user:emp_Id}).populate("user","first_name last_name email role");
                if (user.length == 0) {return res.status(200).json({data:user, message: `No records found ${userInput}`})}
                return res.status(200).json({ message: `Attendance records found for ${userInput}`, count: user.length, data: user });
            }
            const user = await Attendance.find({ user:emp_Id, date: { $gte: newStartDate, $lte: newEndDate } }).populate("user","first_name last_name email role");
            if (user.length == 0) {return res.status(200).json({data:user, message: `No records found for ${userInput}` }); }
            return res.status(200).json({ success: true, message: `Attendance records found for ${userInput}`, count: user.length, data: user })

        }

        const todaysUser = await Attendance.find({ date: todaysDate }).populate("user","first_name last_name email role");
        return res.status(200).json({ success: true, message: "todays attendance", count: todaysUser.length, data: todaysUser });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "error in finding attendance" });
    }



    // try {
    //     const { startDate, endDate, userInput } = await req.body;
    //     const newStartDate = moment(startDate, "MM/DD/YYYY").format("YYYY-MM-DD");
    //     const newEndDate = moment(endDate, "MM/DD/YYYY").format("YYYY-MM-DD");
    //     const todaysDate = moment().format("YYYY-MM-DD");
    //     if (userInput || startDate || endDate) {
    //         if (!userInput) {
    //             const user = await Attendance.find({ date: { $gte: newStartDate, $lte: newEndDate } }).populate("user", "name email");
    //             return res.status(200).json({ success: true, message: "Attendance records found", count: user.length, data: user });
    //         }
    //         const isEmail = userInput.includes("@");
    //         const isValue = isEmail ? "email" : "name";
    //         if (userInput && (startDate.length == 0 || endDate.length == 0)) {
    //             const user = await Attendance.find({ [isValue]: userInput }).populate("user", "name email");
    //             return res.status(200).json({ message: `Attendance records found for ${userInput}`, count: user.length, data: user });
    //         }
    //         const user = await Attendance.find({ [isValue]: userInput, date: { $gte: newStartDate, $lte: newEndDate } }).populate("user", "name email");
    //         if (user.length == 0) { return res.status(400).json({ message: `No records found for ${userInput}` }); }
    //         return res.status(200).json({ success: true, message: `Attendance records found for ${userInput}`, count: user.length, data: user })

    //     }
    //     const todaysUser = await Attendance.find({ date: todaysDate }).populate("user", "name email");
    //     return res.status(200).json({ success: true, message: "todays attendance", count: todaysUser.length, data: todaysUser });

    // } catch (error) {
    //     console.log(error);
    //     return res.status(500).json({ message: "error in founding attendance" });
    // }

}



module.exports = {
    markAttendance,
    filterAttendance
}
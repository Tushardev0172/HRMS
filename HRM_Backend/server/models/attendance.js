const mongoose = require("mongoose")
const User = require("./users")
const attendenceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employee",
    },
    date: {
      type: Date,
      required: true,
    },
    checkInTime: {
      type: String,
    },
    attendenceType: {
        type: String,
        enum: ["Present", "Absent", "Half Day", "Leave","Weekend"],
        default:"Absent",
        required: true,
      },
    checkOutTime: {
      type: String,
    },
    totalHours:{
      type:String
    }
  },

);
const Attendance = mongoose.models?.attendance ||  mongoose.model("attendance", attendenceSchema);
module.exports= Attendance;
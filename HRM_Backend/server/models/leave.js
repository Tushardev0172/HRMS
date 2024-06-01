const mongoose = require("mongoose")
const leaveSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "employee",
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        isHalfDay: {
            type: Boolean,
            default: false
        },
        message: {
            type: String,
        },
        status: {
            type: String,
            enum: ["Pending", "Accepted", "Rejected"],
            default: "Pending",
        },
    },
    { timestamps: true }
);
const Leave = mongoose.models?.leave || mongoose.model("leave", leaveSchema);
module.exports = Leave;
const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "employee",
    },
    salaryType: {
        type: String,
        enum: ["pending", "approved", "paid"],
        default: "pending"
    }
})
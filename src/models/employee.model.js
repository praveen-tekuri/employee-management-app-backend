const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: {type: String, required: true, minLength: 3},
    gender: {
        type: String, 
        validate(value){if(!["male", "female", "others"].includes(value)){
            throw new Error("Please enter valid gender type");
        }}
    },
    email: {
        type: String, 
        required: true, 
        lowercase: true, 
        trim: true, 
        unique: true,
    },
    mobile: {type: String, required: true},
    address: {type: String, required: true},
    department: {type: String, required: true},
    skills: {type: [String], required: true},
    salary: {type: Number, required: true},
    role: {type: String, required: true},
    isActive: {type: Boolean,}
}, {timestamps: true})

const Employee = mongoose.model("Employee", employeeSchema, "employees");

module.exports = Employee;
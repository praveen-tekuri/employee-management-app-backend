const express = require("express");
const connectDB = require("./config/database");
require("dotenv").config();
const Employee = require("./models/employee.model");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes

// CREATE
app.post("/employees", async (req, res) => {
    try {
        if(Array.isArray(req.body)){
            await Employee.insertMany(req.body);
        }else{
            const employee = new Employee(req.body);
            await employee.save();
        }
        res.status(201).json({message: "Employees(s) saved successfully"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
})

// READ
app.get("/employees", async (req, res) => {
   try {
        const employees = await Employee.find();
        if(employees.length < 1){
          return res.status(404).json({message: "No employees found"});
        }
        res.send(employees);
   } catch (error) {
        res.status(400).json({error: error.message});
   }
})

// UPDATE
app.patch("/employees/:id", async(req, res) => {
    const {id} = req.params;
    try {
        const employee = await Employee.findByIdAndUpdate(id, req.body, {returnDocument: "after", runValidators: true})
        if(!employee){
            return res.status(404).json({message: "No employee found with this id"});
        }
        res.json({message: "Employee updated", employee});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
})

// UPDATE
app.patch("/employees/:id/inactivate", async(req, res) => {
    const {id} = req.params;
    try {
        const employee = await Employee.findByIdAndUpdate(id, {isActive: false}, {returnDocument: "after" });
        if(!employee){
            res.status(404).json({message: "No employee found with this id"});
            return;
        }
        res.json({message: "Employee marked inactive:", employee});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
})

// DB and Server Connection
connectDB().then(() => {
    app.listen(process.env.PORT, () => console.log(`Server listening on port: ${process.env.PORT}`));
})


// Status Codes:
// 200 - OK
// 201 - Created
// 400 - Bad Request
// 404 - Not Found
// 500 - Internal Server Error
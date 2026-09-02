const express = require("express");
const connectDB = require("./config/database");
require("dotenv").config();
const Employee = require("./models/employee.model");

const app = express();
app.use(express.json());

app.post("/employees", async (req, res) => {
    try {
        if(Array.isArray(req.body)){
            await Employee.insertMany(req.body);
        }else{
            const employee = await Employee(req.body);
            await employee.save();
        }
        res.json({message: "Employees(s) saved successfully"});
    } catch (error) {
        res.status(400).json({message: "Failed to save the data: " + error})
    }
})

app.get("/employees", async (req, res) => {
   try {
        const employees = await Employee.find();
        console.log(employees);
        res.json({message: `Employees fetched, ${employees}`});
   } catch (error) {
        res.status(400).json({message: "Failed to get employees", error})
   }
})

connectDB().then(() => {
    app.listen(process.env.PORT, () => console.log(`Server listening on port: ${process.env.PORT}`));
})
const express = require("express");
const connectDB = require("./config/database");
require("dotenv").config();
const Employee = require("./models/employee.model");
const cors = require("cors");
const Shopping = require("./models/shopping.model");

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
        let saved;
        if(Array.isArray(req.body)){
            saved = await Employee.insertMany(req.body);
        }else{
            const employee = new Employee(req.body);
            saved = await employee.save();
        }
        res.status(201).json({message: "Employees(s) saved successfully", saved});
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

app.post("/login", async(req, res) => {
    try {
        const {email} = req.body;
        const employee = await Employee.findOne({email});
        if(!employee) return res.status(401).send("Invalid Credentials");
        res.json({message: "Login Success", employee});
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

app.post("/shopping/add-product", async(req, res) => {
    try {
        const {id, quantity, color} = req.body;
        let product = await Shopping.findOne({id});
        if(product){
            product.quantity += quantity;
            await product.save();
            return res.json({message: "Product Quantity updated", product});
        }else{
            const newProduct = new Shopping(req.body);
            const product = await newProduct.save();
            res.json({message: "Product has been Added", product});
        }
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

app.get("/shopping/get-products", async(req, res) => {
    try {
        const products = await Shopping.find();
        res.json({message: products.length + " Products fetched", products})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

app.delete("/shopping/delete-product/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const deletedProduct = await Shopping.findByIdAndDelete(id);
        res.json({message: "Product has been deleted", deletedProduct});        
    } catch (error) {
        res.status(400).json({error: error.message})
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
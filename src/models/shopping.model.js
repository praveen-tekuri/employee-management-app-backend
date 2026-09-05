const mongoose = require("mongoose");

const shoppingSchema = new mongoose.Schema({
    employeeId: {type: String, required: true},
    id: {type: Number, required: true},
    attributes: {
        image: {type: String, required: true},
        title: {type: String, required: true},
        company: {type: String, required: true},
        price: {type: String, required: true},
    },
    quantity: {type: Number, required: true},
    color: {type: String, required: true}
})

const Shopping = mongoose.model("Shopping", shoppingSchema, "shopping");

module.exports = Shopping;
const mongoose = require('mongoose');
const {Schema} = mongoose ;

const PizzaSchema = new Schema({
    name: {
        type : String,
        required : true,
        unique : true
    },
    image:{
        type: String,
        required: true 
    },
    price:{
        type: Number,
        required: true
    }

})

const Pizza = mongoose.model('Pizza',PizzaSchema);
module.exports = Pizza;
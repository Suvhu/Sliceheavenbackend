const mongoose = require('mongoose');
const {Schema} = mongoose ;

const ProductSchema = new Schema({
    category:{
        type: String,
        required: true 
    },
    name: {
        type : String,
        required : true,
        unique : true
    },
    number:{
        type: Number,
        required : true
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

const Product = mongoose.model('Product',ProductSchema);
module.exports = Product;
const mongoose = require('mongoose');
const {Schema} = mongoose ;

const CartSchema = new Schema({
    name: {
        type : String,
        required : true,
    },
    image:{
        type: String,
        required: true 
    },
    price:{
        type: Number,
        required: true
    },
    userid :{
        type: String,
        required: true 
    },
    date:{
        type: Date ,
        default : Date.now 
    }

})

const Cart = mongoose.model('Cart',CartSchema);
module.exports = Cart;
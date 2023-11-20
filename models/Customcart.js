const mongoose = require('mongoose');
const {Schema} = mongoose ;

const CustomcartSchema = new Schema({
    name: {
        type : [String],
        required : true,
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

const Customcart = mongoose.model('Customcart',CustomcartSchema);
module.exports = Customcart;
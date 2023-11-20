const mongoose = require('mongoose');
const {Schema} = mongoose ;

const OrderSchema = new Schema({
    name: {
        type : [String],
        required : true,
    },
    category:{
      type : String,
      required : true,
    },
    status:{
      type: String,
      required: true,
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

const Order = mongoose.model('Order',OrderSchema);
module.exports = Order;

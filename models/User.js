const mongoose = require('mongoose');
const {Schema} = mongoose ;

const UserSchema = new Schema({
    name: {
        type : String,
        required : true
    },
    email:{
        type: String,
        required : true,
        unique : true
    },
    password:{
        type: String,
        required: true 
    },

    city:{
        type: String,
        required: true
    },
    town:{
        type: String,
        required: true
    },
    district:{
        type: String,
        required: true
    },
    number:{
        type: Number,
        required: true 
    },
    date:{
        type: Date ,
        default : Date.now 
    },
    verifytoken:{
        type: String
    }
})

const User = mongoose.model('user',UserSchema);
module.exports = User ;
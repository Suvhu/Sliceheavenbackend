const mongoose  = require ('mongoose') ;
mongoose.set('strictQuery', false);
const mongoURI = "mongodb+srv://subhashishswain3:Subumongodb@cluster0.phcs7ih.mongodb.net/pizzaz?retryWrites=true&w=majority" ;

const connectToMongo = () =>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected to MongoDB");
    })
}

module.exports = connectToMongo ;
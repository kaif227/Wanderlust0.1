const mongoose = require("mongoose");
const initData = require("./Data.js");
const Listing = require("../models/listing.js");

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

const initDB =async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner : "669b58039f4a7143b5a9f92b"}))
    await Listing.insertMany(initData.data);
    console.log("data was initialized"); 
};
initDB();
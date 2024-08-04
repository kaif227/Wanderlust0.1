const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); // Correct service
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


//Index Route
module.exports.index = async (req,res)=>{
    const allListings =  await Listing.find({});
  res.render("listings/index.ejs",{allListings});
 };

 //new route
 module.exports.renderNewform = (req,res)=>{
  console.log(req.user);
  res.render("listings/new.ejs");
};

//Show Route
module.exports.showListing = async (req,res)=>{
  let {id} = req.params;
  const listing =  await Listing.findById(id)
  .populate({
      path : "reviews",
      populate : {           //har ek review ke sath unke author ke name
      path : "author",
  },
})
  .populate("owner");
  if(!listing){
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listings")
  }
  console.log(listing);
  res.render("listings/show.ejs",{listing});
};



// Create Route
module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location, // Assuming the location is provided in the request body
      limit: 1,
    })
    .send();

   // Correctly extract the geometry

  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  
  newListing.geometry =  response.body.features[0].geometry // Save geometry in the listing
  
  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};


//Edit route
module.exports.renderEditListing = async(req,res)=>{
  let {id} = req.params;
  const listing =  await Listing.findById(id);
  if(!listing){
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listings")
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl= originalImageUrl.replace("/upload","/upload/w_250")  
  res.render("listings/edit.ejs",{listing,originalImageUrl});

};
//Update route
module.exports.upadateListing = async (req,res)=>{
  let {id}= req.params;
  let listing = await Listing.findByIdAndUpdate(id,{ ...req.body.listing });

if(typeof req.file !=="undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = {url,filename};
  await listing.save();
}
req.flash("success","Listing Updated!")
res.redirect(`/listings/${id}`);
}
//Delete Route
module.exports.destroyListing = async (req,res)=>{
  let {id} = req.params;
  let deltedListing =  await Listing.findByIdAndDelete(id);
  req.flash("success","New Listing Deleted!")
  res.redirect("/listings");
}
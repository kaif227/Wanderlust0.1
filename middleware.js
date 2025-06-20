const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema} = require("./schema.js");//(..)means we are going in parent directory


module.exports.isLoggedIn = (req,res,next)=>{
    req.session.redirectUrl = req.originalUrl;//this url use in user.js 
    if(!req.isAuthenticated()){  //This method is check user is logged in or not
        req.flash("error","You must be logged in to create listing!");
        return res.redirect("/login");
    }
    next()
};
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    };
    next();
    //this route is for chickig ki user is logged in h ya nhi
};

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`)
    }
    next();
};
module.exports.validateListing = (req,res,next)=>{
    const {error} =  listingSchema.validate(req.body);
     if(error){
        let errMsg = error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg);
     }else{
        next();
     }
};
module.exports.validateReview = (req,res,next)=>{
    const {error} =  reviewSchema.validate(req.body);
     if(error){
        let errMsg = error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg);
     }else{
        next();
     }
}
module.exports.isReviewAuthor = async(req,res,next)=>{
    let { id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this listing");
        return res.redirect(`/listings/${id}`)
    }
    next();
};



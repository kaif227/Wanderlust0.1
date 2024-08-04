const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
//(..)means we are going in parent directory
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingControllers = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({storage });


router.route("/")
.get(wrapAsync(listingControllers.index))
.post( isLoggedIn,
   
    upload.single("listing[image]"),
    wrapAsync(listingControllers.createListing))

//new route
router.get("/new",isLoggedIn,listingControllers.renderNewform);

router.route("/:id")
.get(wrapAsync(listingControllers.showListing))
//update route
.put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingControllers.upadateListing))
.delete(
     isLoggedIn,
     isOwner,
     wrapAsync(listingControllers.destroyListing));

//Edit ROUTE
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingControllers.renderEditListing));



module.exports =router;
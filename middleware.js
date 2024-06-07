const Listing = require("./models/listing");
const Review = require("./models/review"); // Import the Review model
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to continue...!");
        return res.redirect("/login");
    }
    next();
};

const saveRedirectUrl = (req, res, next) => {
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
    next();
};

module.exports = {
    isLoggedIn,
    saveRedirectUrl
};


module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing Doesn't Exist");
        return res.redirect("/listings");
    }
    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You Are Not The Owner Of This Listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};



module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
      const errMsg = error.details.map(el => el.message).join(",");
      return next(new ExpressError(400, errMsg)); // Pass error to next middleware
  }
  next();
};


module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;

  try {
    const review = await Review.findById(reviewId);
    
    if (!review) {
      req.flash("error", "Review Doesn't Exist");
      return res.redirect("/listings/" + id);
    }

    if (!review.author.equals(res.locals.currUser._id)) {
      req.flash("error", "You Are Not The Author of This Review!");
      return res.redirect("/listings/" + id);
    }
    
    // If everything is fine, move to the next middleware
    next();
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong");
    res.redirect("/listings/" + id);
  }
};

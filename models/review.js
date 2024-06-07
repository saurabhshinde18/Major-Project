const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Rating is required']
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },author:{
    type:Schema.Types.ObjectId,
    ref:"User"
  }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;

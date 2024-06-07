if(process.env.NODE_ENV != "production"){
  require('dotenv').config()

}

console.log(process.env.SECRET);
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const app = express(); 
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
const dbUrl = process.env.ATLASDB_URL;
const store =MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
});
store.on("error",()=>{
  console.log("ERROR in MONGODB SESSION STORE",err);
})
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.render("listings/home.ejs");
});

app.get("/demouser", wrapAsync(async (req, res) => {
  let fakeUser = new User({
    email: "student@gmail.com",
    username: "delta Student",
  });
  let registeredUser = await User.register(fakeUser, "helloworld");
  res.send(registeredUser);
}));

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter); 
app.use("/", userRouter);

async function main() {
  try {
    await mongoose.connect(dbUrl);
    console.log("Connected to database");
  } catch (err) {
    console.error("Database connection error:", err);
  }
}
main().catch(err => console.log(err));

// Catch-all route for 404 errors
app.all('*', (req, res, next) => {
  next(new ExpressError(404, 'Page Not Found..!'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("listings/error", { message });
});

// Server setup
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;

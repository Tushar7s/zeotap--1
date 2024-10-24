if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const ExpressError = require("./utils/ExpressError.js");
const ruleRoutes = require('./routes/ruleRoutes');
const cors = require('cors');
const app = express();
const session = require("express-session");
const MongoStore = require('connect-mongo');
const PORT = process.env.PORT || 5000;


const dbUrl = process.env.ATLASDB_URL
main().then(() =>{
    console.log("connected");
}).catch(err=>{
    console.log(err);
});
async function main( ){
    await mongoose.connect(dbUrl);
}

app.use(express.urlencoded({extended:true}));
// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
      secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
})
store.on("error", () => {
  console.log("ERRON IN MONGO SESSION STORE", err);
});

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: { secure: process.env.NODE_ENV === "production" }
}));
  
// Use routes
app.use('/api', ruleRoutes);

// Catch-all for undefined routes
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something Went Wrong" } = err;
  // Send JSON response for API requests
  if (req.accepts('json')) {
    return res.status(statusCode).json({ error: message });
  } else {
    // For non-API requests, render an error page or return a message
    return res.status(statusCode).send(message); // Change this if you have an HTML error page
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
module.exports = app;
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./passport-config'); // Include passport-config.js

const app = express();
const PORT = process.env.PORT || 3000;



// Session middleware
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;

db.on('error', error => console.error('MongoDB connection error:', error));
db.once('open', () => console.log('Connected to the database!'));


app.use(express.urlencoded({extended:false}))
app.use(express.json());


// app.use((req, res, next) => {
//   res.locals.message = req.session.message;
//   delete req.session.message;
//   next();
// });

app.set('view engine', 'ejs');


 app.use(express.static('uploads'))

// Mount user routes
app.use ("",require("./routes/brand"))

app.use ("",require("./routes/users"))
app.use ("",require("./routes/postes"))
app.use ("",require("./routes/tag"))

app.use ("",require("./routes/category"))


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

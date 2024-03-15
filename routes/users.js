const express = require("express");
const User = require("../models/users");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const router = express.Router();


const multer = require("multer");
const fs = require("fs");

// Multer configuration for file upload
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({ storage: storage }).single("image");

// Route to render the user list page
router.get("/users", isLoggedIn,  async (req, res) => {
  try {
    const title = "Users";
    const message = req.session.message;
    const users = await User.find({});
    req.session.message = null;

    res.render("userlist", { title, message, users });
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Internal Server Error",
    };
    res.redirect("/users");
  }
});

// Route to render the add user form
router.get("/add-user",  (req, res) => {
  const title = "Add User";
  
  const message = req.session.message;
  console.log(message)
  req.session.message = null;

  res.render("add-user", { title,message });
});

// Route to handle adding a new user
router.post("/save-user", async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
    });


    async function checkEmailExists(email) {
      const user = await User.findOne({ email });
      return !!user; // If user exists, return true; otherwise, return false
  }
  
  const emailExists = await checkEmailExists(req.body.email);

  if (emailExists) {
    
    req.session.message = {
      type: "danger",
      message: "User email already exists.",
      
    };
    return res.redirect("/add-user");

  } 

  await newUser.save();

  
    req.session.message = {
      type: "success",
      message: "User added successfully",
      
    };
    res.redirect("/users");
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Error adding user",
    };
    res.redirect("/add-user");
  }
});




// Route to render the edit user form
router.get("/edit-user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const message = req.session.message;
    const user = await User.findById(id);

    if (!user) {
      req.session.message = {
        type: "danger",
        message: "Invalid ID",
      };
      return res.redirect("/users");
    }

    res.render("edit-user", {
      title: "Edit User",
      message,
      user,
    });
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Error rendering edit form",
    };
    res.redirect("/users");
  }
});

// Route to handle updating a user
router.post("/update-user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedUser = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
    };

    await User.findByIdAndUpdate(id, updatedUser);

    req.session.message = {
      type: "success",
      message: "User updated successfully",
    };
    res.redirect("/users");
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Error updating user",
    };
    res.redirect(`/edit-user/${id}`);
  }
});

// Route to handle deleting a user
router.get("/delete-user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      req.session.message = {
        type: "danger",
        message: "User not found or already deleted",
      };
    } else {
      req.session.message = {
        type: "success",
        message: "User deleted successfully",
      };
    }

    res.redirect("/users");
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Error deleting user",
    };
    res.redirect("/users");
  }
});

router.get("/login", (req, res) => {
  const message = req.session.message;

  req.session.message = "";
  console.log(message);

  res.render("login_users", { title: "Login Users", message });
});



router.get("/Home", (req, res) => {
  
  const message = req.session.message;
  console.log(message)
  req.session.message = null;

  res.render("Home", { message });
});


// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   // console.log(email)
//   // console.log(password)
//   try {
//     const user = await User.findOne({ email });
//     console.log(user.password)

//     if (user && user.password == password) {
//       req.session.message = {
//         type: "success",
//         message: "Welcome to Home Page",
//       };
//       return res.redirect("/Home"); // 
//     } else {
//       req.session.message = {
//         type: "error",
//         message: "Invalid email or password",
//       };
//       return res.status(401).send("Invalid email or password");     }
//   } catch (error) {
//     console.error("Error while logging in:", error);
//     req.session.message = {
//       type: "error",
//       message: "Internal Server Error",
//     };
//     return res.status(500).send("Internal Server Error"); // Return response after sending
//   }
// });


router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));






// Middleware to check if user is authenticated
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect('/login');
}

module.exports = router;

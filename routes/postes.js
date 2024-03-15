const express = require("express");
const router = express.Router();
const Post = require("../models/posts");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("image");

// Route to render the Post list page
router.get("/posts", async (req, res) => {
  try {
    const title = "Posts";
    const message = req.session.message;
    const posts = await Post.find({});
    req.session.message = null;

    res.render("postlist", { title, message, posts });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to render the add Post form
router.get("/add-post", (req, res) => {
  const title = "Add Post";
  const message = req.session.message;
  req.session.message = {
    type:'success',
    message:'Post added successfully'
  };

  res.render("add-post", { title, message });
});

// Route to handle adding a new Post
router.post("/save-post", upload, async (req, res) => {
  try {
    const newPost = new Post({
      name: req.body.name,
      image: req.file.filename, // Updated
      slug: req.body.slug,
      content: req.body.content,
      password: req.body.password,
    });

    await newPost.save();

    req.session.message = {
      type: "success",
      message: "Post added successfully",
    };
    res.redirect("/posts");
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Error adding Post",
    };
    res.redirect("/add-post");
  }
});

// Route to render the edit Post form
router.get("/edit-post/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const message = req.session.message;
    const post = await Post.findById(id);

    if (!post) {
      req.session.message = {
        type: "danger",
        message: "Invalid ID",
      };
      return res.redirect("/posts");
    }

    res.render("edit-post", {
      title: "Edit Post",
      message,
      post,
    });
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Error editing Post",
    };
    res.redirect("/posts");
  }
});
// Route to handle updating a Post
router.post("/update-post/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedPost = {
        name: req.body.name,
        image: req.body.image,
        slug: req.body.slug,
        content: req.body.content,
        password: req.body.password,
    
    };

    await Post.findByIdAndUpdate(id, updatedPost);

    req.session.message = {
      type: "success",
      message: "Post updated successfully",
    };
    res.redirect("/posts");
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Error updating Post",
    };
    res.redirect(`/edit-post/${id}`);
  }
});

// Route to handle deleting a Post
router.get("/delete-post/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      req.session.message = {
        type: "danger",
        message: "Post not found or already deleted",
      };
    } else {
      req.session.message = {
        type: "success",
        message: "Post deleted successfully",
      };
    }

    res.redirect("/posts");
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Error deleting Post",
    };
    res.redirect("/posts");
  }
});

module.exports = router;

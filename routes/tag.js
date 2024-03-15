const express = require("express");
const router = express.Router();
const Tag = require("../models/tag");
const multer = require("multer");

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage }).single("image");

// Route to render the Tag list page
router.get("/tags", async (req, res) => {
  try {
    const title = "Tags";
    const message = req.session.message;
    const tags = await Tag.find({});
    req.session.message = null;
    res.render("taglist", { title, message, tags });
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Internal Server Error",
    };
    res.redirect("/tags");
  }
});

// Route to render the add Tag form
router.get("/add-tag", (req, res) => {
  const title = "Add Tag";
  const message = req.session.message;
  req.session.message = null;
  res.render("add-tag", { title, message });
});

// Route to handle adding a new Tag
router.post("/save-tag", upload, async (req, res) => {
  try {
    const newTag = new Tag({
      name: req.body.name,
      slug: req.body.slug,
      content: req.body.content,
    });

    await newTag.save();

    req.session.message = {
      type: "success",
      message: "Tag added successfully",
    };
    res.redirect("/tags");
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Error adding Tag",
    };
    res.redirect("/add-tag");
  }
});

// Route to render the edit Tag form
router.get("/edit-tag/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const message = req.session.message;
    const tag = await Tag.findById(id);

    if (!tag) {
      req.session.message = {
        type: "danger",
        message: "Invalid ID",
      };
      return res.redirect("/tags");
    }

    res.render("edit-tag", {
      title: "Edit Tag",
      message,
      tag,
    });
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Error editing Tag",
    };
    res.redirect("/tags");
  }
});

// Route to handle updating a Tag
router.post("/update-tag/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedTag = {
      name: req.body.name,
      slug: req.body.slug,
      content: req.body.content,
    };

    await Tag.findByIdAndUpdate(id, updatedTag);

    req.session.message = {
      type: "success",
      message: "Tag updated successfully",
    };
    res.redirect("/tags");
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Error updating Tag",
    };
    res.redirect(`/edit-tag/${id}`);
  }
});

// Route to handle deleting a Tag
router.get("/delete-tag/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedTag = await Tag.findByIdAndDelete(id);

    if (!deletedTag) {
      req.session.message = {
        type: "danger",
        message: "Tag not found or already deleted",
      };
    } else {
      req.session.message = {
        type: "success",
        message: "Tag deleted successfully",
      };
    }

    res.redirect("/tags");
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Error deleting Tag",
    };
    res.redirect("/tags");
  }
});

module.exports = router;

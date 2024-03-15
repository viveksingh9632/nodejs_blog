const express = require("express");
const router = express.Router();
const Category = require("../models/category");
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

// Route to render the Category list page
router.get("/categories", async (req, res) => {
  try {
    const title = "Categories";
    const message = req.session.message;
    const categories = await Category.find({});
    req.session.message = null;
    res.render("categorylist", { title, message, categories });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to render the add Category form
router.get("/add-category", (req, res) => {
  const title = "Add Category";
  const message = req.session.message;
  req.session.message = null;
  res.render("add_category", { title, message });
});

// Route to handle adding a new Category
router.post("/save-category", upload, async (req, res) => {
  try {
    const newCategory = new Category({
      name: req.body.name,
      slug: req.body.slug,
      content: req.body.content,
    });

    await newCategory.save();

    req.session.message = {
      type: "success",
      message: "Category added successfully",
    };
    res.redirect("/categories");
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Error adding category",
    };
    res.redirect("/add-category");
  }
});

// Route to render the edit Category form
router.get("/edit_category/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const message = req.session.message;
    const category = await Category.findById(id);

    if (!category) {
      req.session.message = {
        type: "danger",
        message: "Invalid ID",
      };
      return res.redirect("/categories");
    }

    res.render("edit_category", {
      title: "Edit Category",
      message,
      category,
    });
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Error editing Category",
    };
    res.redirect("/categories");
  }
});

// Route to handle updating a Category
router.post("/update-category/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedCategory = {
      name: req.body.name,
      slug: req.body.slug,
      content: req.body.content,
    };

    await Category.findByIdAndUpdate(id, updatedCategory);

    req.session.message = {
      type: "success",
      message: "Category updated successfully",
    };
    res.redirect("/categories");
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Error updating category",
    };
    res.redirect(`/edit-category/${id}`);
  }
});

// Route to handle deleting a Category
router.get("/delete-category/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      req.session.message = {
        type: "danger",
        message: "Category not found or already deleted",
      };
    } else {
      req.session.message = {
        type: "success",
        message: "Category deleted successfully",
      };
    }

    res.redirect("/categories");
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Error deleting category",
    };
    res.redirect("/categories");
  }
});





module.exports = router;

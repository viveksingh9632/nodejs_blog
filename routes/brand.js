const express = require("express");
const router = express.Router();
const Brand = require("../models/brand"); // Adjust the path to your Brand model
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

router.get("/add_brand", (req, res) => {
    const title = "Add Brand";
    const message = req.session.message;
    req.session.message = null;
    res.render("add_brand", { title, message });
});

router.get("/brands", async (req, res) => {
    try {
        const title = "Brand";
        const message = req.session.message;
        const brands = await Brand.find({});
        req.session.message = null;
        res.render("brandlist", { title, message, brands });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.post("/save-brand", upload, async (req, res) => {
    try {
        const newBrand = new Brand({
            model: req.body.model,
            description: req.body.description,
            display: req.body.display,
            ramrom: req.body.ramrom,
            camera: req.body.camera,
            battery: req.body.battery,
            retail: req.body.retail,
        });

        await newBrand.save();

        req.session.message = {
            type: "success",
            message: "Brand added successfully",
        };
        res.redirect("/brands");
    } catch (error) {
        console.error(error);
        req.session.message = {
            type: "danger",
            message: "Error adding Brand",
        };
        res.redirect("/add-brand");
    }
});

router.get("/edit_brand/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const message = req.session.message;
        const brand = await Brand.findById(id);

        if (!brand) {
            req.session.message = {
                type: "danger",
                message: "Invalid ID",
            };
            return res.redirect("/brands");
        }

        res.render("edit_brand", {
            title: "Edit Brand",
            message,
            brand,
        });
    } catch (error) {
        console.error(error);
        req.session.message = {
            type: "danger",
            message: "Error editing Brand",
        };
        res.redirect("/brands");
    }
});

router.post("/update-brand/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const updatedBrand = {
            model: req.body.model,
            description: req.body.description,
            display: req.body.display,
            ramrom: req.body.ramrom,
            camera: req.body.camera,
            battery: req.body.battery,
            retail: req.body.retail,
        };

        await Brand.findByIdAndUpdate(id, updatedBrand);

        req.session.message = {
            type: "success",
            message: "Brand updated successfully",
        };
        res.redirect("/brands");
    } catch (error) {
        console.error(error);
        req.session.message = {
            type: "danger",
            message: "Error updating Brand",
        };
        res.redirect(`/edit-brand/${id}`);
    }
});

router.get("/delete-brand/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const deletedBrand = await Brand.findByIdAndDelete(id);

        if (!deletedBrand) {
            req.session.message = {
                type: "danger",
                message: "Brand not found or already deleted",
            };
        } else {
            req.session.message = {
                type: "success",
                message: "Brand deleted successfully",
            };
        }

        res.redirect("/brands");
    } catch (error) {
        console.error(error);
        req.session.message = {
            type: "danger",
            message: "Error deleting brand",
        };
        res.redirect("/brands");
    }
});

module.exports = router;

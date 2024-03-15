const mongoose = require("mongoose");

// Define the user schema
const postSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },

  slug: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    require: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", postSchema);

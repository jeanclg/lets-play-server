const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const PostSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: { type: String, maxlength: 1000 },
  data: { type: Date, default: Date.now },
});

const PostModel = model("Post", PostSchema);

module.exports = PostModel;

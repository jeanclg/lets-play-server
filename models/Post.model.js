const { Schema, model } = require("mongoose");

const PostSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  text: { type: String, maxlength: 1000 },
  data: {type: Date, default: new Date().toLocaleString()}
});

const PostModel = model("Post", PostSchema);

module.exports = PostModel;

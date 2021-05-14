const { Schema, model, MongooseDocument, Mongoose } = require("mongoose");
const mongoose = require("mongoose");

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ["ADMIN", "USER"],
    required: true,
    default: "USER",
  },
  gamesList: [String],
  receivedMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  uploadedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  image_url: {
    type: String,
    default:
      "https://uwosh.edu/deanofstudents/wp-content/uploads/sites/156/2019/02/profile-default.jpg",
  },
});

const UserModel = model("User", UserSchema);

module.exports = UserModel;

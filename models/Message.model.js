const { text } = require("express");
const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const MessageSchema = new Schema({
  userSenderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: { type: String, required: true, maxlength: 500 },
  data: { type: Date, default: Date.now },
});

const MessageModel = model("Message", MessageSchema);

module.exports = MessageModel;

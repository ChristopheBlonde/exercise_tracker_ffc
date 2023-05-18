const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    count: {
      type: Number,
      default: 0,
    },
    log: [
      {
        description: String,
        duration: Number,
        date: {
          type: Date,
          default: new Date(),
        },
      },
    ],
  })
);

module.exports = User;

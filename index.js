const express = require("express");
const cors = require("cors");
const formidableMiddleware = require("./assets/middleware/formidableMiddleware");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./assets/Models/user");

const htmlFile = __dirname + "/public/index.html";
const assets = __dirname + "/assets";

const app = express();
mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true });

app.use(cors());
app.use("/assets", express.static(assets));
app.use(formidableMiddleware);

app.get("/", (req, res) => {
  res.sendFile(htmlFile);
});

app.post("/api/users", async (req, res) => {
  const { username } = req.fields;

  const newUser = new User({
    username,
  });

  try {
    await newUser.save();
    res.status(200).json({ username: newUser.username, _id: newUser._id });
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const userList = await User.find().select("username _id");
    res.status(200).json(userList);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  try {
    const _id = req.params._id;
    const { duration, date, description } = req.fields;
    const user = await User.findById(_id);

    if (duration && description) {
      const dateExercise = date ? new Date(date) : new Date();
      user.log.push({ duration, description, date: dateExercise });
      user.count = user.count + 1;
      await user.save();
      res.status(200).json({
        username: user.username,
        description: description,
        duration: Number(duration),
        date: dateExercise.toDateString(),
        _id: user._id,
      });
    } else {
      res.status(400).json({ message: "Missing args" });
    }
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

app.get("/api/users/:_id/logs", async (req, res) => {
  try {
    const { from, to, limit } = req.query;
    const _id = req.params._id;
    const user = await User.findById(_id);
    const startDate = Date.parse(new Date(from));
    const endDate = Date.parse(new Date(to));

    let workArray = [...user.log].filter((elem) => {
      const dateToTest = Date.parse(elem.date);
      if (startDate && endDate) {
        return dateToTest >= startDate && dateToTest <= endDate;
      }
      if (startDate && !endDate) {
        return dateToTest > startDate;
      }
      if (!startDate && endDate) {
        return dateToTest < endDate;
      }
      if (!startDate && !endDate) return true;
    });
    if (limit) {
      workArray = workArray.slice(0, Number(limit));
    }

    const logs = workArray.map((elem) => {
      const date = elem.date.toDateString();
      return {
        description: elem.description,
        duration: elem.duration,
        date: date,
      };
    });

    res.status(200).json({
      username: user.username,
      count: user.count,
      log: logs,
      _id: user._id,
    });
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

const listener = app.listen(process.env.PORT, () => {
  console.log(`Server was started on port ${listener.address().port}`);
});

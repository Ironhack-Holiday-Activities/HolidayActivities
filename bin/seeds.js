const mongoose = require("mongoose");
const Activity = require("../models/Activity.model");
const User = require("../models/User.model");
const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost/HolidayActivities";
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

User.create({
    username: 'Peter',
      email: 'Peter@ironhack.com',
      passwordHash: 'aisjdiasjidjioaw2143123'
})

Activity.create({
    title: 'Horse Riding',
      description: 'We meet to go riding on horses',
      image: 'images/riding.jpg',
      startDate: '2021-08-15',
      meetingPoint: "Stuttgart Horse Stable",
      attendants:[],
      author: '6110f42e911ccf668c52a9ba'
})

console.log("Seeds Created");
mongoose.disconnect();

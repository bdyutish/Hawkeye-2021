import fs from 'fs';
import mongoose from 'mongoose';

//Connect to DB
mongoose.connect('mongodb://localhost:27018/hawk', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// //Load Models
// const User = require('./src/models/User');
// const Question = require('./src/models/Question');

import Region from './src/models/Region';
import Question from './src/models/Question';
//Read Json Files
// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
// );
const questions = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/questions.json`, 'utf-8')
);
const regions = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/regions.json`, 'utf-8')
);

//IMport data into DB
const importData = async () => {
  try {
    // await User.create(users);
    await Question.create(questions);
    await Region.create(regions);
    console.log('Data imported...');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

//Delete Data
const deleteData = async () => {
  try {
    // await User.deleteMany(); //Delete everything
    await Region.deleteMany();
    await Question.deleteMany();
    console.log('Data destroyed...');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] == '-d') {
  deleteData();
}

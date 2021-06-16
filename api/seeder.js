"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const mongoose_1 = __importDefault(require("mongoose"));
//Connect to DB
mongoose_1.default.connect('mongodb://localhost:27018/hawk', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});
// //Load Models
// const User = require('./src/models/User');
// const Question = require('./src/models/Question');
const Region_1 = __importDefault(require("./src/models/Region"));
const Question_1 = __importDefault(require("./src/models/Question"));
const HawksNestQuestion_1 = __importDefault(require("./src/models/HawksNestQuestion"));
//Read Json Files
// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
// );
const questions = JSON.parse(fs_1.default.readFileSync(`${__dirname}/_data/questions.json`, 'utf-8'));
const colors = JSON.parse(fs_1.default.readFileSync(`${__dirname}/_data/colors.json`, 'utf-8'));
let regions = JSON.parse(fs_1.default.readFileSync(`${__dirname}/_data/regions.json`, 'utf-8'));
regions = regions.map((region, index) => {
    return Object.assign(Object.assign({}, region), { colorData: JSON.stringify(colors[index]) });
});
const nestQuestions = JSON.parse(fs_1.default.readFileSync(`${__dirname}/_data/nestQuestions.json`, 'utf-8'));
//IMport data into DB
const importData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // await User.create(users);
        yield Question_1.default.create(questions);
        yield Region_1.default.create(regions);
        yield HawksNestQuestion_1.default.create(nestQuestions);
        console.log('Data imported...');
        process.exit();
    }
    catch (err) {
        console.log(err);
    }
});
//Delete Data
const deleteData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // await User.deleteMany(); //Delete everything
        yield Region_1.default.deleteMany();
        yield Question_1.default.deleteMany();
        yield HawksNestQuestion_1.default.deleteMany();
        console.log('Data destroyed...');
        process.exit();
    }
    catch (err) {
        console.log(err);
    }
});
if (process.argv[2] === '-i') {
    importData();
}
else if (process.argv[2] == '-d') {
    deleteData();
}

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface UserDoc extends mongoose.Document {
  name: string;
  email: string;
  username: string;
  password: string;
  role: number;
  regNo: string;
  resetPasswordToken: string | undefined;
  resetPasswordExpire: string | undefined;
  emailVerificationToken: string | undefined;
  emailVerificationExpire: string | undefined;
  isBanned: boolean;
  isVerified: boolean;
  hawksNest: boolean;
  nestLevel: number;
  score: number;
  strikes: number;
  college: string;
  phone: string;
  streakMultiplier: number;
  lastUnlockedIndex: number;
  regions: {
    regionid: mongoose.Schema.Types.ObjectId;
    level: number;
    multiplier: number;
    isCompleted: boolean;
  }[];
  attempts: {
    question: mongoose.Schema.Types.ObjectId;
    userAttempts: [string];
  }[];
  nestAttempts: {
    question: mongoose.Schema.Types.ObjectId;
    userAttempts: [string];
  }[];
  inventory: {
    id: number;
    purchasedAt: Date;
    usedAt: Date | null;
    powerupName: string;
    active: boolean;
    region: mongoose.Schema.Types.ObjectId | undefined;
    question: mongoose.Schema.Types.ObjectId | undefined;
  }[];
  powerupsHistory: {
    id: number;
    available: number;
    owned: number;
  }[];
  matchPassword(enteredPassword: string): boolean;
  getResetPasswordToken(): string;
  getEmailToken(): string;
}

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  username: {
    type: String,
    required: [true, 'Please add a username'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please Add a password'],
    minlength: 8,
    select: false,
  },
  role: {
    type: Number,
    default: 0,
  },
  college: {
    type: String,
  },
  phone: {
    type: String,
  },
  regNo: {
    type: String,
    required: false,
  },
  score: {
    type: Number,
    default: 0,
  },
  strikes: {
    type: Number,
    default: 0,
  },
  streakMultiplier: {
    type: Number,
    default: 1,
  },
  lastUnlockedIndex: {
    type: Number,
    default: 0,
  },
  regions: [
    {
      regionid: mongoose.Schema.Types.ObjectId,
      level: Number,
      multiplier: Number,
      isCompleted: Boolean,
    },
  ],
  attempts: [
    {
      question: mongoose.Schema.Types.ObjectId,
      userAttempts: [String],
    },
  ],
  nestAttempts: [
    {
      question: mongoose.Schema.Types.ObjectId,
      userAttempts: [String],
    },
  ],
  inventory: [
    {
      id: Number,
      purchasedAt: Date,
      usedAt: Date,
      powerupName: String,
      active: Boolean,
      region: mongoose.Schema.Types.ObjectId,
      question: mongoose.Schema.Types.ObjectId,
    },
  ],
  powerupsHistory: [
    {
      id: Number,
      available: Number,
      owned: Number,
    },
  ],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  isBanned: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  hawksNest: {
    type: Boolean,
    default: false,
  },
  nestLevel: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//Encrypt password using bcrypt
UserSchema.pre<UserDoc>('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Match user entered password to hashed pwd in db
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  const user = this as UserDoc;
  return await bcrypt.compare(enteredPassword, user.password);
};

//Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  //Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  //Hash token and set to resetPasswordToken
  const user = this as UserDoc;

  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  //Set expire
  //@ts-ignore
  user.resetPasswordExpire = Date.now() + 10000 * 60 * 1000;

  return resetToken;
};

UserSchema.methods.getEmailToken = function () {
  //Generate token
  const verifyToken = crypto.randomBytes(20).toString('hex');
  const user = this as UserDoc;
  user.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verifyToken)
    .digest('hex');

  return verifyToken;
};

export default mongoose.model<UserDoc>('User', UserSchema);

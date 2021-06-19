import mongoose from 'mongoose';

export interface AttemptTimeDoc extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  question: mongoose.Schema.Types.ObjectId;
  attempt: string;
  time: Date;
}

const AttemptTimeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  attempt: {
    type: String,
  },
  time: {
    type: Date,
    defualt: Date.now,
  },
});

export default mongoose.model<AttemptTimeDoc>('AttemptTime', AttemptTimeSchema);

import mongoose from 'mongoose';
import { RegionDoc } from './Region';

export interface QuestionDoc extends mongoose.Document {
  text: string;
  answer: string;
  hints: [Hint];
  level: number;
  region: mongoose.Schema.Types.ObjectId;
}

export interface Hint {
  hint: string;
  level: Number;
}

const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    select: false,
    required: true,
  },
  hints: {
    type: Array,
    select: false,
  },
  level: {
    type: Number,
    required: true,
  },
  region: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Region',
    required: true,
  },
});

export default mongoose.model<QuestionDoc>('Question', QuestionSchema);

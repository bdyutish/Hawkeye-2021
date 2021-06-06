import mongoose, { Types } from 'mongoose';
import { RegionDoc } from './Region';
import { HintDoc } from './Hint';

export interface QuestionDoc extends mongoose.Document {
  text: string;
  answer: string;
  hints: [Types.ObjectId];
  level: number;
  region: Types.ObjectId | RegionDoc;
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

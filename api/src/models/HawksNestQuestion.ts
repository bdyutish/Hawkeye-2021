import mongoose from 'mongoose';
import { RegionDoc } from './Region';

export interface HawksNestQuestionDoc extends mongoose.Document {
  text: string;
  answer: string;
  hints: [string];
  level: number;
}

const HawksNestQuestionSchema = new mongoose.Schema({
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
});

export default mongoose.model<HawksNestQuestionDoc>(
  'HawksNestQuestion',
  HawksNestQuestionSchema
);

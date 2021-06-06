import mongoose, { Types } from 'mongoose';
import { QuestionDoc } from './Question';

interface HintUnlockedAttrs {
  regionIndex: number;
  question: number;
  hintLevel: number;
}

export interface HintUnlockedDoc extends mongoose.Document {
  regionIndex: number;
  question: number;
  hintLevel: number;
}

interface HintUnlockedModel extends mongoose.Model<HintUnlockedDoc> {
  build(attrs: HintUnlockedAttrs): HintUnlockedDoc;
}

const hintUnlockedSchema = new mongoose.Schema({
  regionIndex: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5],
    required: true,
  },
  question: {
    type: Number,
    required: true,
  },
  hintLevel: {
    type: Number,
    required: true,
  },
});

export default mongoose.model<HintUnlockedDoc, HintUnlockedModel>(
  'UnlockedHint',
  hintUnlockedSchema
);

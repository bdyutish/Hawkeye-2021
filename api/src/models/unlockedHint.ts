import mongoose, { Types } from 'mongoose';
import { QuestionDoc } from './Question';

interface HintUnlockedAttrs {
  regionIndex: number;
  question: QuestionDoc | Types.ObjectId;
  hintLevel: number;
}

export interface HintUnlockedDoc extends mongoose.Document {
  regionIndex: number;
  question: QuestionDoc | Types.ObjectId;
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
    type: Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  hintLevel: {
    type: Number,
    required: true,
  },
});

hintUnlockedSchema.statics.build = (attrs: HintUnlockedAttrs) => {
  return new Hint(attrs);
};

const Hint = mongoose.model<HintUnlockedDoc, HintUnlockedModel>(
  'Hint',
  hintUnlockedSchema
);

export default HintUnlocked;

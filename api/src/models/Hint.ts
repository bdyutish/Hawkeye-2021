import mongoose, { Types } from 'mongoose';
import { QuestionDoc } from './Question';

export interface HintAttrs {
  question: QuestionDoc | mongoose.Schema.Types.ObjectId;
  hintText: String;
  level: Number;
}

export interface HintDoc extends mongoose.Document {
  question: QuestionDoc | any | Types.ObjectId;
  hintText: String;
  level: Number;
}
interface HintModel extends mongoose.Model<HintDoc> {
  build(attrs: HintAttrs): HintDoc;
}

const hintSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  hintText: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    enum: [1, 2, 3],
    required: true,
  },
  isUnlocked: {
    type: Boolean,
    default: false,
  },
});

hintSchema.statics.build = (attrs: HintAttrs) => {
  return new Hint(attrs);
};

const Hint = mongoose.model<HintDoc, HintModel>('Hint', hintSchema);

export default Hint;

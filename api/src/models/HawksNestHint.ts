import mongoose, { Types } from 'mongoose';
import { HawksNestQuestionDoc } from './HawksNestQuestion';

export interface HawksNestHintAttrs {
  question: HawksNestQuestionDoc | mongoose.Schema.Types.ObjectId;
  hintText: String;
  level: Number;
}

export interface HawksNestHintDoc extends mongoose.Document {
  question: HawksNestQuestionDoc | any | Types.ObjectId;
  hintText: String;
  level: Number;
}
interface HawksNestHintModel extends mongoose.Model<HawksNestHintDoc> {
  build(attrs: HawksNestHintAttrs): HawksNestHintDoc;
}

const HawksNestHintSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HawksNestQuestion',
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
});

HawksNestHintSchema.statics.build = (attrs: HawksNestHintAttrs) => {
  return new Hint(attrs);
};

const Hint = mongoose.model<HawksNestHintDoc, HawksNestHintModel>(
  'HawksNestHint',
  HawksNestHintSchema
);

export default Hint;

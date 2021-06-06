import mongoose, { Types } from 'mongoose';
import { QuestionDoc } from './Question';

interface HawksNestHintUnlockedAttrs {
  question: number;
  hintLevel: number;
}

export interface HawksNestHintUnlockedDoc extends mongoose.Document {
  question: number;
  hintLevel: number;
}

interface HawksNestHintUnlockedModel
  extends mongoose.Model<HawksNestHintUnlockedDoc> {
  build(attrs: HawksNestHintUnlockedAttrs): HawksNestHintUnlockedDoc;
}

const HawksNestHintUnlockedSchema = new mongoose.Schema({
  question: {
    type: Number,
    required: true,
  },
  hintLevel: {
    type: Number,
    required: true,
  },
});

export default mongoose.model<
  HawksNestHintUnlockedDoc,
  HawksNestHintUnlockedModel
>('UnlockedHawksNestHint', HawksNestHintUnlockedSchema);

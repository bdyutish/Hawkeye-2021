import mongoose from 'mongoose';

export interface IPDoc extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  ip: string;
  time: Date;
}

const IPSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ip: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    defualt: Date.now,
  },
});

export default mongoose.model<IPDoc>('IP', IPSchema);

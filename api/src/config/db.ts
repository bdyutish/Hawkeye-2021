import mongoose from "mongoose";

export const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("connnection unsuccessful");
    process.exit(0);
  }
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  console.log(`MongoDB connected: ${conn.connection.host}`);
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("\nMongo disconnected...");
  } catch (err) {
    console.log("Err disconnecting to mongo: ", err);
  }
};

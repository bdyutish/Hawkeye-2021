import { app } from './app';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

//Load Config
dotenv.config();

// if (!process.env.PORT) {
//   throw new Error('process.env.PORT is missing');
// }
// Connect to db
app.listen(process.env.PORT || 4000, async () => {
  try {
    console.log(`Listening at port: ${process.env.PORT || 4000}....`);
    await connectDB();
  } catch (err) {
    console.log('Connection to mongo unsuccessful...\n' + err);
    process.exit();
  }
});

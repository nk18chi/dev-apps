import mongoose from 'mongoose';
import config from 'config';

const MONGO_URI: string = config.get('DATABASE.URI');

const connectDatabase = async () => {
  try {
    const db = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log('Successfuly connected to mongo', MONGO_URI);
    return db;
  } catch (e) {
    console.log('Error connecting to mongo', e);
  }
};

export default connectDatabase;

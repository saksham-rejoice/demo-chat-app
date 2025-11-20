import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("db connected successfully");
    return connection;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;

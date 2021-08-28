import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
  },
  {
    collection: 'Users',
    timestamps: true,
  }
);

export const User =
  mongoose.models.Users || mongoose.model('Users', UserSchema);

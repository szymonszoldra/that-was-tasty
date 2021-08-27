import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import passportLocalMongoose from 'passport-local-mongoose';
import isEmail from 'validator/lib/isEmail';

export interface User {
  email: string,
  name: string,
}

export interface UserDocument extends User, mongoose.Document {
  created: Date,
  hash: string,
  // eslint-disable-next-line no-unused-vars
  register(user: UserDocument, password: string): Promise<void>,
}

const UserSchema = new mongoose.Schema<UserDocument>({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: 'You have to supply an email',
    validate: [isEmail, 'This is not the correct email!'],
  },
  name: {
    type: String,
    required: 'You have to supply a name',
    trim: true,
  },
});

// @ts-ignore
UserSchema.plugin(uniqueValidator);
// @ts-ignore
UserSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
});

export default mongoose.model<UserDocument>('User', UserSchema);

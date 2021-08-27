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
}

export interface UserModel extends mongoose.Model<UserDocument> {
    // eslint-disable-next-line no-unused-vars
  checkIfEmailInUse(email: string): Promise<boolean>,
    // eslint-disable-next-line no-unused-vars
  register(user: UserDocument, password: string): Promise<void>
}

const UserSchema = new mongoose.Schema<UserDocument, UserModel>({
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

UserSchema.statics.checkIfEmailInUse = async function (
  this: mongoose.Model<UserDocument>,
  email: string,
): Promise<boolean> {
  const user = await this.findOne({ email });
  return Boolean(user);
};

export default mongoose.model<UserDocument, UserModel>('User', UserSchema);

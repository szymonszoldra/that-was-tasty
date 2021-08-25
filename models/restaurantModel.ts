import mongoose from 'mongoose';

export interface RestaurantInput {
  name: string,
  slug: string,
  photo: string,
  tags?: Array<string>,
  user: mongoose.Types.ObjectId,
  meals?: Array<mongoose.Types.ObjectId>,
  location: {
    type: string,
    coordinates: [number, number],
    address: string
  }
}

export interface RestaurantDocument extends RestaurantInput, mongoose.Document {
  created: Date
}

const RestaurantSchema = new mongoose.Schema<RestaurantDocument>({
  name: {
    type: String,
    trim: true,
    required: 'Restaurant must have a name',
  },
  slug: String,
  tags: [String],
  created: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: [{
      type: Number,
      required: 'Restaurant must have coordinates',
    }],
    address: {
      type: String,
      required: 'Restaurant must have an addess',
    },
    photo: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: 'You have to be logged in',
    },
    meals: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meal',
    }],
  },
});

export default mongoose.model<RestaurantDocument>('Restaurant', RestaurantSchema);

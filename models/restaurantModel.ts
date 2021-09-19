import mongoose from 'mongoose';
import slugify from 'slugify';

export interface RestaurantInput {
  name: string,
  photo: string,
  description: string,
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
  slug: string,
  created: Date
}

const RestaurantSchema = new mongoose.Schema<RestaurantDocument>({
  name: {
    type: String,
    trim: true,
    required: 'Restaurant must have a name',
  },
  description: String,
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
});

RestaurantSchema.pre('save', function (this: RestaurantDocument, next: mongoose.HookNextFunction) {
  if (!this.isModified('name')) {
    return next();
  }

  this.slug = slugify(this.name, {
    lower: true,
  });

  return next();
});

export default mongoose.model<RestaurantDocument>('Restaurant', RestaurantSchema);

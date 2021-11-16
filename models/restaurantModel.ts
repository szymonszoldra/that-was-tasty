/* eslint-disable prefer-arrow-callback */
import mongoose from 'mongoose';
import slugify from 'slugify';

export interface RestaurantInput {
  name: string,
  photo: string,
  tags?: Array<string>,
  user: mongoose.Types.ObjectId,
  meals?: Array<mongoose.Types.ObjectId>,
  location: {
    type: string,
    coordinates: number[],
    address: string
  }
}

export interface RestaurantDocument extends RestaurantInput, mongoose.Document {
  slug: string,
  map?: string,
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
  map: String,
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

RestaurantSchema.pre<RestaurantDocument>('save', function (this: RestaurantDocument, next: mongoose.HookNextFunction): void {
  if (!this.isModified('name')) {
    return next();
  }

  this.slug = slugify(this.name, {
    lower: true,
  });

  return next();
});

// I don't know why but TS complains about findOneAndUpdate and it doesn't care it is valid
// @ts-ignore
RestaurantSchema.pre('findOneAndUpdate', async function (next: mongoose.HookNextFunction): Promise<void> {
  const docToUpdate = await this.model.findOne(this.getQuery());

  docToUpdate.slug = slugify(docToUpdate.name, {
    lower: true,
  });

  await docToUpdate.save();
  return next();
});

RestaurantSchema.statics.getTags = function (userId: string) {
  return this.aggregate([
    { $match: { user: userId } },
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } },
  ]);
};

export default mongoose.model<RestaurantDocument>('Restaurant', RestaurantSchema);

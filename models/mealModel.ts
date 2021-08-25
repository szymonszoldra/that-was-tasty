import mongoose from 'mongoose';

export interface MealInput {
  name: string,
  price: number,
  photo: string,
  ingredients: [string],
  description: string,
  restaurant: mongoose.Schema.Types.ObjectId
}

export interface MealDocument extends MealInput, mongoose.Document {
  created: Date
}

const MealSchema = new mongoose.Schema<MealDocument>({
  name: {
    type: String,
    trim: true,
    required: 'Meal must have a name',
  },
  created: {
    type: Date,
    default: Date.now,
  },
  photo: String,
  price: Number,
  ingredients: [String],
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    required: 'You have to specify the restaurant',
    ref: 'Restaurant',
  },
  description: String,
  review: {
    type: Number,
    min: 1,
    max: 5,
  },
});

export default mongoose.model<MealDocument>('Meal', MealSchema);

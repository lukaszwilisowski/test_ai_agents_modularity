import mongoose from 'mongoose';

declare global {
  var mongoose: {
    conn: mongoose.Mongoose | null;
    promise: Promise<mongoose.Mongoose> | null;
  };
}

export interface BaseProduct {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}
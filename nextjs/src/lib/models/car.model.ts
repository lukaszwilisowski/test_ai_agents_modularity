import mongoose, { Schema, Document } from "mongoose";
import connectDB from "@/lib/database/connection";

interface CarDocument extends Document {
  name: string;
  brand: string;
  price: number;
  year: number;
  color: string;
  mileage: number;
}

const carSchema = new Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    year: { type: Number, required: true },
    color: { type: String, required: true },
    mileage: { type: Number, required: true },
  },
  { timestamps: true }
);

const Car = mongoose.models.Car || mongoose.model("Car", carSchema);

export const carModel = {
  async findAll() {
    await connectDB();
    return Car.find({});
  },

  async create(data: any) {
    await connectDB();
    return Car.create(data);
  },

  async findById(id: string) {
    await connectDB();
    return Car.findById(id);
  },

  async updateById(id: string, data: any) {
    await connectDB();
    return Car.findByIdAndUpdate(id, data, { new: true });
  },

  async deleteById(id: string) {
    await connectDB();
    return Car.findByIdAndDelete(id);
  },
};
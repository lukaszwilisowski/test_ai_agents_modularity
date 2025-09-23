import mongoose, { Schema, Document } from "mongoose";
import connectDB from "@/lib/database/connection";

interface PlaneDocument extends Document {
  name: string;
  airline: string;
  price: number;
  capacity: number;
  model: string;
  range: number;
}

const planeSchema = new Schema(
  {
    name: { type: String, required: true },
    airline: { type: String, required: true },
    price: { type: Number, required: true },
    capacity: { type: Number, required: true },
    model: { type: String, required: true },
    range: { type: Number, required: true },
  },
  { timestamps: true }
);

const Plane = mongoose.models.Plane || mongoose.model("Plane", planeSchema);

export const planeModel = {
  async findAll() {
    await connectDB();
    return Plane.find({});
  },

  async create(data: any) {
    await connectDB();
    return Plane.create(data);
  },

  async findById(id: string) {
    await connectDB();
    return Plane.findById(id);
  },

  async updateById(id: string, data: any) {
    await connectDB();
    return Plane.findByIdAndUpdate(id, data, { new: true });
  },

  async deleteById(id: string) {
    await connectDB();
    return Plane.findByIdAndDelete(id);
  },
};

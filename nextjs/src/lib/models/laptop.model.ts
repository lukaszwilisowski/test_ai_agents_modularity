import mongoose, { Schema, type Document } from "mongoose";
import connectDB from "@/lib/database/connection";

interface LaptopDocument extends Document {
  name: string;
  description?: string;
  price: number;
  image?: string;
  brand: string;
  model: string;
  processor: string;
  ram: number;
  storage: number;
  screenSize: number;
  operatingSystem: "Windows" | "macOS" | "Linux" | "Chrome OS";
  inStock: boolean;
}

const laptopSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    processor: { type: String, required: true },
    ram: { type: Number, required: true },
    storage: { type: Number, required: true },
    screenSize: { type: Number, required: true },
    operatingSystem: {
      type: String,
      enum: ["Windows", "macOS", "Linux", "Chrome OS"],
      default: "Windows",
    },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Laptop =
  mongoose.models.Laptop ||
  mongoose.model<LaptopDocument>("Laptop", laptopSchema);

export const laptopModel = {
  async findAll() {
    await connectDB();
    return Laptop.find({});
  },

  async findById(id: string) {
    await connectDB();
    return Laptop.findById(id);
  },

  async create(data: any) {
    await connectDB();
    return Laptop.create(data);
  },

  async update(id: string, data: any) {
    await connectDB();
    return Laptop.findByIdAndUpdate(id, data, { new: true });
  },

  async delete(id: string) {
    await connectDB();
    return Laptop.findByIdAndDelete(id);
  },

  async createSampleData() {
    await connectDB();
    const existingLaptops = await Laptop.find({});
    if (existingLaptops.length > 0) {
      return existingLaptops;
    }

    const sampleLaptops = [
      {
        name: 'MacBook Pro 14"',
        description: "Powerful laptop for professionals with M3 chip",
        price: 1999,
        image:
          "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500",
        brand: "Apple",
        model: "MacBook Pro 14-inch",
        processor: "Apple M3",
        ram: 16,
        storage: 512,
        screenSize: 14,
        operatingSystem: "macOS",
        inStock: true,
      },
      {
        name: "Dell XPS 13",
        description: "Ultra-portable laptop with stunning display",
        price: 1299,
        image:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
        brand: "Dell",
        model: "XPS 13 9320",
        processor: "Intel Core i7-1260P",
        ram: 16,
        storage: 512,
        screenSize: 13.4,
        operatingSystem: "Windows",
        inStock: true,
      },
      {
        name: "ThinkPad X1 Carbon",
        description: "Business laptop with excellent keyboard and durability",
        price: 1599,
        image:
          "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500",
        brand: "Lenovo",
        model: "ThinkPad X1 Carbon Gen 11",
        processor: "Intel Core i7-1355U",
        ram: 32,
        storage: 1024,
        screenSize: 14,
        operatingSystem: "Windows",
        inStock: true,
      },
    ];

    return Laptop.create(sampleLaptops);
  },
};

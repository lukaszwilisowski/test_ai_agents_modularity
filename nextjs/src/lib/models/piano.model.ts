import connectDB from "@/lib/database/connection";
import mongoose, { Document, Schema } from "mongoose";

interface PianoDocument extends Document {
  name: string;
  description?: string;
  price: number;
  image?: string;
  brand: string;
  model: string;
  keys: number;
  type: "acoustic" | "digital" | "electric" | "hybrid";
  size: "upright" | "grand" | "baby-grand" | "compact" | "full-size";
  inStock: boolean;
}

const pianoSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    keys: { type: Number, default: 88 },
    type: {
      type: String,
      enum: ["acoustic", "digital", "electric", "hybrid"],
      default: "acoustic",
    },
    size: {
      type: String,
      enum: ["upright", "grand", "baby-grand", "compact", "full-size"],
      default: "upright",
    },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Piano =
  mongoose.models.Piano || mongoose.model<PianoDocument>("Piano", pianoSchema);

export const pianoModel = {
  async findAll() {
    await connectDB();
    return Piano.find({});
  },

  async findById(id: string) {
    await connectDB();
    return Piano.findById(id);
  },

  async create(data: any) {
    await connectDB();
    return Piano.create(data);
  },

  async update(id: string, data: any) {
    await connectDB();
    return Piano.findByIdAndUpdate(id, data, { new: true });
  },

  async delete(id: string) {
    await connectDB();
    return Piano.findByIdAndDelete(id);
  },

  async createSampleData() {
    await connectDB();
    const existingPianos = await Piano.find({});
    if (existingPianos.length > 0) {
      return existingPianos;
    }

    const samplePianos = [
      {
        name: "Yamaha U1",
        description:
          "Professional upright piano with exceptional touch and tone",
        price: 8999,
        image:
          "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=500",
        brand: "Yamaha",
        model: "U1",
        keys: 88,
        type: "acoustic",
        size: "upright",
        inStock: true,
      },
      {
        name: "Steinway Model S",
        description: "Premium baby grand piano with world-class sound",
        price: 89999,
        image:
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
        brand: "Steinway",
        model: "Model S",
        keys: 88,
        type: "acoustic",
        size: "baby-grand",
        inStock: true,
      },
      {
        name: "Roland FP-90X",
        description: "Premium digital piano with SuperNATURAL Piano sound",
        price: 2199,
        image:
          "https://images.unsplash.com/photo-1571974599782-87c1e85c7a8a?w=500",
        brand: "Roland",
        model: "FP-90X",
        keys: 88,
        type: "digital",
        size: "full-size",
        inStock: true,
      },
    ];

    return Piano.create(samplePianos);
  },
};

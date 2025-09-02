import mongoose, { Schema, Document } from 'mongoose';
import connectDB from '@/lib/database/connection';

interface GuitarDocument extends Document {
  name: string;
  description?: string;
  price: number;
  image?: string;
  brand: string;
  model: string;
  strings: number;
  bodyType: 'solid' | 'hollow' | 'semi-hollow';
  inStock: boolean;
}

const guitarSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  strings: { type: Number, default: 6 },
  bodyType: { type: String, enum: ['solid', 'hollow', 'semi-hollow'], default: 'solid' },
  inStock: { type: Boolean, default: true },
}, { timestamps: true });

const Guitar = mongoose.models.Guitar || mongoose.model<GuitarDocument>('Guitar', guitarSchema);

export const guitarModel = {
  async findAll() {
    await connectDB();
    return Guitar.find({});
  },

  async findById(id: string) {
    await connectDB();
    return Guitar.findById(id);
  },

  async create(data: any) {
    await connectDB();
    return Guitar.create(data);
  },

  async update(id: string, data: any) {
    await connectDB();
    return Guitar.findByIdAndUpdate(id, data, { new: true });
  },

  async delete(id: string) {
    await connectDB();
    return Guitar.findByIdAndDelete(id);
  },

  async createSampleData() {
    await connectDB();
    const existingGuitars = await Guitar.find({});
    if (existingGuitars.length > 0) {
      return existingGuitars;
    }

    const sampleGuitars = [
      {
        name: 'Fender Stratocaster',
        description: 'Classic electric guitar with versatile sound',
        price: 1299,
        image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500',
        brand: 'Fender',
        model: 'Player Stratocaster',
        strings: 6,
        bodyType: 'solid',
        inStock: true,
      },
      {
        name: 'Gibson Les Paul',
        description: 'Iconic rock guitar with rich, warm tone',
        price: 2499,
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500',
        brand: 'Gibson',
        model: 'Les Paul Standard',
        strings: 6,
        bodyType: 'solid',
        inStock: true,
      },
      {
        name: 'Taylor 814ce',
        description: 'Premium acoustic guitar with electronics',
        price: 3999,
        image: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=500',
        brand: 'Taylor',
        model: '814ce',
        strings: 6,
        bodyType: 'hollow',
        inStock: true,
      }
    ];

    return Guitar.create(sampleGuitars);
  }
};
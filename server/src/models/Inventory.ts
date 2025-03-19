import mongoose, { Document, Schema } from 'mongoose';

export interface IInventory extends Document {
  itemName: string;
  partNumber: string;
  category: 'RPM' | 'Utility Panel' | 'Handheld' | 'Other';
  workingGroup: 'Smart Click' | 'F.E.';
  quantity: number;
  barcode: string;
  lastUpdated: Date;
}

const inventorySchema = new Schema<IInventory>({
  itemName: {
    type: String,
    required: true,
  },
  partNumber: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['RPM', 'Utility Panel', 'Handheld', 'Other'],
  },
  workingGroup: {
    type: String,
    required: true,
    enum: ['Smart Click', 'F.E.'],
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  barcode: {
    type: String,
    required: true,
    unique: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Generate barcode before saving
inventorySchema.pre('save', async function(next) {
  if (!this.isModified('barcode')) {
    // Generate a unique barcode if not provided
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.barcode = `SHV${timestamp.slice(-6)}${random}`;
  }
  next();
});

export const Inventory = mongoose.model<IInventory>('Inventory', inventorySchema); 
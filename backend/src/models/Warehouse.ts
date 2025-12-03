// src/models/Warehouse.ts

import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User'; // Import user interface for referencing

export interface IWarehouse extends Document {
  warehouseName: string;
  ownerName: string;
  capacity: number;
  location: string;
  description?: string;
  price: number;
  images: string[];
  walletAddress: string;
  isBooked: boolean;

  // --- NEW FIELDS FOR BOOKING DETAILS ---
  bookedBy?: IUser['_id']; // Reference to the user who booked
  cropType?: string;
  cropQuantity?: number;
  duration?: number; // in months
  insurance?: boolean;
  transactionHash?: string;
  bookingTimestamp?: Date;
}

const WarehouseSchema: Schema = new Schema({
  warehouseName: { type: String, required: true },
  ownerName: { type: String, required: true },
  capacity: { type: Number, required: true },
  location: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  images: [{ type: String, required: true }],
  walletAddress: { type: String, required: true },
  isBooked: { type: Boolean, default: false },

  // --- SCHEMA DEFINITION FOR NEW FIELDS ---
  // These are not required on creation, only on booking
  bookedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  cropType: { type: String },
  cropQuantity: { type: Number },
  duration: { type: Number },
  insurance: { type: Boolean },
  transactionHash: { type: String },
  bookingTimestamp: { type: Date },

}, { timestamps: true });

export default mongoose.model<IWarehouse>('Warehouse', WarehouseSchema);
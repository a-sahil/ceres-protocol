// src/controllers/warehouseController.ts

import { Request, Response } from 'express';
import Warehouse from '../models/Warehouse';

// No changes needed for registerWarehouse, but ensure it's here
export const registerWarehouse = async (req: Request, res: Response) => {
  try {
    const { warehouseName, ownerName, capacity, location, description, price, walletAddress } = req.body;

    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({ message: 'At least one image is required.' });
    }

    const images = (req.files as Express.Multer.File[]).map(file => file.path);

    const newWarehouse = new Warehouse({
      warehouseName,
      ownerName,
      capacity,
      location,
      description,
      price,
      images,
      walletAddress,
      isBooked: false,
    });

    const savedWarehouse = await newWarehouse.save();
    res.status(201).json(savedWarehouse);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    } else {
        res.status(500).json({ message: 'An unknown server error occurred' });
    }
  }
};


// --- UPDATED bookWarehouse FUNCTION ---
// @desc    Mark a warehouse as booked and save booking details
// @route   PUT /api/warehouses/:id/book
export const bookWarehouse = async (req: Request, res: Response) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);

    if (!warehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }
    
    if (warehouse.isBooked) {
        return res.status(400).json({ message: 'Warehouse is already booked' });
    }
    
    // 1. Get the new booking details from the request body
    const { cropType, cropQuantity, duration, insurance, transactionHash } = req.body;

    // 2. Validate that the required data was sent
    if (!cropType || cropQuantity === undefined || duration === undefined || !transactionHash) {
        return res.status(400).json({ message: 'Missing required booking details in request body.' });
    }

    // 3. Update the warehouse document with all the new details
    warehouse.isBooked = true;
    warehouse.cropType = cropType;
    warehouse.cropQuantity = cropQuantity;
    warehouse.duration = duration;
    warehouse.insurance = !!insurance; // Ensure it's a boolean
    warehouse.transactionHash = transactionHash;
    warehouse.bookingTimestamp = new Date();
    warehouse.bookedBy = req.user._id; // Get user ID from the 'protect' middleware

    // 4. Save the updated document to the database
    const updatedWarehouse = await warehouse.save();

    res.json({ message: 'Warehouse booked successfully', warehouse: updatedWarehouse });

  } catch (error) {
     if (error instanceof Error) {
        res.status(500).json({ message: 'Server Error during booking', error: error.message });
    } else {
        res.status(500).json({ message: 'An unknown server error occurred' });
    }
  }
};


// --- No changes needed for the functions below ---
export const getWarehouses = async (req: Request, res: Response) => {
  try {
    const warehouses = await Warehouse.find({}).sort({ createdAt: -1 });
    res.json(warehouses);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching warehouses' });
  }
};

export const getWarehouseById = async (req: Request, res: Response) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);

    if (warehouse) {
      res.json(warehouse);
    } else {
      res.status(404).json({ message: 'Warehouse not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
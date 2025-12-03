export interface IWarehouse {
  _id: string; // Add ID for identifying warehouses
  warehouseName: string;
  ownerName: string;
  capacity: string;
  location: string;
  price: number; // Price is a number
  description?: string;
  images: string[];
  // --- ADD NEW FIELDS ---
  walletAddress: string;
  isBooked: boolean;
  createdAt: string; // Useful for sorting
}
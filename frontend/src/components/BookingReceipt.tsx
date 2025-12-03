// src/components/BookingReceipt.tsx

import { IWarehouse } from "@/lib/types";
import { Button } from "./ui/button";
import { CheckCircle, Download } from "lucide-react";

interface BookingReceiptProps {
  warehouse: IWarehouse;
  transactionHash: string;
  cropType: string;
  cropQuantity: number;
  duration: number;
  insurance: boolean;
  timestamp: string;
  onClose: () => void;
}

export const BookingReceipt = ({
  warehouse,
  transactionHash,
  cropType,
  cropQuantity,
  duration,
  insurance,
  timestamp,
  onClose,
}: BookingReceiptProps) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card rounded-2xl p-8 max-w-lg w-full relative">
        <div className="text-center mb-6">
          <CheckCircle className="h-16 w-16 text-secondary mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
          <p className="text-muted-foreground">Your receipt has been generated.</p>
        </div>
        <div className="space-y-3 text-sm bg-off-white p-4 rounded-lg border">
          <div className="flex justify-between font-medium text-base border-b pb-2 mb-2">
            <span>{warehouse.warehouseName}</span>
            <span>{warehouse.price} HBAR</span>
          </div>
          <div className="flex justify-between"><span className="text-muted-foreground">Warehouse ID:</span><span className="font-mono text-xs">{warehouse._id}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Location:</span><span>{warehouse.location}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Crop Type:</span><span>{cropType}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Crop Quantity:</span><span>{cropQuantity} Tons</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Duration:</span><span>{duration} Months</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Insurance:</span><span className={`font-medium ${insurance ? 'text-secondary' : 'text-destructive'}`}>{insurance ? 'Yes' : 'No'}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Timestamp:</span><span>{new Date(timestamp).toLocaleString()}</span></div>
          <div className="flex justify-between items-center pt-2 border-t mt-2">
            <span className="text-muted-foreground">Tx Hash:</span>
            <a href={`https://hashscan.io/testnet/transaction/${transactionHash}`} target="_blank" rel="noopener noreferrer" className="font-medium text-secondary truncate max-w-[150px] hover:underline">
              {transactionHash}
            </a>
          </div>
        </div>
        <div className="mt-6">
            <Button variant="outline" className="w-full" onClick={onClose}>
                <Download className="mr-2 h-4 w-4" />
                Close & Return to Dashboard
            </Button>
        </div>
      </div>
    </div>
  );
};
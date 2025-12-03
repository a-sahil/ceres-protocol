
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { IWarehouse } from "@/lib/types";

export interface BookingDetails {
  cropType: string;
  cropQuantity: number;
  duration: number;
  insurance: boolean;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: BookingDetails) => void;
  warehouse: IWarehouse;
  isSubmitting: boolean;
}

export const BookingModal = ({ isOpen, onClose, onSubmit, warehouse, isSubmitting }: BookingModalProps) => {
  const [cropType, setCropType] = useState("");
  const [cropQuantity, setCropQuantity] = useState<number | "">("");
  const [duration, setDuration] = useState<number | "">("");
  const [insurance, setInsurance] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!cropType || !cropQuantity || !duration) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields to proceed with the booking.",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      cropType,
      cropQuantity: Number(cropQuantity),
      duration: Number(duration),
      insurance,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Your Booking</DialogTitle>
          <DialogDescription>
            Enter details for your crop storage at {warehouse.warehouseName}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cropType" className="text-right">
              Crop Type
            </Label>
            <Select onValueChange={setCropType} value={cropType}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a crop" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Wheat">Wheat</SelectItem>
                <SelectItem value="Rice">Rice</SelectItem>
                <SelectItem value="Coffee">Coffee</SelectItem>
                <SelectItem value="Corn">Corn</SelectItem>
                <SelectItem value="Soybeans">Soybeans</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cropQuantity" className="text-right">
              Quantity (Tons)
            </Label>
            <Input
              id="cropQuantity"
              type="number"
              value={cropQuantity}
              onChange={(e) => setCropQuantity(Number(e.target.value))}
              className="col-span-3"
              placeholder="e.g., 50"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              Duration (Months)
            </Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="col-span-3"
              placeholder="e.g., 6"
            />
          </div>
          <div className="flex items-center space-x-2 col-start-2 col-span-3">
            <Checkbox id="insurance" checked={insurance} onCheckedChange={(checked) => setInsurance(!!checked)} />
            <label
              htmlFor="insurance"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Opt-in for Insurance
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting} variant="hero">
            {isSubmitting ? "Processing..." : "Confirm & Pay"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
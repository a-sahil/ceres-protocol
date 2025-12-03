// src/pages/Listings.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, MapPin, Star, Shield, Camera, Grid3x3, List, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllWarehouses } from "@/lib/api";
import { IWarehouse } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { useWriteContract } from 'wagmi';
import { useToast } from '@/hooks/use-toast';
import { daoContractAddress, daoContractAbi } from '@/lib/daoContract';


import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Listings = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(true);

  const { data: warehouses, isLoading, isError } = useQuery({
    queryKey: ['warehouses'],
    queryFn: getAllWarehouses,
  });

  const { writeContract } = useWriteContract();
  const { toast } = useToast();

  // Modal state for claim proposal
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimProposalText, setClaimProposalText] = useState('');
  const [claiming, setClaiming] = useState(false);
  const [claimWarehouse, setClaimWarehouse] = useState<IWarehouse | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Failed to load warehouses.</div>;
  }

  const handleInitiateClaim = (warehouse: IWarehouse) => {
    setClaimWarehouse(warehouse);
    setClaimProposalText(`Insurance claim for warehouse: ${warehouse.warehouseName} (ID: ${warehouse._id})`);
    setShowClaimModal(true);
  };

  const handleSubmitClaimProposal = async () => {
    if (!claimProposalText.trim() || !claimWarehouse) {
      toast({ title: 'Proposal Required', description: 'Please enter a proposal description.', variant: 'destructive' });
      return;
    }
    setClaiming(true);
    try {
      await (writeContract as any)({
        address: daoContractAddress,
        abi: daoContractAbi,
        functionName: 'createProposal',
        args: [claimProposalText],
      }, {
        onSuccess: () => {
          toast({
            title: "Proposal Created",
            description: "Your insurance claim has been submitted to the DAO for voting.",
          });
          setShowClaimModal(false);
          setClaimProposalText('');
          setClaimWarehouse(null);
          navigate("/dao");
        },
        onError: (error: any) => {
          toast({
            title: "Failed to Create Proposal",
            description: error?.message ?? String(error),
            variant: "destructive",
          });
        },
      });
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 lg:px-6 py-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, Farmer!</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Showing warehouses near Ghaziabad, Uttar Pradesh
          </p>
        </div>
      </div>

      <div className="flex-1 bg-off-white">
        <div className="container mx-auto px-4 lg:px-6 py-6">
          <div className="grid lg:grid-cols-4 gap-6">
            <div className={`lg:col-span-1 ${filtersOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-card rounded-xl p-6 space-y-6 sticky top-20">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Filters</h2>
                  <Button variant="ghost" size="sm" onClick={() => setFiltersOpen(false)} className="lg:hidden">
                    Close
                  </Button>
                </div>
                <div className="space-y-3">
                  <Label>Distance (km)</Label>
                  <Slider defaultValue={[10]} max={50} step={1} className="[&_[role=slider]]:bg-secondary" />
                  <p className="text-xs text-muted-foreground">Within 10 km</p>
                </div>
                <div className="space-y-3">
                  <Label>Capacity (tons)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="number" placeholder="Min" className="h-9" />
                    <Input type="number" placeholder="Max" className="h-9" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>Minimum Rating</Label>
                  <div className="space-y-2">
                    {[4, 3, 2].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <Checkbox id={`rating-${rating}`} />
                        <label htmlFor={`rating-${rating}`} className="text-sm flex items-center gap-1">
                          {rating}+ <Star className="h-3 w-3 fill-secondary text-secondary" />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <Button variant="hero" className="w-full">Apply Filters</Button>
                <Button variant="ghost" className="w-full text-secondary">Clear All</Button>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div className="bg-card rounded-xl p-4 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search warehouses by name, location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                  ><Grid3x3 className="h-4 w-4" /></Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                  ><List className="h-4 w-4" /></Button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <p className="text-muted-foreground">Showing {warehouses?.length || 0} warehouses</p>
              </div>

              <div className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                {warehouses?.map((warehouse: IWarehouse) => (
                  <div key={warehouse._id} className="card-lift bg-card rounded-xl overflow-hidden border border-border shadow-sm">
                    <div className="relative h-48 bg-muted">
                      {warehouse.isBooked && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                          <Badge variant="destructive" className="text-lg py-2 px-4">BOOKED</Badge>
                        </div>
                      )}
                      {warehouse.images && warehouse.images.length > 0 ? (
                        <img 
                          src={`http://localhost:5000/${warehouse.images[0].replace(/\\/g, '/')}`}
                          alt={warehouse.warehouseName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          <Camera className="h-12 w-12" />
                        </div>
                      )}
                    </div>

                    <div className="p-5 space-y-4">
                      <div>
                        <h3 className="font-bold text-lg mb-1">{warehouse.warehouseName}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <MapPin className="h-3 w-3" />
                          <span>{warehouse.location}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center py-3 border-y border-border">
                        <div>
                          <p className="text-xs text-muted-foreground">Capacity</p>
                          <p className="text-sm font-semibold">{warehouse.capacity} tons</p>
                        </div>
                        <div className="border-l border-border">
                          <p className="text-xs text-muted-foreground">Owner</p>
                          <p className="text-sm font-semibold">{warehouse.ownerName}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-2xl font-bold text-primary">
                          {warehouse.price ? `${warehouse.price.toLocaleString()}` : 'N/A'}
                        </p>
                        <p className="text-xs text-muted-foreground">HBAR/ton/month</p>
                      </div>

                      {/* --- ACTION BUTTONS --- */}
                      <div className="pt-2">
                        {warehouse.isBooked ? (
                          <Button variant="hero" className="w-full"
                            onClick={() => handleInitiateClaim(warehouse)}
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            Initiate Insurance Claim
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => navigate(`/warehouse/${warehouse._id}`)}
                          >
                            View & Book
                          </Button>
                        )}
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={showClaimModal} onOpenChange={setShowClaimModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Initiate Insurance Claim Proposal</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter proposal description..."
            value={claimProposalText}
            onChange={e => setClaimProposalText(e.target.value)}
            disabled={claiming}
            className="mb-4"
          />
          <Button onClick={handleSubmitClaimProposal} disabled={claiming || !claimProposalText.trim()} className="w-full">
            {claiming ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Submit Proposal
          </Button>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default Listings;
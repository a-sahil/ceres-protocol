import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, FileText, Check, X, Loader2, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { daoContractAddress, daoContractAbi } from '@/lib/daoContract';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Warehouse QR Modal Component
const WarehouseQRModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Warehouse Details</DialogTitle>
          <DialogDescription>
            Ceres Protocol Warehouse - Scan QR Code
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <img
              src="/qr.png"
              alt="Warehouse QR Code"
              className="w-56 h-56"
            />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold">Ceres Protocol Storage</h3>
            <p className="text-sm text-muted-foreground mt-2">Warehouse Name: Central Distribution Hub</p>
            <p className="text-sm text-muted-foreground">Scan this QR code to view warehouse details</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ProposalCard = ({ proposalId, totalMembers }: { proposalId: bigint; totalMembers: number }) => {
  const { address } = useAccount();
  const { toast } = useToast();
  const [showWarehouseQR, setShowWarehouseQR] = useState(false);

  // Correctly initialize the wagmi hooks
  const { writeContractAsync: voteAsync, isPending: isVotePending } = useWriteContract();
  const { writeContractAsync: countAsync, isPending: isCountPending } = useWriteContract();

  const { data: proposal, isLoading, isError, refetch } = useReadContract({
    address: daoContractAddress,
    abi: daoContractAbi,
    functionName: 'proposals',
    args: [proposalId],
  });

  const isWritePending = isVotePending || isCountPending;

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center p-6 min-h-[200px]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </Card>
    );
  }

  if (isError || !proposal || !proposal[4]) { // proposal[4] is the 'exists' boolean
    return (
      <Card className="p-6">
        <CardTitle className="text-destructive">Error</CardTitle>
        <CardDescription>Could not load proposal #{proposalId.toString()}.</CardDescription>
      </Card>
    );
  }

  const [id, description, yesVotes, noVotes, exists, counted] = proposal;
  const currentTotalVotes = Number(yesVotes) + Number(noVotes);
  const forPercentage = totalMembers > 0 ? (Number(yesVotes) / totalMembers) * 100 : 0;
  const againstPercentage = totalMembers > 0 ? (Number(noVotes) / totalMembers) * 100 : 0;

  let status: 'Active' | 'Passed' | 'Failed' = 'Active';
  if (counted) {
    status = yesVotes > noVotes ? 'Passed' : 'Failed';
  }

  const handleVote = async (support: boolean) => {
    if (!address) {
      toast({ title: "Vote Failed", description: "Wallet not connected.", variant: "destructive" });
      return;
    }
    try {
      // Pass the full configuration object to the write function
      await voteAsync({
        address: daoContractAddress,
        abi: daoContractAbi,
        functionName: 'vote',
        args: [proposalId, support], // Pass bigint directly, wagmi handles it
      });
      toast({ title: "Vote Cast!", description: `You have successfully voted on Proposal #${id.toString()}.` });
      setTimeout(() => refetch(), 3000);
    } catch (error: any) {
      toast({ title: "Vote Failed", description: error?.shortMessage ?? error.message, variant: "destructive" });
    }
  };

  const handleCountVote = async () => {
    if (!address) {
      toast({ title: "Wallet Not Connected", description: "Please connect your wallet to finalize.", variant: "destructive" });
      return;
    }
    try {
      await countAsync({
        address: daoContractAddress,
        abi: daoContractAbi,
        functionName: 'countVote',
        args: [proposalId, address],
      });
      toast({ title: "Vote Finalized", description: `The vote for Proposal #${id.toString()} has been tallied.` });
      setTimeout(() => refetch(), 3000);
    } catch (error: any) {
      toast({ title: "Finalization Failed", description: error?.shortMessage ?? error.message, variant: "destructive" });
    }
  };

  return (
    <>
      <Card className="card-lift">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg pr-4">Proposal #{id.toString()}</CardTitle>
            <Badge variant={status === "Active" ? "default" : status === "Passed" ? "secondary" : "destructive"}>
              {status}
            </Badge>
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-secondary">{Number(yesVotes)} For ({forPercentage.toFixed(0)}%)</span>
              <span className="font-medium text-destructive">{Number(noVotes)} Against ({againstPercentage.toFixed(0)}%)</span>
            </div>
            <Progress value={(currentTotalVotes / totalMembers) * 100} className="h-3" />
            <p className="text-xs text-muted-foreground mt-2">{currentTotalVotes} of {totalMembers} members have voted.</p>
          </div>
        </CardContent>
        {!counted && (
          <CardFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="secondary" className="w-full" onClick={() => handleVote(true)} disabled={isWritePending}>
              {isWritePending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Check className="mr-2 h-4 w-4" />} Vote For
            </Button>
            <Button variant="destructive" className="w-full" onClick={() => handleVote(false)} disabled={isWritePending}>
               {isWritePending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <X className="mr-2 h-4 w-4" />} Vote Against
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setShowWarehouseQR(true)}>
              <QrCode className="mr-2 h-4 w-4" /> View Warehouse
            </Button>
            <Button variant="outline" className="w-full" onClick={handleCountVote} disabled={isWritePending}>
              Finalize Vote
            </Button>
          </CardFooter>
        )}
      </Card>
      <WarehouseQRModal isOpen={showWarehouseQR} onClose={() => setShowWarehouseQR(false)} />
    </>
  );
};


const DaoPage = () => {
  // Hardcoded DAO member addresses for display purposes
  const daoMembers = [
    "0xe8fa5c28ca55b1dfbb6bcdbace5a6f22f487d662",
    "0x49c2e4db36d3ac470ad072ddc17774257a043097",
    "0x5300291345607c4a253a27654b740274e1e82203",
    "0x486bea6b90243d2ff3ee2723a47605c3361c3d95",
    "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
  ];
  const totalMembers = daoMembers.length;

  const { data: proposalCount, isLoading: isLoadingCount } = useReadContract({
    address: daoContractAddress,
    abi: daoContractAbi,
    functionName: 'proposalCount',
  });

  return (
    <div className="min-h-screen flex flex-col bg-off-white">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              DAO Governance
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Participate in the decision-making process of the Ceres Protocol.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Proposals Section */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                Active & Past Proposals
              </h2>
              {isLoadingCount ? (
                <div className="text-center p-10">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  <p className="mt-4 text-muted-foreground">Fetching proposals...</p>
                </div>
              ) : (Number(proposalCount) > 0 ? (
                Array.from({ length: Number(proposalCount) }, (_, i) => (
                  <ProposalCard key={i} proposalId={BigInt(i)} totalMembers={totalMembers} />
                ))
              ) : (
                <p className="text-muted-foreground text-center p-10">No proposals found.</p>
              ))}
            </div>

            {/* Members Section */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 animate-slide-up">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    DAO Members
                  </CardTitle>
                  <CardDescription>
                    There are currently {totalMembers} voting members in the DAO.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {daoMembers.map((address, index) => (
                      <li key={index} className="flex items-center gap-3 text-sm font-mono bg-off-white p-2 rounded-md">
                        <span className="text-muted-foreground">#{index + 1}</span>
                        <span className="truncate text-foreground" title={address}>
                          {`${address.substring(0, 8)}...${address.substring(address.length - 6)}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DaoPage;
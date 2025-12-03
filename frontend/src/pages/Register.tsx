import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, ArrowLeft, ArrowRight, Warehouse, User, Package, FileText, Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useMutation } from "@tanstack/react-query";
import { registerWarehouse } from "@/lib/api";
import { Wallet } from "lucide-react";

const steps = [
  { number: 1, title: "Basic Info", icon: User },
  { number: 2, title: "Details & Photos", icon: Package },
  { number: 3, title: "Verification", icon: FileText },
  { number: 4, title: "Review", icon: Check },
];

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    warehouseName: "",
    ownerName: "",
    capacity: "",
    price:"",
    walletAddress: "",
    idType: "",
    idNumber: "",
    location: "",
    description: "",
    agreeToTerms: false,
  });
  const [warehouseImages, setWarehouseImages] = useState<File[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const mutation = useMutation({
    mutationFn: registerWarehouse,
    onSuccess: () => {
      toast({
        title: "Registration Submitted!",
        description: "Your warehouse registration is being reviewed. Thank you!",
      });
      navigate("/listings"); // Or a thank you page
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Could not submit registration.",
        variant: "destructive",
      });
    },
  });

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setWarehouseImages((prev) => [...prev, ...newFiles].slice(0, 5)); // Max 5 images as per backend
    }
  };

  const removeImage = (index: number) => {
    setWarehouseImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // Create FormData object
    const submissionData = new FormData();

    // Append all text fields
    Object.entries(formData).forEach(([key, value]) => {
      submissionData.append(key, String(value));
    });

    // Append all image files
    warehouseImages.forEach((file) => {
      submissionData.append("images", file); // Key MUST be "images" to match backend multer config
    });
    
    mutation.mutate(submissionData);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepComplete = (step: number) => {
      if (step === 1) return formData.warehouseName && formData.ownerName && formData.capacity && formData.price && formData.walletAddress;
    if (step === 2) return formData.location && warehouseImages.length > 0;
    if (step === 3) return formData.idType && formData.idNumber;
    return step < currentStep;
  };

  return (
    <div className="min-h-screen flex flex-col bg-off-white">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <div className="flex items-center justify-between relative">
                <div className="absolute top-6 left-0 right-0 h-0.5 bg-border -z-10 hidden md:block">
                  <div
                    className="h-full bg-secondary transition-all duration-500"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                  />
                </div>
                {steps.map((step) => (
                  <div key={step.number} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 mb-2 ${
                        step.number === currentStep
                          ? "bg-gradient-to-br from-secondary to-mint text-primary-foreground shadow-lg scale-110"
                          : isStepComplete(step.number) || step.number < currentStep
                          ? "bg-secondary text-primary-foreground"
                          : "bg-card border-2 border-border text-muted-foreground"
                      }`}
                    >
                      {(isStepComplete(step.number) || step.number < currentStep) && step.number !== currentStep ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </div>
                    <p className={`text-xs md:text-sm font-medium text-center ${
                      step.number === currentStep ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {step.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-2xl p-6 md:p-12 shadow-lg animate-fade-in">
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                  Register Your Warehouse
                </h1>
                <p className="text-muted-foreground">
                  Step {currentStep} of 4: {steps[currentStep - 1].title}
                </p>
              </div>
              <div className="space-y-6 mb-8">
                {currentStep === 1 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="warehouseName">Warehouse Name *</Label>
                      <Input id="warehouseName" placeholder="e.g., Green Valley Storage Facility" value={formData.warehouseName} onChange={(e) => updateFormData("warehouseName", e.target.value)} className="h-12" maxLength={100} />
                      <p className="text-xs text-muted-foreground">{formData.warehouseName.length}/100 characters</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ownerName">Owner Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sage" />
                        <Input id="ownerName" placeholder="Enter full legal name" value={formData.ownerName} onChange={(e) => updateFormData("ownerName", e.target.value)} className="pl-10 h-12" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Storage Capacity (in tons) *</Label>
                      <div className="relative">
                        <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sage" />
                        <Input id="capacity" type="number" placeholder="e.g., 500" value={formData.capacity} onChange={(e) => updateFormData("capacity", e.target.value)} className="pl-10 h-12" min="1" />
                      </div>
                      <p className="text-xs text-muted-foreground">Total storage capacity available</p>
                    </div>

                    {/* ADD THIS PRICE INPUT BLOCK */}
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (in HBAR per ton/month) *</Label>
                        <Input
                          id="price"
                          type="number"
                          placeholder="e.g., 0.002"
                          value={formData.price}
                          onChange={(e) => updateFormData("price", e.target.value)}
                          className="pl-8 h-12"
                          min="0"
                        />
                    
                      <p className="text-xs text-muted-foreground">Set the rental price for your storage space.</p>
                    </div>

                     <div className="space-y-2">
            <Label htmlFor="walletAddress">Receiving Wallet Address *</Label>
            <div className="relative">
                <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sage" />
                <Input
                    id="walletAddress"
                    placeholder="Your Hedera wallet address (e.g., 0.0.123456)"
                    value={formData.walletAddress}
                    onChange={(e) => updateFormData("walletAddress", e.target.value)}
                    className="pl-10 h-12"
                />
            </div>
            <p className="text-xs text-muted-foreground">This is where you'll receive payments.</p>
        </div>
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location / Address *</Label>
                      <Textarea id="location" placeholder="Enter full warehouse address..." value={formData.location} onChange={(e) => updateFormData("location", e.target.value)} className="min-h-24" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea id="description" placeholder="Describe facilities, features, and amenities..." value={formData.description} onChange={(e) => updateFormData("description", e.target.value)} className="min-h-32" maxLength={500} />
                      <p className="text-xs text-muted-foreground">{formData.description.length}/500 characters</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Warehouse Images *</Label>
                      <p className="text-xs text-muted-foreground mb-3">Upload 1 to 5 images of your warehouse (JPG/PNG)</p>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-secondary transition-colors">
                        <input type="file" id="warehouse-images" multiple accept="image/jpeg,image/png,image/jpg" onChange={handleImageUpload} className="hidden" />
                        <label htmlFor="warehouse-images" className="cursor-pointer">
                          <Upload className="h-12 w-12 mx-auto mb-3 text-sage" />
                          <p className="text-sm font-medium mb-1">Click to upload images</p>
                          <p className="text-xs text-muted-foreground">{warehouseImages.length}/5 images uploaded</p>
                        </label>
                      </div>
                      {warehouseImages.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          {warehouseImages.map((file, index) => (
                            <div key={index} className="relative group">
                              <img src={URL.createObjectURL(file)} alt={`Warehouse ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                              <button onClick={() => removeImage(index)} className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
                {currentStep === 3 && (
                   <div className="space-y-2">
                     <Label>Government Issued ID *</Label>
                     <p className="text-xs text-muted-foreground mb-3">Required for verification (e.g., GST Number, Trade License)</p>
                     <div className="grid md:grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <Label htmlFor="idType">ID Type</Label>
                         <Select value={formData.idType} onValueChange={(value) => updateFormData("idType", value)}>
                           <SelectTrigger className="h-12"><SelectValue placeholder="Select ID type" /></SelectTrigger>
                           <SelectContent>
                             <SelectItem value="gst">GST Number</SelectItem>
                             <SelectItem value="trade">Trade License</SelectItem>
                             <SelectItem value="fssai">FSSAI License</SelectItem>
                             <SelectItem value="warehouse">Warehouse License</SelectItem>
                             <SelectItem value="pan">PAN Card</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>
                       <div className="space-y-2">
                         <Label htmlFor="idNumber">ID Number</Label>
                         <div className="relative">
                           <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sage" />
                           <Input id="idNumber" placeholder="Enter ID number" value={formData.idNumber} onChange={(e) => updateFormData("idNumber", e.target.value)} className="pl-10 h-12" />
                         </div>
                       </div>
                     </div>
                   </div>
                )}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="p-6 bg-off-white rounded-xl space-y-4">
                      <h3 className="font-bold text-lg mb-4">Review Your Information</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div><p className="text-xs text-muted-foreground">Warehouse Name</p><p className="font-medium">{formData.warehouseName || "—"}</p></div>
                        <div><p className="text-xs text-muted-foreground">Owner Name</p><p className="font-medium">{formData.ownerName || "—"}</p></div>
                        <div><p className="text-xs text-muted-foreground">Capacity</p><p className="font-medium">{formData.capacity ? `${formData.capacity} tons` : "—"}</p></div>
                         <div>
                                    <p className="text-xs text-muted-foreground">Price</p>
                                    <p className="font-medium">{formData.price ? `${Number(formData.price).toLocaleString()} HBAR/ton/month` : "—"}</p>
                                </div>
                        <div><p className="text-xs text-muted-foreground">ID Type</p><p className="font-medium">{formData.idType || "—"}</p></div>
                      </div>
                      {formData.location && (<div><p className="text-xs text-muted-foreground">Location</p><p className="font-medium">{formData.location}</p></div>)}
                    </div>
                    <div className="flex items-start space-x-3 p-4 border border-border rounded-lg">
                      <Checkbox id="terms" checked={formData.agreeToTerms} onCheckedChange={(checked) => updateFormData("agreeToTerms", checked as boolean)} />
                      <div>
                        <label htmlFor="terms" className="text-sm font-medium leading-none cursor-pointer">I agree to the Terms of Service and Privacy Policy *</label>
                        <p className="text-xs text-muted-foreground mt-1">By registering, you accept our <a href="#" className="text-secondary underline">Terms</a> and <a href="#" className="text-secondary underline">Privacy Policy</a></p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col-reverse md:flex-row gap-3 md:justify-between">
                <Button variant="outline" size="lg" onClick={handleBack} disabled={currentStep === 1} className="w-full md:w-auto">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button
                  variant="hero"
                  size="lg"
                  onClick={handleNext}
                  disabled={(currentStep === 4 && !formData.agreeToTerms) || mutation.isPending}
                  className="w-full md:w-auto"
                >
                  {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {currentStep === 4 ? (mutation.isPending ? "Submitting..." : "Submit Registration") : "Continue"}
                  {currentStep < 4 && !mutation.isPending && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">Need help? <a href="#" className="text-secondary underline">Contact Support</a></p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
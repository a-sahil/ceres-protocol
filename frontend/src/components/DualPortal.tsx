import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Warehouse, Leaf, Check } from "lucide-react";

const DualPortal = () => {
  return (
    <section id="portals" className="py-16 md:py-24 bg-off-white">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Warehouse Registration Card */}
          <div
            className="relative overflow-hidden rounded-2xl p-8 lg:p-12 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in"
            style={{ background: "var(--gradient-card-warehouse)" }}
          >
            {/* Icon */}
            <div className="mb-6">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Warehouse className="h-10 w-10 text-primary" />
              </div>
            </div>

            {/* Content */}
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Register Your Warehouse
            </h2>
            <p className="text-muted-foreground mb-6 text-base">
              Join our verified network and connect with farmers seeking secure storage solutions.
            </p>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                <span className="text-sm">20% Premium Visibility Option</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Blockchain Data Receipt</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Verified Farmer Network</span>
              </li>
            </ul>

            {/* CTA */}
            <Button asChild variant="hero" size="xl" className="w-full">
              <Link to="/register">Start Registration</Link>
            </Button>
          </div>

          {/* Farmer Portal Card */}
          <div
            className="relative overflow-hidden rounded-2xl p-8 lg:p-12 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in"
            style={{ 
              background: "var(--gradient-card-farmer)",
              animationDelay: "0.1s" 
            }}
          >
            {/* Icon */}
            <div className="mb-6">
              <div className="w-20 h-20 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <Leaf className="h-10 w-10 text-secondary" />
              </div>
            </div>

            {/* Content */}
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Farmer Dashboard
            </h2>
            <p className="text-muted-foreground mb-6 text-base">
              Access verified warehouses and secure your harvest with transparent insurance.
            </p>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Search & Filter Warehouses</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Secure Storage Tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Easy Insurance Claims</span>
              </li>
            </ul>

            {/* CTA */}
            <Button asChild variant="secondary" size="xl" className="w-full">
              <Link to="/login">Login / Browse Warehouses</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DualPortal;

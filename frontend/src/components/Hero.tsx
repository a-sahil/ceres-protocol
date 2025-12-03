import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Vote, Camera } from "lucide-react";
import heroImage from "@/assets/hero-warehouse.jpg";

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 lg:py-32">
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />

      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6 lg:space-y-8 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              Decentralized Warehouse Insurance for Modern Agriculture
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
              Connect farmers with verified warehouses. Transparent insurance claims powered by DAO voting and AR technology.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild variant="hero" size="xl" className="w-full sm:w-auto">
                <Link to="/register">Register Your Warehouse</Link>
              </Button>
              <Button asChild variant="hero-outline" size="xl" className="w-full sm:w-auto">
                <Link to="/listings">Browse Warehouses</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-5 w-5 text-secondary flex-shrink-0" />
                <span className="text-muted-foreground">Blockchain Verified</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Vote className="h-5 w-5 text-secondary flex-shrink-0" />
                <span className="text-muted-foreground">DAO Governed</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Camera className="h-5 w-5 text-secondary flex-shrink-0" />
                <span className="text-muted-foreground">3D AR Claims</span>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative animate-slide-up lg:animate-scale-in">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={heroImage}
                alt="Modern agricultural warehouse with blockchain technology"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

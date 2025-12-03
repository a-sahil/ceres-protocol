import { Search, FileCheck, Shield } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: Search,
    title: "Browse & Select",
    description: "Search verified warehouses by location, capacity, and facilities. Compare prices and read reviews from other farmers.",
  },
  {
    number: 2,
    icon: FileCheck,
    title: "Store Your Crops",
    description: "Book storage space with transparent contracts. All data is recorded on blockchain for security and transparency.",
  },
  {
    number: 3,
    icon: Shield,
    title: "Insured Protection",
    description: "Submit claims with 3D AR evidence. DAO community votes on claim validity ensuring fair, transparent insurance payouts.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-off-white">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-12 lg:mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to secure, transparent agricultural storage
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-mint via-secondary to-mint -z-10" 
               style={{ width: "calc(100% - 8rem)", marginLeft: "4rem" }} 
          />

          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative animate-slide-up bg-card rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Step Number Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mint to-secondary flex items-center justify-center text-primary font-bold text-lg shadow-md">
                  {step.number}
                </div>
              </div>

              {/* Icon */}
              <div className="mt-6 mb-4 flex justify-center">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-secondary/10 to-mint/10 flex items-center justify-center">
                  <step.icon className="h-8 w-8 text-secondary" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-center mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-center text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

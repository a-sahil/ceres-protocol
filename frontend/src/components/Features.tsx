import { Lock, Users, TrendingUp, FileText, Coins, Smartphone } from "lucide-react";

const features = [
  {
    icon: Lock,
    title: "Blockchain Security",
    description: "All transactions and storage records are immutably stored on blockchain for complete transparency and security.",
  },
  {
    icon: Users,
    title: "DAO Governance",
    description: "Community-driven decision making ensures fair insurance claim validation through democratic voting.",
  },
  {
    icon: TrendingUp,
    title: "Premium Visibility",
    description: "Warehouses can opt for 20% premium visibility to reach more farmers and increase bookings.",
  },
  {
    icon: FileText,
    title: "Smart Contracts",
    description: "Automated agreements ensure terms are executed exactly as agreed with no intermediaries.",
  },
  {
    icon: Coins,
    title: "Transparent Pricing",
    description: "Compare prices across warehouses with no hidden fees. See exact costs before booking.",
  },
  {
    icon: Smartphone,
    title: "AR Claim Submission",
    description: "Use your smartphone to capture 3D evidence for insurance claims with augmented reality technology.",
  },
];

const Features = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-12 lg:mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Platform Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Modern technology meets agricultural insurance
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="card-lift bg-card rounded-xl p-6 lg:p-8 border border-border shadow-sm animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-mint flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

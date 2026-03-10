import { Sun, Droplets, Zap, Leaf } from 'lucide-react';

const features = [
  {
    icon: Sun,
    title: 'Solar Enabled Homes',
    description: 'Properties equipped with solar panel systems',
  },
  {
    icon: Droplets,
    title: 'Rainwater Harvesting',
    description: 'Built-in rainwater collection systems',
  },
  {
    icon: Zap,
    title: 'Energy Efficient Buildings',
    description: 'High energy efficiency rated properties',
  },
  {
    icon: Leaf,
    title: 'Eco Rated Properties',
    description: 'Admin-verified eco sustainability scores',
  },
];

const SustainabilitySection = () => {
  return (
    <section className="py-16 bg-eco-card-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Sustainable Housing Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover eco-friendly properties that contribute to a greener future
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="text-center p-6 rounded-xl bg-card border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-elegant hover:-translate-y-1"
            >
              <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SustainabilitySection;

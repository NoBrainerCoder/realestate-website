import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, Award, Target, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About MyInfraHub
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Your Trusted Partner in Real Estate Excellence
            </p>
            <p className="text-lg opacity-80 leading-relaxed">
              We are committed to revolutionizing the real estate experience in Hyderabad, 
              connecting property seekers with their perfect homes through innovative technology 
              and personalized service.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="card-elegant p-8">
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To simplify the property buying and selling process by providing a transparent, 
                  user-friendly platform that connects buyers and sellers while ensuring complete 
                  satisfaction and trust in every transaction.
                </p>
              </div>
            </Card>

            <Card className="card-elegant p-8">
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To become Hyderabad's most trusted real estate platform, known for innovation, 
                  integrity, and exceptional customer service, helping thousands find their dream 
                  properties across the city.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose MyInfraHub?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We offer comprehensive real estate solutions with a focus on customer satisfaction and market expertise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="card-elegant p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Verified Properties</h3>
                  <p className="text-muted-foreground text-sm">
                    100% verified listings with authentic documentation and legal clarity
                  </p>
                </div>
              </div>
            </Card>

            <Card className="card-elegant p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Expert Guidance</h3>
                  <p className="text-muted-foreground text-sm">
                    Professional real estate experts to guide you through every step
                  </p>
                </div>
              </div>
            </Card>

            <Card className="card-elegant p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Market Leadership</h3>
                  <p className="text-muted-foreground text-sm">
                    Years of experience and thousands of successful transactions
                  </p>
                </div>
              </div>
            </Card>

            <Card className="card-elegant p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
                  <p className="text-muted-foreground text-sm">
                    Round-the-clock customer support for all your queries
                  </p>
                </div>
              </div>
            </Card>

            <Card className="card-elegant p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Transparent Process</h3>
                  <p className="text-muted-foreground text-sm">
                    No hidden charges, complete transparency in all dealings
                  </p>
                </div>
              </div>
            </Card>

            <Card className="card-elegant p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Wide Network</h3>
                  <p className="text-muted-foreground text-sm">
                    Extensive network across all prime locations in Hyderabad
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of satisfied customers who found their perfect homes with us
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/properties">
                <Button size="lg" variant="secondary" className="min-w-[200px]">
                  Browse Properties
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="min-w-[200px] text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary bg-primary-foreground/10 backdrop-blur-sm">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
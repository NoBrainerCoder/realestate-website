import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Eye, Lock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="sm" className="hover-scale">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground">
              Last updated: January 2024
            </p>
          </div>
        </div>

        {/* Introduction */}
        <Card className="card-elegant mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Our Commitment to Privacy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              At MyInfraHub, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our 
              website or use our services.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {/* Information We Collect */}
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
                <p className="text-muted-foreground mb-2">We may collect the following personal information:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Full name and contact information (email, phone number)</li>
                  <li>Property preferences and search criteria</li>
                  <li>Financial information for EMI calculations</li>
                  <li>Communication records and inquiries</li>
                  <li>Account credentials and profile information</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Automatically Collected Information</h3>
                <p className="text-muted-foreground mb-2">We automatically collect certain information:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>IP address and browser information</li>
                  <li>Device and operating system details</li>
                  <li>Website usage patterns and preferences</li>
                  <li>Cookies and tracking technologies</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">We use the collected information for the following purposes:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>To provide and maintain our real estate services</li>
                <li>To process property listings and inquiries</li>
                <li>To communicate with you about properties and services</li>
                <li>To improve our website and user experience</li>
                <li>To send newsletters and marketing communications (with consent)</li>
                <li>To comply with legal obligations and resolve disputes</li>
                <li>To prevent fraud and ensure platform security</li>
              </ul>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Information Sharing and Disclosure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Property Owners and Agents</h3>
                <p className="text-muted-foreground">
                  When you express interest in a property, we may share your contact information with the property owner 
                  or authorized agent to facilitate communication.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Service Providers</h3>
                <p className="text-muted-foreground">
                  We may share information with trusted third-party service providers who assist us in operating our 
                  website, conducting business, or serving our users.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Legal Requirements</h3>
                <p className="text-muted-foreground">
                  We may disclose your information if required to do so by law or in response to valid requests by 
                  public authorities.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We implement appropriate security measures to protect your personal information against unauthorized access, 
                alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Employee training on data protection practices</li>
              </ul>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle>Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">You have the following rights regarding your personal information:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Access:</strong> Request copies of your personal information</li>
                <li><strong>Rectification:</strong> Request correction of inaccurate or incomplete data</li>
                <li><strong>Erasure:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Objection:</strong> Object to processing of your personal information</li>
                <li><strong>Withdrawal:</strong> Withdraw consent for data processing</li>
              </ul>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle>Cookies and Tracking Technologies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We use cookies and similar tracking technologies to enhance your browsing experience. You can control 
                cookie settings through your browser preferences.
              </p>
              <div className="space-y-2">
                <div><strong className="text-foreground">Essential Cookies:</strong> Required for website functionality</div>
                <div><strong className="text-foreground">Analytics Cookies:</strong> Help us understand website usage</div>
                <div><strong className="text-foreground">Marketing Cookies:</strong> Used for targeted advertising (with consent)</div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2">
                <div><strong>Email:</strong> myinfrahub.com@gmail.com</div>
                <div><strong>Phone:</strong> 9866123350</div>
                <div><strong>Address:</strong> Hyderabad, Telangana, India</div>
              </div>
            </CardContent>
          </Card>

          {/* Updates */}
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle>Policy Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the 
                new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this 
                Privacy Policy periodically for any changes.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-center mt-8">
          <Link to="/">
            <Button className="btn-hero">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
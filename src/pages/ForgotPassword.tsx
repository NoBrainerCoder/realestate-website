import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const emailSchema = z.object({
  email: z.string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" })
});

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate email
    const validation = emailSchema.safeParse({ email });
    if (!validation.success) {
      toast({
        title: "Validation Error",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setEmailSent(true);
      toast({
        title: "Reset Email Sent",
        description: "Check your email for a password reset link.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center py-8">
      <div className="container mx-auto px-4 max-w-md">
        <Card className="card-elegant">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Forgot Password?</CardTitle>
            <CardDescription>
              {emailSent 
                ? "Check your email for the reset link"
                : "Enter your email to receive a password reset link"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!emailSent ? (
              <>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full btn-hero" 
                    loading={loading} 
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </form>

                <div className="text-center">
                  <Link to="/sign-in" className="inline-flex items-center text-sm text-primary hover:underline">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Sign In
                  </Link>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-green-800">
                    <strong>✓ Email Sent:</strong> Please check your inbox and click the reset link. 
                    If you don't see it, check your spam folder.
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the email?
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setEmailSent(false)}
                    className="w-full"
                  >
                    Try Again
                  </Button>
                  <Link to="/sign-in" className="inline-flex items-center text-sm text-primary hover:underline">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Sign In
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
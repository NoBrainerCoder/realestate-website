import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  // Fetch properties count
  const { data: propertiesStats } = useQuery({
    queryKey: ['admin-properties-stats'],
    queryFn: async () => {
      const [pending, approved, total] = await Promise.all([
        supabase.from('properties').select('id', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('properties').select('id', { count: 'exact' }).eq('status', 'approved'),
        supabase.from('properties').select('id', { count: 'exact' })
      ]);
      
      return {
        pending: pending.count || 0,
        approved: approved.count || 0,
        total: total.count || 0
      };
    }
  });

  // Fetch contact submissions count
  const { data: contactStats } = useQuery({
    queryKey: ['admin-contact-stats'],
    queryFn: async () => {
      const [newContacts, total] = await Promise.all([
        supabase.from('contact_submissions').select('id', { count: 'exact' }).eq('status', 'new'),
        supabase.from('contact_submissions').select('id', { count: 'exact' })
      ]);
      
      return {
        new: newContacts.count || 0,
        total: total.count || 0
      };
    }
  });

  return (
    <div className="min-h-screen bg-muted/30 page-transition">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-lg text-muted-foreground">Manage properties, contacts, and more</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-elegant hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{propertiesStats?.total || 0}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                <Badge variant={propertiesStats?.pending ? 'destructive' : 'secondary'} className="text-xs">
                  {propertiesStats?.pending || 0} Pending
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elegant hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Properties</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{propertiesStats?.approved || 0}</div>
              <p className="text-xs text-muted-foreground">Live on website</p>
            </CardContent>
          </Card>

          <Card className="card-elegant hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contact Requests</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contactStats?.total || 0}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                <Badge variant={contactStats?.new ? 'default' : 'secondary'} className="text-xs">
                  {contactStats?.new || 0} New
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elegant hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{propertiesStats?.pending || 0}</div>
              <p className="text-xs text-muted-foreground">Properties awaiting approval</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Property Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Review, approve, or reject property submissions. Manage property images and details.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/admin/properties" className="flex-1">
                  <Button className="w-full" variant="default">
                    <Eye className="h-4 w-4 mr-2" />
                    View All Properties
                  </Button>
                </Link>
                <Link to="/admin/properties?status=pending" className="flex-1">
                  <Button className="w-full" variant="outline">
                    <Clock className="h-4 w-4 mr-2" />
                    Review Pending ({propertiesStats?.pending || 0})
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Contact Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                View and respond to customer inquiries and contact form submissions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/admin/contacts" className="flex-1">
                  <Button className="w-full" variant="default">
                    <Eye className="h-4 w-4 mr-2" />
                    View All Contacts
                  </Button>
                </Link>
                <Link to="/admin/contacts?status=new" className="flex-1">
                  <Button className="w-full" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    New Messages ({contactStats?.new || 0})
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Mail, Phone, Calendar, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";
import PageTransition from "@/components/PageTransition";

const AdminAppointments = () => {
  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ["admin-appointments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointment_requests")
        .select(`
          *,
          properties (
            title,
            location
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, appointment }: { id: string; status: string; appointment: any }) => {
      const { error } = await supabase
        .from("appointment_requests")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      // Send status update email to visitor
      if (status === 'confirmed' || status === 'cancelled') {
        try {
          await supabase.functions.invoke('send-email', {
            body: {
              type: 'appointment_status_update',
              to: appointment.visitor_email,
              data: {
                visitor_name: appointment.visitor_name,
                property_title: appointment.properties?.title || 'Property',
                preferred_date: appointment.preferred_date,
                preferred_time: appointment.preferred_time,
                status: status
              }
            }
          });
        } catch (emailError) {
          console.error('Failed to send status update email:', emailError);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
      toast.success("Status updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update status");
      console.error("Update error:", error);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Appointment Requests</h1>
            <p className="text-muted-foreground">
              Manage property viewing appointments
            </p>
          </div>

          <Card className="p-6">
            {appointments && appointments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Visitor</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {(appointment.properties as any)?.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {(appointment.properties as any)?.location}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {appointment.visitor_name}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3" />
                            <a
                              href={`mailto:${appointment.visitor_email}`}
                              className="hover:underline"
                            >
                              {appointment.visitor_email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3" />
                            <a
                              href={`tel:${appointment.visitor_phone}`}
                              className="hover:underline"
                            >
                              {appointment.visitor_phone}
                            </a>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm">
                              {new Date(
                                appointment.preferred_date
                              ).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {appointment.preferred_time}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {appointment.message || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            appointment.status === "pending"
                              ? "default"
                              : appointment.status === "confirmed"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {appointment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {appointment.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() =>
                                  updateStatusMutation.mutate({
                                    id: appointment.id,
                                    status: "confirmed",
                                    appointment: appointment,
                                  })
                                }
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  updateStatusMutation.mutate({
                                    id: appointment.id,
                                    status: "cancelled",
                                    appointment: appointment,
                                  })
                                }
                              >
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No appointment requests yet
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminAppointments;

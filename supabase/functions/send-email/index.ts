import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  type?: 'appointment_confirmation' | 'appointment_notification' | 'contact_notification' | 'property_rejection' | 'property_approval' | 'new_property_admin' | 'appointment_status_update';
  to: string;
  subject?: string;
  html?: string;
  data?: any;
}

const getEmailTemplate = (type: string, data: any): { subject: string; html: string } => {
  switch (type) {
    case 'appointment_confirmation':
      return {
        subject: "Appointment Request Confirmation",
        html: `
          <h2>Thank you for your appointment request!</h2>
          <p>Dear ${data.visitor_name},</p>
          <p>We have received your request to visit the property: <strong>${data.property_title}</strong></p>
          <p><strong>Preferred Date:</strong> ${data.preferred_date}</p>
          <p><strong>Preferred Time:</strong> ${data.preferred_time}</p>
          <p>The property owner will contact you shortly at ${data.visitor_phone} or ${data.visitor_email}.</p>
          ${data.message ? `<p><strong>Your message:</strong> ${data.message}</p>` : ''}
          <p>Thank you for using MyInfraHub!</p>
        `
      };
    
    case 'appointment_notification':
      return {
        subject: `New Appointment Request for ${data.property_title}`,
        html: `
          <h2>New Appointment Request</h2>
          <p>You have received a new appointment request for your property: <strong>${data.property_title}</strong></p>
          <hr>
          <p><strong>Visitor Name:</strong> ${data.visitor_name}</p>
          <p><strong>Phone:</strong> ${data.visitor_phone}</p>
          <p><strong>Email:</strong> ${data.visitor_email}</p>
          <p><strong>Preferred Date:</strong> ${data.preferred_date}</p>
          <p><strong>Preferred Time:</strong> ${data.preferred_time}</p>
          ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ''}
          <hr>
          <p>Please contact the visitor to confirm the appointment.</p>
        `
      };
    
    case 'contact_notification':
      return {
        subject: `New Contact Form Submission from ${data.name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <hr>
          <p><strong>Message:</strong></p>
          <p>${data.message}</p>
        `
      };
    
    case 'property_rejection':
      return {
        subject: "Property Submission Rejected - MyInfraHub",
        html: `
          <h2>Property Submission Update</h2>
          <p>Dear ${data.poster_name},</p>
          <p>We regret to inform you that your property submission "<strong>${data.property_title}</strong>" has been rejected.</p>
          <p><strong>Reason:</strong> ${data.rejection_reason}</p>
          <p>You can update your property details and resubmit it for review.</p>
          <p>If you have any questions, please contact us.</p>
          <p>Thank you for using MyInfraHub!</p>
        `
      };
    
    case 'property_approval':
      return {
        subject: "Property Approved - MyInfraHub",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">MyInfraHub</h1>
            </div>
            <div style="padding: 30px; background: #f9fafb;">
              <h2 style="color: #1e40af;">Property Approved!</h2>
              <p>Dear ${data.poster_name},</p>
              <p>Congratulations! Your property "<strong>${data.property_title}</strong>" has been approved and is now live on MyInfraHub.</p>
              <p>Your property is now visible to potential buyers/renters.</p>
              <p>Thank you for using MyInfraHub!</p>
            </div>
            <div style="background: #1e40af; color: white; padding: 20px; text-align: center;">
              <p style="margin: 0;">MyInfraHub Notifications</p>
            </div>
          </div>
        `
      };
    
    case 'new_property_admin':
      return {
        subject: "New Property Submission - MyInfraHub",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">MyInfraHub</h1>
            </div>
            <div style="padding: 30px; background: #f9fafb;">
              <h2 style="color: #1e40af;">New Property Awaiting Approval</h2>
              <p><strong>Property Title:</strong> ${data.property_title}</p>
              <p><strong>Location:</strong> ${data.location}</p>
              <p><strong>Price:</strong> ₹${data.price}</p>
              <p><strong>Submitted by:</strong> ${data.poster_name}</p>
              <p><strong>Contact:</strong> ${data.poster_email} | ${data.poster_phone}</p>
              <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
              <p>Please review and approve/reject this property in the admin panel.</p>
            </div>
            <div style="background: #1e40af; color: white; padding: 20px; text-align: center;">
              <p style="margin: 0;">MyInfraHub Notifications</p>
            </div>
          </div>
        `
      };
    
    case 'appointment_status_update':
      return {
        subject: `Appointment ${data.status === 'confirmed' ? 'Confirmed' : 'Cancelled'} - MyInfraHub`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">MyInfraHub</h1>
            </div>
            <div style="padding: 30px; background: #f9fafb;">
              <h2 style="color: #1e40af;">Appointment ${data.status === 'confirmed' ? 'Confirmed' : 'Cancelled'}</h2>
              <p>Dear ${data.visitor_name},</p>
              <p>Your appointment request for "<strong>${data.property_title}</strong>" has been ${data.status}.</p>
              <p><strong>Preferred Date:</strong> ${data.preferred_date}</p>
              <p><strong>Preferred Time:</strong> ${data.preferred_time}</p>
              ${data.status === 'confirmed' ? `
                <p style="color: #059669;">✅ Your appointment has been confirmed. The property owner will contact you shortly.</p>
              ` : `
                <p style="color: #dc2626;">❌ Unfortunately, your appointment request was cancelled. Please contact us for more information.</p>
              `}
              <p>Thank you for using MyInfraHub!</p>
            </div>
            <div style="background: #1e40af; color: white; padding: 20px; text-align: center;">
              <p style="margin: 0;">MyInfraHub Notifications</p>
            </div>
          </div>
        `
      };
    
    default:
      throw new Error(`Unknown email type: ${type}`);
  }
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { type, to, subject: providedSubject, html: providedHtml, data }: EmailRequest = await req.json();

    let subject = providedSubject;
    let html = providedHtml;

    // If type is provided, generate email from template
    if (type && data) {
      const template = getEmailTemplate(type, data);
      subject = template.subject;
      html = template.html;
    }

    if (!subject || !html) {
      throw new Error('Email subject and html content are required');
    }

    console.log('Sending email to:', to);
    console.log('Subject:', subject);

    // Get SMTP credentials from environment
    const smtpHost = Deno.env.get('SMTP_HOST');
    const smtpPort = parseInt(Deno.env.get('SMTP_PORT') || '587');
    const smtpUser = Deno.env.get('SMTP_USER');
    const smtpPassword = Deno.env.get('SMTP_PASSWORD');
    const smtpFrom = Deno.env.get('SMTP_FROM_EMAIL');

    if (!smtpHost || !smtpUser || !smtpPassword || !smtpFrom) {
      throw new Error('SMTP configuration is incomplete. Please check your environment variables.');
    }

    // Create SMTP client
    const client = new SMTPClient({
      connection: {
        hostname: smtpHost,
        port: smtpPort,
        tls: smtpPort === 465,
        auth: {
          username: smtpUser,
          password: smtpPassword,
        },
      },
    });

    // Send email
    await client.send({
      from: `MyInfraHub Notifications <${smtpFrom}>`,
      to: to,
      subject: subject,
      html: html,
    });

    await client.close();

    console.log('Email sent successfully to:', to);

    // Log email to database
    await supabase.from('email_logs').insert({
      to_email: to,
      subject: subject,
      message: html,
      status: 'sent'
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error('Error sending email:', error);

    // Log failed email to database
    try {
      await supabase.from('email_logs').insert({
        to_email: 'unknown',
        subject: 'Failed to send',
        message: error.message,
        status: 'failed',
        error_message: error.toString()
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to send email',
        details: error.toString()
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});

import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  type?: 'appointment_confirmation' | 'appointment_notification' | 'contact_notification' | 'property_rejection' | 'property_approval';
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
          <h2>Property Submission Approved!</h2>
          <p>Dear ${data.poster_name},</p>
          <p>Congratulations! Your property "<strong>${data.property_title}</strong>" has been approved and is now live on MyInfraHub.</p>
          <p>Your property is now visible to potential buyers/renters.</p>
          <p>Thank you for using MyInfraHub!</p>
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

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: "MyInfraHub <onboarding@resend.dev>",
      to: [to],
      subject: subject,
      html: html,
    });

    console.log('Email sent successfully:', emailResponse);

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

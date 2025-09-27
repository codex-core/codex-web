import { NextRequest, NextResponse } from 'next/server';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// Initialize SES client
const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // Validate required fields
    const { firstName, lastName, email, subject, message } = body;

    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Prepare email content
    const emailHtml = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #374151;">Contact Information</h3>
              <p><strong>Name:</strong> ${firstName} ${lastName}</p>
              <p><strong>Email:</strong> ${email}</p>
              ${body.company ? `<p><strong>Company:</strong> ${body.company}</p>` : ''}
              ${body.phone ? `<p><strong>Phone:</strong> ${body.phone}</p>` : ''}
            </div>
            
            <div style="margin: 20px 0;">
              <h3 style="color: #374151;">Subject</h3>
              <p style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 10px 0;">
                ${subject}
              </p>
            </div>
            
            <div style="margin: 20px 0;">
              <h3 style="color: #374151;">Message</h3>
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 10px 0;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <div style="background-color: #eff6ff; padding: 15px; border-radius: 6px; border-left: 4px solid #2563eb;">
              <p style="margin: 0; font-size: 14px; color: #1e40af;">
                <strong>Submitted:</strong> ${new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })}
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailText = `
New Contact Form Submission

Contact Information:
Name: ${firstName} ${lastName}
Email: ${email}
${body.company ? `Company: ${body.company}` : ''}
${body.phone ? `Phone: ${body.phone}` : ''}

Subject: ${subject}

Message:
${message}

Submitted: ${new Date().toLocaleString()}
    `;

    // Send email using AWS SES
    const sendEmailCommand = new SendEmailCommand({
      Source: process.env.SES_FROM_EMAIL,
      Destination: {
        ToAddresses: ['info@codexstudios.io'],
      },
      Message: {
        Subject: {
          Data: `Contact Form: ${subject}`,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: emailHtml,
            Charset: 'UTF-8',
          },
          Text: {
            Data: emailText,
            Charset: 'UTF-8',
          },
        },
      },
      ReplyToAddresses: [email], // Allow replying directly to the sender
    });

    await sesClient.send(sendEmailCommand);

    // Send confirmation email to the sender
    const confirmationEmailHtml = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
              Thank You for Contacting Codex Studios
            </h2>
            
            <p>Hi ${firstName},</p>
            
            <p>Thank you for reaching out to us! We've received your message and one of our team members will get back to you within 24 hours.</p>
            
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #374151;">Your Message Summary</h3>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong></p>
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <p>In the meantime, feel free to explore our services and learn more about how we can help transform your business with cloud solutions.</p>
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="https://codexstudios.io" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Visit Our Website
              </a>
            </div>
            
            <p>Best regards,<br>
            The Codex Studios Team</p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <div style="font-size: 14px; color: #6b7280;">
              <p>Codex Studios<br>
              20 S Charles St Ste 403 #857<br>
              Baltimore, Maryland 21201<br>
              Phone: (301) 674-2624<br>
              Email: info@codexstudios.io</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const confirmationEmailCommand = new SendEmailCommand({
      Source: process.env.SES_FROM_EMAIL,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: 'Thank you for contacting Codex Studios',
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: confirmationEmailHtml,
            Charset: 'UTF-8',
          },
        },
      },
    });

    await sesClient.send(confirmationEmailCommand);

    return NextResponse.json({
      message: 'Contact form submitted successfully',
      success: true,
    });

  } catch (error) {
    console.error('Error sending contact form email:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
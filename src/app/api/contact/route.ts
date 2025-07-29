// For App Router (e.g. /app/api/contact/route.ts)
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      ownerEmail,
      ownerName,
      userName,
      userEmail,
      message,
    } = body;

    // Enhanced validation with logging
    console.log('Received form data:', { ownerEmail, ownerName, userName, userEmail, message: message.substring(0, 50) + '...' });

    if (!ownerEmail || !ownerName || !userEmail || !userName || !message) {
      console.error('Missing required fields:', { ownerEmail: !!ownerEmail, ownerName: !!ownerName, userEmail: !!userEmail, userName: !!userName, message: !!message });
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(ownerEmail) || !emailRegex.test(userEmail)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid email format' 
      }, { status: 400 });
    }

    // Check if Gmail credentials exist
    if (!process.env.GMAIL_EMAIL || !process.env.GMAIL_APP_PASSWORD) {
      console.error('Gmail credentials are not set in environment variables');
      return NextResponse.json({ 
        success: false, 
        error: 'Email service configuration error' 
      }, { status: 500 });
    }

    // Create transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not regular password
      },
    });

    console.log('Attempting to send emails...');

    // 1. Email to Owner with error handling
    let ownerEmailResponse;
    try {
      const ownerMailOptions = {
        from: {
          name: 'Contact Form',
          address: process.env.GMAIL_EMAIL
        },
        to: ownerEmail,
        subject: `New message from ${userName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Contact Message</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px;">
              <div style="text-align: center; padding: 20px 0;">
                <h1 style="color: #333; margin: 0;">New Contact Form Message</h1>
              </div>
              
              <div style="padding: 20px; background-color: #f8fafc; border-radius: 8px; margin: 20px 0;">
                <h2 style="color: #333; margin-top: 0;">Message Details</h2>
                <p style="color: #666; font-size: 16px; margin: 10px 0;">
                  <strong>From:</strong> ${userName}
                </p>
                <p style="color: #666; font-size: 16px; margin: 10px 0;">
                  <strong>Email:</strong> ${userEmail}
                </p>
                <p style="color: #666; font-size: 16px; margin: 10px 0;">
                  <strong>Message:</strong>
                </p>
                <div style="background: #ffffff; padding: 15px; border-radius: 5px; margin: 10px 0; border-left: 4px solid #3b82f6;">
                  ${message.replace(/\n/g, '<br>')}
                </div>
              </div>
              
              <div style="padding: 20px 0; border-top: 1px solid #eee; margin-top: 30px;">
                <p style="color: #999; font-size: 12px; margin: 0; text-align: center;">
                  This message was sent through your contact form.
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `New message from ${userName} (${userEmail}):\n\n${message}`
      };

      ownerEmailResponse = await transporter.sendMail(ownerMailOptions);
      console.log('Owner email sent:', ownerEmailResponse.messageId);
      
    } catch (ownerEmailError) {
      console.error('Owner email send error:', ownerEmailError);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to send notification email' 
      }, { status: 500 });
    }

    // 2. Acknowledgement Email to User with error handling
    let userEmailResponse;
    let warnings: string[] = [];
    
    try {
      const userMailOptions = {
        from: {
          name: ownerName,
          address: process.env.GMAIL_EMAIL
        },
        to: userEmail,
        subject: `Thanks for reaching out to ${ownerName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Thank You</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px;">
              <div style="text-align: center; padding: 20px 0;">
                <h1 style="color: #333; margin: 0;">Thank you for your message!</h1>
              </div>
              
              <div style="padding: 20px; background-color: #f8fafc; border-radius: 8px; margin: 20px 0;">
                <p style="color: #666; font-size: 16px; line-height: 1.5;">
                  Hi ${userName},
                </p>
                <p style="color: #666; font-size: 16px; line-height: 1.5;">
                  Thanks for contacting ${ownerName}. I have received your message and will get back to you shortly.
                </p>
                
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
                
                <p style="color: #666; font-size: 16px; margin: 10px 0;">
                  <strong>Your message:</strong>
                </p>
                <div style="background: #ffffff; padding: 15px; border-radius: 5px; margin: 10px 0; border-left: 4px solid #3b82f6;">
                  ${message.replace(/\n/g, '<br>')}
                </div>
                
                <p style="color: #666; font-size: 16px; line-height: 1.5; margin-top: 20px;">
                  Best regards,<br>${ownerName}
                </p>
              </div>
              
              <div style="padding: 20px 0; border-top: 1px solid #eee; margin-top: 30px;">
                <p style="color: #999; font-size: 12px; margin: 0; text-align: center;">
                  This is an automated confirmation email.
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `Hi ${userName},\n\nThanks for contacting ${ownerName}. I have received your message and will get back to you shortly.\n\nYour message:\n${message}\n\nBest regards,\n${ownerName}`
      };

      userEmailResponse = await transporter.sendMail(userMailOptions);
      console.log('User email sent:', userEmailResponse.messageId);
      
    } catch (userEmailError) {
      console.error('User email send error:', userEmailError);
      console.warn('Acknowledgment email failed, but main notification was sent');
      warnings.push('Acknowledgment email failed');
    }

    console.log('Email process completed');
    return NextResponse.json({ 
      success: true, 
      ownerEmailId: ownerEmailResponse.messageId,
      userEmailId: userEmailResponse?.messageId,
      warnings: warnings.length > 0 ? warnings : undefined
    });

  } catch (err) {
    console.error('General email error:', err);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to send email' 
    }, { status: 500 });
  }
}
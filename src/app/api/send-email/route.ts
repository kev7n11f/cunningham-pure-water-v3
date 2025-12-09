import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.TLS_ENABLED === 'true' && process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, company, message, source } = await request.json();

    const mailOptions = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: process.env.QUOTE_NOTIFICATION_EMAIL || 'admin@cpwsales.com',
      replyTo: email,
      subject: `New ${source} Lead: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4A9ED0;">New Lead from ${source}</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Company:</strong> ${company || 'Not provided'}</p>
          </div>
          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Message:</h3>
            <p style="white-space: pre-wrap; background: #fff; padding: 15px; border-left: 4px solid #4A9ED0;">${message}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #666; font-size: 14px;">Please follow up with this lead within 24 hours.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}

const nodemailer = require('nodemailer');

/**
 * Email Service Configuration
 * Supports multiple email providers:
 * - Gmail (smtp.gmail.com)
 * - SendGrid (smtp.sendgrid.net)
 * - Mailgun (smtp.mailgun.org)
 * - Custom SMTP servers
 * 
 * Configure via .env file
 */

// Create email transporter based on provider
const createTransporter = () => {
  const port = parseInt(process.env.EMAIL_PORT) || 587;
  const config = {
    host: process.env.EMAIL_HOST,
    port: port,
    secure: port === 465, // true for port 465 (SSL), false for port 587 (TLS)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  };

  // Add additional options for better compatibility
  if (process.env.EMAIL_HOST === 'smtp.gmail.com') {
    config.service = 'gmail';
  }

  // TLS/SSL options for better security
  if (port === 587) {
    // For TLS (port 587)
    config.tls = {
      rejectUnauthorized: process.env.NODE_ENV === 'production',
      ciphers: 'SSLv3'
    };
  }

  return nodemailer.createTransport(config);
};

// Verify email configuration on startup
const verifyEmailConfig = async () => {
  if (process.env.EMAIL_DEBUG === 'true') {
    console.log('📧 Email Debug Mode: Enabled (emails will be logged, not sent)');
    return true;
  }

  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email service connected successfully');
    console.log(`📧 Provider: ${process.env.EMAIL_HOST}`);
    console.log(`📤 From: ${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`);
    return true;
  } catch (error) {
    console.error('❌ Email service connection failed:', error.message);
    console.error('⚠️  Emails will not be sent. Please check your .env configuration.');
    return false;
  }
};

// Send email function with enhanced error handling
exports.sendEmail = async (options) => {
  try {
    // DEVELOPMENT/DEBUG MODE - Log emails instead of sending
    if (process.env.EMAIL_DEBUG === 'true') {
      console.log('\n📧 ========== EMAIL DEBUG MODE ==========');
      console.log('To:', options.to);
      console.log('Subject:', options.subject);
      console.log('From:', `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`);
      console.log('Content Type:', options.html ? 'HTML' : 'Plain Text');
      console.log('========================================\n');
      return { 
        messageId: 'debug-' + Date.now(),
        accepted: [options.to],
        response: 'Debug mode - email logged but not sent'
      };
    }

    // PRODUCTION MODE - Send real emails
    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo || process.env.EMAIL_FROM
    };

    // Add CC and BCC if provided
    if (options.cc) mailOptions.cc = options.cc;
    if (options.bcc) mailOptions.bcc = options.bcc;

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully');
    console.log('   To:', options.to);
    console.log('   Subject:', options.subject);
    console.log('   Message ID:', info.messageId);
    
    return info;
  } catch (error) {
    console.error('❌ Email sending failed');
    console.error('   To:', options.to);
    console.error('   Subject:', options.subject);
    console.error('   Error:', error.message);
    
    // Don't throw error - just log it (non-blocking)
    // This prevents email failures from breaking the application
    return {
      error: true,
      message: error.message
    };
  }
};

// Verify configuration on module load
verifyEmailConfig();

// Export verification function for testing
exports.verifyEmailConfig = verifyEmailConfig;

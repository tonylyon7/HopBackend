// Email template styles
const emailStyles = `
  <style>
    body {
      font-family: 'Arial', 'Helvetica', sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
      color: #ffffff;
      padding: 30px 20px;
      text-align: center;
    }
    .email-header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: bold;
    }
    .email-header p {
      margin: 10px 0 0 0;
      font-size: 14px;
      opacity: 0.9;
    }
    .email-body {
      padding: 30px 20px;
    }
    .email-body h2 {
      color: #1e40af;
      font-size: 22px;
      margin-top: 0;
      margin-bottom: 20px;
    }
    .email-body p {
      margin: 15px 0;
      font-size: 16px;
      line-height: 1.8;
    }
    .info-box {
      background-color: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 15px 20px;
      margin: 20px 0;
      border-radius: 5px;
    }
    .info-box strong {
      color: #1e40af;
      display: block;
      margin-bottom: 5px;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      margin: 20px 0;
      text-align: center;
    }
    .email-footer {
      background-color: #f9fafb;
      padding: 20px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .email-footer p {
      margin: 5px 0;
      font-size: 14px;
      color: #6b7280;
    }
    .divider {
      height: 1px;
      background-color: #e5e7eb;
      margin: 25px 0;
    }
    .highlight {
      color: #1e40af;
      font-weight: bold;
    }
  </style>
`;

// Contact Us Confirmation Email
exports.contactUsConfirmation = (name, message) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${emailStyles}
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>🙏 House of Praise</h1>
          <p>We've Received Your Message</p>
        </div>
        
        <div class="email-body">
          <h2>Thank You for Contacting Us!</h2>
          
          <p>Dear <span class="highlight">${name}</span>,</p>
          
          <p>We have successfully received your message and truly appreciate you taking the time to reach out to us.</p>
          
          <div class="info-box">
            <strong>Your Message:</strong>
            <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${message}</p>
          </div>
          
          <p>Our team will carefully review your message and respond to you as soon as possible, typically within 24-48 hours.</p>
          
          <div class="divider"></div>
          
          <p><strong>What happens next?</strong></p>
          <p>✓ Our team reviews your message<br>
             ✓ We'll respond to your email address<br>
             ✓ You can expect a reply within 1-2 business days</p>
          
          <p style="margin-top: 30px;">May God's grace and peace be with you!</p>
          
          <p style="margin-top: 20px; font-weight: bold;">Blessings,<br>The House of Praise Team</p>
        </div>
        
        <div class="email-footer">
          <p><strong>House of Praise Church</strong></p>
          <p>📧 Email: ${process.env.EMAIL_FROM || 'contact@houseofpraise.com'}</p>
          <p>🌐 Website: ${process.env.FRONTEND_URL || 'www.houseofpraise.com'}</p>
          <p style="margin-top: 15px; font-size: 12px; color: #9ca3af;">
            This is an automated confirmation email. Please do not reply to this message.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Admin Notification for Contact Message
exports.contactUsAdminNotification = (name, email, phone, subject, message) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${emailStyles}
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>📬 New Contact Message</h1>
          <p>House of Praise Admin Panel</p>
        </div>
        
        <div class="email-body">
          <h2>New Message Received</h2>
          
          <div class="info-box">
            <strong>From:</strong>
            <p style="margin: 5px 0;">${name}</p>
            
            <strong style="margin-top: 10px;">Email:</strong>
            <p style="margin: 5px 0;">${email}</p>
            
            <strong style="margin-top: 10px;">Phone:</strong>
            <p style="margin: 5px 0;">${phone || 'Not provided'}</p>
            
            <strong style="margin-top: 10px;">Subject:</strong>
            <p style="margin: 5px 0;">${subject}</p>
          </div>
          
          <div class="info-box" style="background-color: #fef3c7; border-left-color: #f59e0b;">
            <strong style="color: #92400e;">Message:</strong>
            <p style="margin: 10px 0 0 0; white-space: pre-wrap; color: #78350f;">${message}</p>
          </div>
          
          <p style="margin-top: 25px;">
            <a href="${process.env.FRONTEND_URL}/admin/messages" class="button">
              View in Admin Panel
            </a>
          </p>
        </div>
        
        <div class="email-footer">
          <p><strong>House of Praise Admin System</strong></p>
          <p style="font-size: 12px;">This is an automated notification from your website.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Ministry Application Confirmation
exports.ministryApplicationConfirmation = (firstName, lastName, ministryLabel) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${emailStyles}
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>✨ House of Praise</h1>
          <p>Ministry Application Received</p>
        </div>
        
        <div class="email-body">
          <h2>Thank You for Your Application!</h2>
          
          <p>Dear <span class="highlight">${firstName} ${lastName}</span>,</p>
          
          <p>We are thrilled to receive your application to join the <span class="highlight">${ministryLabel}</span>!</p>
          
          <div class="info-box">
            <strong>🎉 Application Status: Received</strong>
            <p style="margin: 10px 0 0 0;">Your application has been successfully submitted and is now pending review by our admin team.</p>
          </div>
          
          <p><strong>What happens next?</strong></p>
          
          <div style="background-color: #f0fdf4; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 5px 0;">✅ <strong>Step 1:</strong> Our admin team reviews your application</p>
            <p style="margin: 5px 0;">✅ <strong>Step 2:</strong> You'll receive an approval notification via email</p>
            <p style="margin: 5px 0;">✅ <strong>Step 3:</strong> Our ministry coordinator contacts you for orientation</p>
            <p style="margin: 5px 0;">✅ <strong>Step 4:</strong> You begin serving in your ministry!</p>
          </div>
          
          <p>We typically review applications within <strong>3-5 business days</strong>. You will receive an email notification once your application has been reviewed.</p>
          
          <div class="divider"></div>
          
          <p style="font-style: italic; color: #6b7280;">
            "Each of you should use whatever gift you have received to serve others, as faithful stewards of God's grace in its various forms." - 1 Peter 4:10
          </p>
          
          <p style="margin-top: 30px;">Thank you for your willingness to serve! We are excited about the possibility of you joining our ministry team.</p>
          
          <p style="margin-top: 20px; font-weight: bold;">God bless you,<br>The House of Praise Ministry Team</p>
        </div>
        
        <div class="email-footer">
          <p><strong>House of Praise Church</strong></p>
          <p>📧 Email: ${process.env.EMAIL_FROM || 'ministry@houseofpraise.com'}</p>
          <p>🌐 Website: ${process.env.FRONTEND_URL || 'www.houseofpraise.com'}</p>
          <p style="margin-top: 15px; font-size: 12px; color: #9ca3af;">
            This is an automated confirmation email. Please do not reply to this message.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Ministry Application Approval
exports.ministryApplicationApproval = (firstName, lastName, ministryLabel) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${emailStyles}
    </head>
    <body>
      <div class="email-container">
        <div class="email-header" style="background: linear-gradient(135deg, #059669 0%, #10b981 100%);">
          <h1>🎊 Congratulations!</h1>
          <p>Your Ministry Application Has Been Approved</p>
        </div>
        
        <div class="email-body">
          <h2 style="color: #059669;">Welcome to the Team!</h2>
          
          <p>Dear <span class="highlight">${firstName} ${lastName}</span>,</p>
          
          <p>We are <strong>excited to inform you</strong> that your application to join the <span class="highlight">${ministryLabel}</span> has been <strong style="color: #059669;">APPROVED</strong>! 🎉</p>
          
          <div class="info-box" style="background-color: #f0fdf4; border-left-color: #10b981;">
            <strong style="color: #059669;">✓ Application Status: APPROVED</strong>
            <p style="margin: 10px 0 0 0; color: #065f46;">You are now officially part of our ministry team!</p>
          </div>
          
          <p><strong>Next Steps:</strong></p>
          
          <div style="background-color: #eff6ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 5px 0;">📞 <strong>Contact:</strong> Our ministry coordinator will reach out to you within 3-5 business days</p>
            <p style="margin: 5px 0;">📅 <strong>Orientation:</strong> You'll be scheduled for an orientation meeting</p>
            <p style="margin: 5px 0;">📚 <strong>Training:</strong> You'll receive ministry-specific training</p>
            <p style="margin: 5px 0;">🙌 <strong>Service:</strong> You'll begin serving in your ministry role</p>
          </div>
          
          <p>We are thrilled to have you join our team and look forward to serving alongside you!</p>
          
          <div class="divider"></div>
          
          <p style="font-style: italic; color: #6b7280;">
            "Therefore, my dear brothers and sisters, stand firm. Let nothing move you. Always give yourselves fully to the work of the Lord, because you know that your labor in the Lord is not in vain." - 1 Corinthians 15:58
          </p>
          
          <p style="margin-top: 30px; font-weight: bold;">Welcome to the House of Praise Ministry Family!<br>God bless you abundantly!</p>
          
          <p style="margin-top: 20px; font-weight: bold;">Blessings,<br>The House of Praise Ministry Team</p>
        </div>
        
        <div class="email-footer">
          <p><strong>House of Praise Church</strong></p>
          <p>📧 Email: ${process.env.EMAIL_FROM || 'ministry@houseofpraise.com'}</p>
          <p>🌐 Website: ${process.env.FRONTEND_URL || 'www.houseofpraise.com'}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Ministry Application Decline
exports.ministryApplicationDecline = (firstName, lastName, ministryLabel, declineReason) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${emailStyles}
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>House of Praise</h1>
          <p>Ministry Application Update</p>
        </div>
        
        <div class="email-body">
          <h2>Application Status Update</h2>
          
          <p>Dear <span class="highlight">${firstName} ${lastName}</span>,</p>
          
          <p>Thank you for your interest in joining the <span class="highlight">${ministryLabel}</span> and for taking the time to submit your application.</p>
          
          <p>After careful review and prayerful consideration, we are unable to approve your application at this time.</p>
          
          ${declineReason ? `
          <div class="info-box" style="background-color: #fef2f2; border-left-color: #ef4444;">
            <strong style="color: #991b1b;">Reason:</strong>
            <p style="margin: 10px 0 0 0; color: #7f1d1d;">${declineReason}</p>
          </div>
          ` : ''}
          
          <p>Please know that this decision does not diminish the value of your willingness to serve. We encourage you to:</p>
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 5px 0;">• Explore other ministry opportunities with us</p>
            <p style="margin: 5px 0;">• Reapply in the future when circumstances change</p>
            <p style="margin: 5px 0;">• Contact us if you have any questions</p>
          </div>
          
          <p>We value your commitment to serving and would love to help you find the right fit within our church community.</p>
          
          <div class="divider"></div>
          
          <p style="margin-top: 30px;">If you have any questions or would like to discuss other opportunities, please don't hesitate to reach out to us.</p>
          
          <p style="margin-top: 20px; font-weight: bold;">God bless you,<br>The House of Praise Ministry Team</p>
        </div>
        
        <div class="email-footer">
          <p><strong>House of Praise Church</strong></p>
          <p>📧 Email: ${process.env.EMAIL_FROM || 'ministry@houseofpraise.com'}</p>
          <p>🌐 Website: ${process.env.FRONTEND_URL || 'www.houseofpraise.com'}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Newsletter Welcome Email
exports.newsletterWelcome = (email) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${emailStyles}
    </head>
    <body>
      <div class="email-container">
        <div class="email-header" style="background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%);">
          <h1>📧 Welcome!</h1>
          <p>You're Now Subscribed to Our Newsletter</p>
        </div>
        
        <div class="email-body">
          <h2 style="color: #7c3aed;">Thank You for Subscribing!</h2>
          
          <p>You have successfully subscribed to the <strong>House of Praise Newsletter</strong>.</p>
          
          <div class="info-box" style="background-color: #faf5ff; border-left-color: #a78bfa;">
            <strong style="color: #6b21a8;">What to Expect:</strong>
            <p style="margin: 10px 0 0 0;">
              • Weekly updates about our services and events<br>
              • Inspirational messages and devotionals<br>
              • Special announcements and opportunities<br>
              • Prayer requests and testimonies
            </p>
          </div>
          
          <p>We're excited to keep you connected with everything happening at House of Praise!</p>
          
          <div class="divider"></div>
          
          <p style="margin-top: 30px; font-weight: bold;">Stay blessed and connected!<br>The House of Praise Team</p>
        </div>
        
        <div class="email-footer">
          <p><strong>House of Praise Church</strong></p>
          <p>📧 Email: ${process.env.EMAIL_FROM || 'newsletter@houseofpraise.com'}</p>
          <p>🌐 Website: ${process.env.FRONTEND_URL || 'www.houseofpraise.com'}</p>
          <p style="margin-top: 15px; font-size: 12px;">
            <a href="${process.env.FRONTEND_URL}/unsubscribe?email=${email}" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

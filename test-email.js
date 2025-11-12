require('dotenv').config();
const { sendEmail, verifyEmailConfig } = require('./utils/email.util');

console.log('🧪 Testing Email Configuration for House of Praise\n');
console.log('='.repeat(60));

// Display config (without showing sensitive data)
console.log('\n📋 Current Configuration:');
console.log('─'.repeat(60));
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Email Host:', process.env.EMAIL_HOST || '❌ NOT SET');
console.log('Email Port:', process.env.EMAIL_PORT || '❌ NOT SET');
console.log('Email User:', process.env.EMAIL_USER || '❌ NOT SET');
console.log('Email Password:', process.env.EMAIL_PASSWORD ? '✓ Set (' + process.env.EMAIL_PASSWORD.length + ' chars)' : '❌ NOT SET');
console.log('From Name:', process.env.EMAIL_FROM_NAME || '❌ NOT SET');
console.log('From Email:', process.env.EMAIL_FROM || '❌ NOT SET');
console.log('Admin Email:', process.env.ADMIN_EMAIL || '❌ NOT SET');
console.log('Debug Mode:', process.env.EMAIL_DEBUG === 'true' ? '✓ ENABLED' : '✗ Disabled');
console.log('─'.repeat(60));

// Check if required variables are set
const requiredVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASSWORD', 'EMAIL_FROM', 'ADMIN_EMAIL'];
const missingVars = requiredVars.filter(v => !process.env[v]);

if (missingVars.length > 0) {
  console.error('\n❌ Missing required environment variables:');
  missingVars.forEach(v => console.error('   -', v));
  console.error('\n💡 Please update your .env file with all required variables.');
  console.error('📖 See .env.example for reference.');
  process.exit(1);
}

// Test email service
async function testEmailService() {
  console.log('\n📡 Step 1: Verifying email service connection...\n');
  
  const isConnected = await verifyEmailConfig();
  
  if (!isConnected && process.env.EMAIL_DEBUG !== 'true') {
    console.error('\n❌ Email service verification failed!');
    console.error('\n🔧 Troubleshooting Steps:');
    console.error('1. Check your email credentials in .env file');
    console.error('2. For Gmail: Generate App Password at https://myaccount.google.com/apppasswords');
    console.error('3. For SendGrid: Verify your API key is correct');
    console.error('4. Try enabling debug mode: EMAIL_DEBUG=true');
    console.error('\n📖 See EMAIL_SETUP_GUIDE.md for detailed instructions.');
    process.exit(1);
  }
  
  console.log('\n📧 Step 2: Sending test email...\n');
  
  try {
    const result = await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: '🎉 Test Email - House of Praise Backend',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .success { color: #059669; font-weight: bold; font-size: 18px; }
            .info-box { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; }
            ul { list-style: none; padding: 0; }
            li { padding: 8px 0; }
            li:before { content: "✓ "; color: #059669; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Email System Test</h1>
              <p>House of Praise Backend</p>
            </div>
            <div class="content">
              <p class="success">🎊 Congratulations! Your email system is working perfectly!</p>
              
              <div class="info-box">
                <strong>Configuration Details:</strong>
                <ul>
                  <li>Provider: ${process.env.EMAIL_HOST}</li>
                  <li>Port: ${process.env.EMAIL_PORT}</li>
                  <li>User: ${process.env.EMAIL_USER}</li>
                  <li>Environment: ${process.env.NODE_ENV || 'development'}</li>
                </ul>
              </div>
              
              <p><strong>What's working:</strong></p>
              <ul>
                <li>SMTP connection established</li>
                <li>Email authentication successful</li>
                <li>Email delivery confirmed</li>
                <li>HTML templates rendering correctly</li>
              </ul>
              
              <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <strong>Next Steps:</strong><br>
                Your email service is ready for production. All contact forms, ministry applications, and newsletter subscriptions will now send emails automatically.
              </p>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
                This is an automated test email from House of Praise Backend.<br>
                Timestamp: ${new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    
    if (result.error) {
      console.error('❌ Failed to send test email');
      console.error('Error:', result.message);
      console.error('\n💡 Try enabling debug mode: EMAIL_DEBUG=true');
      process.exit(1);
    }
    
    console.log('✅ Test email sent successfully!');
    if (result.messageId) {
      console.log('📬 Message ID:', result.messageId);
    }
    console.log('📮 Sent to:', process.env.ADMIN_EMAIL);
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 SUCCESS! Your email system is fully operational!');
    console.log('='.repeat(60));
    console.log('\n✓ Check your inbox at:', process.env.ADMIN_EMAIL);
    console.log('✓ Check spam folder if not in inbox');
    console.log('\n📖 For more information, see EMAIL_SETUP_GUIDE.md');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Unexpected error:', error.message);
    console.error('\n💡 Try enabling debug mode: EMAIL_DEBUG=true');
    process.exit(1);
  }
}

// Run the test
testEmailService();

// import nodemailer from "nodemailer";

// // Create transporter
// const createTransporter = () => {
//   return nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });
// };

// // Generate 6-digit OTP
// export const generateOTP = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// };

// // Send OTP email
// export const sendOTPEmail = async (email, name, otp) => {
//   try {
//     const transporter = createTransporter();

//     const mailOptions = {
//       from: {
//         name: "HiveHub",
//         address: process.env.EMAIL_USER,
//       },
//       to: email,
//       subject: "Verify Your HiveHub Account - OTP Code",
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
//           <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
//             <h1 style="color: white; margin: 0; font-size: 28px;">HiveHub</h1>
//             <p style="color: #f0f0f0; margin: 10px 0 0 0;">Welcome to the future of dropshipping</p>
//           </div>
          
//           <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
//             <h2 style="color: #333; margin-bottom: 20px;">Hi ${name}! 👋</h2>
//             <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
//               Thank you for signing up with HiveHub! To complete your registration, please verify your email address using the OTP code below:
//             </p>
            
//             <div style="background: white; border: 2px dashed #667eea; border-radius: 10px; padding: 20px; margin: 30px 0;">
//               <p style="color: #333; font-size: 14px; margin-bottom: 10px;">Your verification code is:</p>
//               <h1 style="color: #667eea; font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 0;">${otp}</h1>
//             </div>
            
//             <p style="color: #999; font-size: 14px; margin-top: 30px;">
//               ⏰ This code will expire in 10 minutes<br>
//               🔒 For security reasons, please don't share this code with anyone
//             </p>
//           </div>
          
//           <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 10px;">
//             <p style="color: #666; font-size: 14px; margin: 0;">
//               Didn't request this? You can safely ignore this email.
//             </p>
//             <p style="color: #667eea; font-size: 14px; margin: 10px 0 0 0;">
//               Need help? Contact us at support@hivehub.com
//             </p>
//           </div>
//         </div>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`✅ OTP email sent to ${email}`);
//     return true;
//   } catch (error) {
//     console.error("❌ Error sending OTP email:", error);
//     throw new Error("Failed to send verification email");
//   }
// };
import nodemailer from "nodemailer";

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email (for account verification)
export const sendOTPEmail = async (email, name, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: "HiveHub",
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: "Verify Your HiveHub Account - OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">HiveHub</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0;">Welcome to the future of dropshipping</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
            <h2 style="color: #333; margin-bottom: 20px;">Hi ${name}! 👋</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Thank you for signing up with HiveHub! To complete your registration, please verify your email address using the OTP code below:
            </p>
            
            <div style="background: white; border: 2px dashed #667eea; border-radius: 10px; padding: 20px; margin: 30px 0;">
              <p style="color: #333; font-size: 14px; margin-bottom: 10px;">Your verification code is:</p>
              <h1 style="color: #667eea; font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 0;">${otp}</h1>
            </div>
            
            <p style="color: #999; font-size: 14px; margin-top: 30px;">
              ⏰ This code will expire in 10 minutes<br>
              🔒 For security reasons, please don't share this code with anyone
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 10px;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              Didn't request this? You can safely ignore this email.
            </p>
            <p style="color: #667eea; font-size: 14px; margin: 10px 0 0 0;">
              Need help? Contact us at support@hivehub.com
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    throw new Error("Failed to send verification email");
  }
};

// Send Reset Password email (new addition, keeps old logic safe)
export const sendResetPasswordEmail = async (email, name, resetUrl) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: "HiveHub",
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: "Reset Your HiveHub Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">HiveHub</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0;">Password Reset Request</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
            <h2 style="color: #333; margin-bottom: 20px;">Hi ${name || "there"} 👋</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              We received a request to reset your HiveHub account password. Click the button below to set a new password:
            </p>
            
            <a href="${resetUrl}" 
               style="display:inline-block; background:#667eea; color:#fff; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:bold;">
              Reset Password
            </a>
            
            <p style="color: #999; font-size: 14px; margin-top: 30px;">
              ⏰ This link will expire in 15 minutes<br>
              🔒 If you didn’t request this, please ignore this email
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 10px;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              Need help? Contact us at support@hivehub.com
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Reset password email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending reset password email:", error);
    throw new Error("Failed to send reset password email");
  }
};

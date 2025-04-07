// controllers/inquiryController.js
const Inquiry = require("../Model/Message");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Send email function
const sendEmail = async (inquiry) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail", // Use your email provider (e.g., gmail, yahoo, etc.)
            auth: {
                user: process.env.EMAIL_USER, // Replace with your email
                pass: process.env.EMAIL_PASS, // Replace with your email password or app-specific password
            },
        });
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: inquiry.email,
          subject: "Thank you for your inquiry!",
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8; padding: 40px;">
              <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;">
                
                <div style="background-color: #007bff; padding: 20px; color: white; text-align: center;">
                  <h1 style="margin: 0; font-size: 24px;">SHSPL Support Team</h1>
                  <p style="margin: 5px 0 0;">We're here to help you</p>
                </div>
        
                <div style="padding: 30px;">
                  <h2 style="color: #333; font-size: 22px; margin-bottom: 15px;">Thank you for reaching out to us!</h2>
                  
                  <p style="color: #555; font-size: 16px; line-height: 1.6;">
                    We’ve received your inquiry and our team will get back to you as soon as possible. Here's a summary of your message:
                  </p>
        
                  <div style="margin: 20px 0; background-color: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; border-radius: 6px;">
                    <p style="margin: 0; color: #444;"><strong>Message:</strong> ${inquiry.message}</p>
                    <p style="margin: 8px 0 0; color: #444;"><strong>Name:</strong> ${inquiry.name}</p>
                    <p style="margin: 8px 0 0; color: #444;"><strong>Email:</strong> ${inquiry.email}</p>
                    <p style="margin: 8px 0 0; color: #444;"><strong>Subject:</strong> ${inquiry.subject}</p>
                  </div>
        
                  <p style="color: #555; font-size: 16px; margin-top: 25px;">
                    If you have any further questions, feel free to reply to this email.
                  </p>
        
                  <p style="margin-top: 35px; color: #333; font-size: 16px;">
                    Warm regards,<br/>
                    <strong style="color: #007bff;">SHSPL Support Team</strong><br/>
                    <span style="font-size: 14px; color: #888;">Customer Care | SHSPL</span>
                  </p>
                </div>
        
                <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #888;">
                  © ${new Date().getFullYear()} SHSPL. All rights reserved.
                </div>
              </div>
            </div>
          `,
        };
        
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

// Create Inquiry
exports.createInquiry = async (req, res) => {
    try {
        const {message, name, email, subject } = req.body;

        if (!message|| !name || !email || !subject) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const inquiry = new Inquiry({message, name, email, subject });
        await inquiry.save();

        // Send confirmation email
        await sendEmail(inquiry);

        res.status(201).json({ message: "Inquiry submitted successfully!" });
    } catch (error) {
        console.error("Error creating inquiry:", error);
        res.status(500).json({ message: "Server error" });
    }
};

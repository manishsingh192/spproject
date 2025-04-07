const application = require('../Model/Application');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Send email function
const sendEmail = async (application) => {
    try {
        console.log("Preparing to send email to:", application.email);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER, // e.g. your_email@gmail.com
              pass: process.env.EMAIL_PASS, // your email app password
            },
          });

          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: application.email,
            subject: `Application Received for ${application.jobType} Position`,
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; padding: 40px 0;">
                <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); padding: 30px;">
                    <!-- Header -->
                    <div style="text-align: center; margin-bottom: 25px;">
                        <div style="font-size: 24px; color: #2563eb; font-weight: 600; margin-bottom: 10px;">
                            Application Received
                        </div>
                        <div style="height: 3px; background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%); width: 60px; margin: 0 auto;"></div>
                    </div>
        
                    <!-- Content -->
                    <div style="color: #4b5563; line-height: 1.6;">
                        <p>Dear <strong style="color: #1e40af;">${application.name}</strong>,</p>
                        
                        <p>Thank you for applying for the <strong style="color: #2563eb;">${application.jobType}</strong> position with SHSPL.</p>
                        
                        <p>We have successfully received your application and will review it carefully. Our HR team will contact you if your qualifications match our requirements.</p>
                        
                        <p style="margin-top: 25px;">You can expect to hear from us within <strong>5-7 business days</strong>.</p>
                        
                        <div style="background-color: #f3f4f6; border-left: 4px solid #2563eb; padding: 12px; margin: 20px 0; border-radius: 0 4px 4px 0;">
                            <p style="margin: 0; font-style: italic;">Need to update your application?<br>
                            Reply to this email or contact us at <a href="mailto:hr@shspl.com" style="color: #2563eb;">hr@shspl.com</a></p>
                        </div>
                    </div>
        
                    <!-- Footer -->
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
                        <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px;">
                            <strong style="color: #1e40af;">Best regards,</strong>
                        </p>
                        <p style="margin: 0; color: #1e40af; font-weight: 600;">HR Team SHSPL</p>
                        <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 12px;">
                            © ${new Date().getFullYear()} SHSPL. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error.message);
        throw new Error("Email sending failed.");
    }
};


// Submit application function
const submitApplication = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        console.log("Uploaded file path:", req.file?.path);

        if (!req.file) {
            return res.status(400).json({ message: "CV file not uploaded or missing." });
        }

        const { name, email, phone, jobType } = req.body;
        const cv = req.file.path;

        // Save application to the database
        const newApplication = await application.create({ name, email, phone, jobType, cv });

        console.log("New application created:", newApplication);

        // Send confirmation email
        await sendEmail(newApplication);

        res.status(200).json({
            message: "Application submitted successfully!",
            application: newApplication,
        });
    } catch (error) {
        console.error("Error in submitApplication:", error.message);
        res.status(500).json({ message: "Failed to submit application", error: error.message });
    }
};

module.exports = { submitApplication };

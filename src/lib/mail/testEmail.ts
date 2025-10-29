import { TRPCError } from "@trpc/server";
import { createTransporter } from "./emailConfig";

export const sendTestEmail = async (to: string): Promise<void> => {
    try {
        const transporter = createTransporter();

        const subject = "Test Email from Indomitech Boilerplate";
        const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      padding: 30px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
    h2 {
      color: #2c7a7b;
    }
    p {
      color: #333;
      line-height: 1.5;
    }
    .footer {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px solid #eee;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Test Email Sent Successfully ✅</h2>
    <p>Hello there,</p>
    <p>This is a test email from your <strong>Next.js Boilerplate</strong>.  
    If you received this message, your Nodemailer transporter is working correctly!</p>

    <p>Keep building with confidence 🚀</p>

    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Indomitech Group. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

        const textBody = `Hello there,

This is a test email from your Next.js Boilerplate.
If you received this message, your Nodemailer transporter is working correctly!

Keep building with confidence 🚀

- Indomitech Group`;

        const fromEmail = process.env.NODEMAILER_EMAIL;

        await transporter.sendMail({
            from: fromEmail,
            to,
            subject,
            html: htmlBody,
            text: textBody,
        });

        console.log(`✅ Test email sent successfully to ${to}`);
    } catch (error: any) {
        console.error("❌ Failed to send test email:", error);
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to send test email",
            cause: error,
        });
    }
};

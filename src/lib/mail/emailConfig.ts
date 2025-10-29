import nodemailer from "nodemailer";

export const createTransporter = () => {
    if (!process.env.NODEMAILER_EMAIL || !process.env.NODEMAILER_PASS) {
        throw new Error("Email credentials not configured");
    }

    return nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 587, 
        secure: false, 
        requireTLS: true,
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASS
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
    });
};

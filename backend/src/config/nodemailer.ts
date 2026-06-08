


import nodemailer from "nodemailer";
import { ENV } from "./env";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,

  auth: {
    user: ENV.SMTP_USER,
    pass: ENV.SMTP_PASS,
  }
});

export default transporter;
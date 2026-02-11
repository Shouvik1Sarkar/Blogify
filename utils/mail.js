// import { body } from "express-validator";
import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendMail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Task Manager",
      link: "https://mailgen.js/",
    },
  });
  // Generate an HTML email with the provided contents
  const emailBody = mailGenerator.generate(options.mailGenContent);

  // Generate the plaintext version of the e-mail (for clients that do not support HTML)
  const emailText = mailGenerator.generatePlaintext(options.mailGenContent);

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    secure: false, // Use true for port 465, false for port 587
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  const mail = {
    from: "mail.test@gmail.com",
    to: options.email,
    subject: options.subject,
    text: emailText, // Plain-text version of the message
    html: emailBody, // HTML version of the message
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error("ERROR NODE MIALER MAIL SENDING", error);
  }
};

const emailVerificationMailContent = (userName, verificationUrl) => {
  return {
    body: {
      name: userName,
      intro: "Welcome to app! We're very excited to have you on board.",
      action: {
        instructions: "To get started with app, please click here:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Verify your account",
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};
const forgotPasswordMailContent = (userName, passwordResetUrl) => {
  return {
    body: {
      name: userName,
      intro: "RESET YOUR PASSWORD",
      action: {
        instructions: "To RESET please click here:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "resetPass",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

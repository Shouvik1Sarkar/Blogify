import Mailgen from "mailgen";
import ApiError from "./ApiError.utils";
// Configure mailgen by setting a theme and your product info

const enail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Blogify",
      link: "https://mailgen.js/",
    },
  });
  const emailBody = mailGenerator.generate(options.mailGenContent);

  const emailText = mailGenerator.generatePlaintext(options.mailGenContent);

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_TRAP_SMTP_HOST,
    port: process.env.MAIL_TRAP_SMTP_PORT,
    secure: false, // Use true for port 465, false for port 587
    auth: {
      user: process.env.MAIL_TRAP_SMTP_USER,
      pass: process.env.MAIL_TRAP_SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
      to: options.email,
      subject: options.subject || "subject",
      text: emailText, // Plain-text version of the message
      html: emailBody, // HTML version of the message
    });
  } catch (error) {
    throw new ApiError(500, error.message || "ERROR", error);
  }
};

const emailVerificationMail = async (userName, verificationUrl) => {
  return {
    body: {
      name: userName,
      intro: "Welcome to Blogify! We're very excited to have you on board.",
      action: {
        instructions: "To get started with Blogify, please click here:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Confirm your account",
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};
const logInMail = async (userName) => {
  return {
    body: {
      name: userName,
      intro: "LogIn Alert",
      action: {
        instructions: "This is to inform you about your new logIn",
        // button: {
        //   color: "#22BC66", // Optional action button color
        //   text: "Confirm your account",
        //   link: verificationUrl,
        // },
      },
      outro: "It was not you? Just reply to this email, we'd love to help.",
    },
  };
};
const forgotPasswordMail = async (userName, forgotPasswordUrl) => {
  return {
    body: {
      name: userName,
      intro: "Forgot Password",
      action: {
        instructions: "To get started with Blogify, please click here:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Confirm your account",
          link: forgotPasswordUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

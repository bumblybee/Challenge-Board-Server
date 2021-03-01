const nodemailer = require("nodemailer");
const ejs = require("ejs");
const juice = require("juice");
const { logger } = require("./logger");

const transport = nodemailer.createTransport({
  service: "SendGrid",
  host: process.env.SENDGRID_HOST,
  port: process.env.SENDGRID_PORT,
  auth: {
    user: process.env.SENDGRID_USER,
    pass: process.env.SENDGRID_PASS,
  },
});

const generateHTML = async (filename, options) => {
  const html = await ejs.renderFile(
    `${__dirname}/../views/email/${filename}.ejs`,
    options
  );
  return juice(html);
};

exports.sendEmail = async (options) => {
  try {
    const emailHTML = await generateHTML(options.filename, options);

    const mailOptions = {
      from: "Challenge Board <challengeboard@programmer.net>",
      to: options.user.email,
      subject: options.subject,
      html: emailHTML,
    };

    logger.info(
      `Sending Email - username: ${options.user.username}, email: ${options.user.email}, subject: ${options.subject}`
    );

    return transport.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
  }
};

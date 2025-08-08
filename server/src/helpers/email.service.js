const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
//gmail
exports.sendMail = async function (email, subject, html) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER, // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    // text: "Hello world?", // plain text body
    html: html, // html body
  });

  console.log("Message sent: %s", info.messageId);
}

main().catch(console.error);

};

// exports.sendMail = async function (email, subject, html) {
//   let transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: 587,
//     auth: {
//       user: process.env.SMTP_USERNAME,
//       pass: process.env.SMTP_PASSWORD,
//     },
//     debug: true, // show debug output
//   });

//   // async..await is not allowed in global scope, must use a wrapper
//   async function main() {
//     try {
//       const info = await transporter.sendMail({
//         from: "talkey@ccstiet.com", // sender address
//         to: email, // list of receivers
//         subject: subject, // Subject line
//         html: html, // html body
//       });
//       console.log("Message sent: %s", info.messageId);
//     } catch (error) {
//       console.error("Error sending email:", error);
//     }
//   }

//   main().catch(console.error);
// };

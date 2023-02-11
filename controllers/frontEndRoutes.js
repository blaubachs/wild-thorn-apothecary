const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.get("/", (req, res) => {
  res.render("home");
});

router.get("/garden", (req, res) => {
  res.render("garden");
});

router.get("/signin", (req, res) => {
  res.render("signin");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/userplants", (req, res) => {
  res.render("userplants");
});

router.get("/ourplants", (req, res) => {
  res.render("plantslist");
});

let mailFunction = async () => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "b.wildthorn@gmail.com", // generated ethereal user
      pass: process.env.EMAIL_SECRET,
      tls: {
        rejectUnAuthorized: true,
      }, // generated ethereal password
    },
  });

  // TODO: Create functionality to pass in user email and username.
  // TODO: Create this in a route to ba able to call for a specific user, find that user, and then make a list of the plants they want. Format it with html, then, add it to the body of the email.
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Wild Thorn No-reply" <b.wildthorn@yahoo.com>', // sender address
    to: `USER EMAIL HERE`, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};

router.get("/mail", async (req, res) => {
  const mail = await mailFunction();
  res.json(mail);
});

module.exports = router;

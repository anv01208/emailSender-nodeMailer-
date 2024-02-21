const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

async function sendEmail(to, subject, text) {
  try {
    let info = await transporter.sendMail({
      from: `"Eshek 👻" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    });

    console.log("Message sent: %s", info.messageId);
    return info.messageId;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error; // rethrow the error to handle it wherever this function is called
  }
}

app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;
  try {
    const messageId = await sendEmail(to, subject, text);
    res.status(200).send({ messageId });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

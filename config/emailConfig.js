import dotenv from 'dotenv';
import nodemailer from 'nodemailer'
dotenv.config();

let transporator = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user:'mamun.aleshasolutions@gmail.com', // Admin Gmail ID
      pass: 'Shajibalmamun15!@', // Admin Gmail Password
    },
  })



export default transporator;
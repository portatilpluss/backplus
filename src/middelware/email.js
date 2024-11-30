import { config } from 'dotenv';
import nodemailer from 'nodemailer'
config();


export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASWORDEMAIL,
    },
    // logger:true,
    // debug: true
  });

transporter.verify().then(()=>{
    console.log("Ready for send emails");
    
})



// GENERADOR DE CODIGO OTP



// console.log(otp);


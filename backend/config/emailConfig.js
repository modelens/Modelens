require('dotenv').config();
const nodemailer=require("nodemailer");
console.log("Email:", process.env.EMAIL);
console.log("Email Password:", process.env.EMAIL_PASSWORD);
const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.EMAIL_PASSWORD
    }
});
module.exports=transporter;

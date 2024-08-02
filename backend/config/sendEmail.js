require('dotenv').config();
const transporter=require('./emailConfig');
console.log("Email:", process.env.EMAIL);
const sendWelcomeEmail = (userEmail)=>{
    const mailOptions={
        from:process.env.MAIL,
        to:userEmail,
        subject: 'Welcome to Modelens',
        text: 'Thank you for signing up for Modelens! We are excited to have you on board.'
    }
    transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.log(`Error sending email: ${error}`);
        } else{
            console.log(`Email sent: ${info.response}`);
        }
    })
};
module.exports=sendWelcomeEmail;
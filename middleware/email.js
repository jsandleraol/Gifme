const mailer = require('nodemailer');
const {welcome} = require('../email_templates/welcome');
//const {verify_account} = require('../email_templates/verify_account');
const {reset_password} = require('../email_templates/reset_password');
const {goodbye} = require('../email_templates/goodbye');


const getEmailData = (to, name, token, template) =>{
    let data = null;
    switch(template){
        case "welcome":
            data = {
                from: "Jonathan Sandler <jsandler.aol@gmail.com",
                to,
                subject: `Hello ${name}, welcome to Gifme!`,
                //html is the template used
                html: welcome()
            }
            break;
        case "verify account":
            data = {
                from: "Gifme <jsandler.aol@gmail.com",
                to,
                subject: `Gifme - Please verify your account`,
                html: `<a href="http://localhost:3000/confirm/${token}">click here to validate your account</a>`
            //    html: verify_account()
            }
            break;
        case "reset password":
            data = {
                from: "Gifme <jsandler.aol@gmail.com",
                to,
                subject: `Gifme - Reset your password`,
                html: reset_password(token)
            }
            break;
        case "change confirmation":
            data = {
                from: "Gifme <jsandler.aol@gmail.com",
                to,
                subject: `Gifme - Your password has been updated`,
                html: `Congrats! Your password has been updated successfully`
            //    html: verify_account()
            }
            break;
        case "goodbye":
            data = {
                from: "Gifme <jsandler.aol@gmail.com",
                to,
                subject: `Gifme - Sad you are gone :(`,
                html: goodbye()
            }
            break;
        default:
            data;
    }
    return data;
}

const sendEmail = (to, name,token, type) => {
    const smtpTransport = mailer.createTransport({
        service: "Gmail",
        auth:{
            user: "jsandler.aol@gmail.com",
            pass: "Ayurveda17."
        }
    })

const mail = getEmailData(to, name,token, type);

smtpTransport.sendMail(mail, function(error, response){
    if(error){
        console.error('error sending mail:', error);
    }else {
        console.log("email sent successfully");
    }
    smtpTransport.close();
})
}

module.exports = {sendEmail};
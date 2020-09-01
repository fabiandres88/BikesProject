const nodeMailer = require('nodemailer');
const sengridTransport = require('nodemailer-sendgrid-transport');

let mailConfing;
if (process.env.NODE_ENV === 'production') {
    const options = {
        auth: {
            api_key: process.env.SENGRID_API_KEY
        }
    }
    mailConfig = sengridTransport(options);
} else {
    if (process.env.NODE_ENV === 'staging') {
        console.log('XXXXXXXXXXXXXXXXXXXXXXX');
        const options = {
            auth: {
                api_key: process.env.SENGRID_API_KEY
            }
        }
        mailConfig = sengridTransport(options);
    } else {
        //all mails are catched by ethereal.email
        mailConfig = {
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: process.env.ethereal_user,
                pass: process.env.ethereal_pass
            }
        };
    }
}

module.exports = nodeMailer.createTransport(mailConfig);
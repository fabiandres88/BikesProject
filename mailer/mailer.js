const nodeMailer = require ('nodemailer');

const mailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'curtis.glover@ethereal.email',
        pass: 'CwEudWaqXTZ1K1YUAS'
    }
};

module.exports = nodeMailer.createTransport(mailConfig);

/*Name	Curtis Glover
Username	curtis.glover@ethereal.email (also works as a real inbound email address)
Password	CwEudWaqXTZ1K1YUAS*/
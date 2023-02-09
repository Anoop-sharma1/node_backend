const nodemailer = require('nodemailer');


let mailTransporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: "12b5351740b91e",
        pass: "a0fd48cd0055bd"
    }
});

const otpVerification = async function otpVerification(data) {
    message = {
        from: "12b5351740b91e",
        to: data.to,
        subject: data.subject,
        text: data.text
    }
    
    mailTransporter.sendMail(message, function (err, info) {
        // if (err) {
        //     console.log(err)
        // } else {
        //     console.log(info);
        // }
    });
}

module.exports = {
    otpVerification
};
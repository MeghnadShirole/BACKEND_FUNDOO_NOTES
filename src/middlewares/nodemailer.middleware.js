import nodemailer from 'nodemailer';

export const sendEMail = (url, email) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        },
    });

    const mailOptions = {
        from: process.env.EMAIL, // sender address
        to: email, // receiver's address  
        subject: 'FundooNotes Reset Password Link', // Subject line
        text: 'Hello from FundooNotes\n\n Your Reset Password link is:\n\n' + url //url for reset password
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err)
            return ('error while sending mail==> ', err);
        else
            return ('result on sending mail==> ', info);
    });
}
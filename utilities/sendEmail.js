const nodemailer = require('nodemailer')

module.exports = async (mailOptions) => {
    let transporter = nodemailer.createTransport({
        service: "Gmail",
        port: 2525,
        auth: {
          user: "lenofreality@kit.edu.kh",
          pass: "lenofreality",
        },
        tls: {
          rejectUnauthorized: false,
          },
    });
    const result = await transporter.sendMail(mailOptions)
    return result
}
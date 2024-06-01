const User = require("../models/users")
const nodemailer = require("nodemailer")

const sendEmail = async ({ email, userId }) => {
    try {
        const otp = Math.floor(Math.random() * (999999 - 100000)) + 100000;
        console.log(otp);
        await User.findByIdAndUpdate(userId, { $set: { verifyOtp: otp, verifyOtpExpiry: Date.now() + 3600000 } });

        var transporter = nodemailer.createTransport({
            host: "live.smtp.mailtrap.io",
            port: 587,
            auth: {
                user: "api",
                pass: "dc58aaafa13750c9cad28795e3fe854f"
            }
        });
        const mailOptions = {
            from: "mailtrap@demomailtrap.com",
            to: "kaushalkaran011@gmail.com",
            subject: "Reset by OTP",
            html: `<p>Click <a href="${process.env.DOMAIN}/resetpassword?otp=${otp}">here</a> to reset your password"
            or copy or paste the link below in your browser
            <br>${process.env.DOMAIN}/resetpassword?otp=${otp}<br>
            otp =${otp}
             </p>`
        }

        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse
    } catch (error) {
        throw new Error(error.message);
    }
}
module.exports = sendEmail;
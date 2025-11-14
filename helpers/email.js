const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const sendVerificationEmail = async ({ to, token, userId, name }) => {
    const link = `${process.env.APP_BASE_URL}/verify-email?token=${token}&id=${userId}`;
    const html = `
    <p>Hi ${name || ''},</p>
    <p>Thanks for signing up. Click the link below to verify your email:</p>
    <p><a href="${link}">Verify your email</a></p>
    <p>If the link doesn't work, paste this into your browser:</p>
    <p>${link}</p>
    <p>This link expires in 24 hours.</p>
  `;

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject: 'Verify your email',
        html
    });
};

module.exports = { sendVerificationEmail, transporter };

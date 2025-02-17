import nodemailer from 'nodemailer';

export async function sendVerificationEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS // App password (generate from Google security settings)
    }
  });

  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`;

  await transporter.sendMail({
    from: `"QCast" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email',

    html: `
        <p>Welcome to Qcast!</p>
        <p>Click the link below to verify your email:</p>
        <a href="${verificationUrl}">Verify Email</a>`
  });
}

import nodemailer from 'nodemailer';

const sendVerificationEmail = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'email@gmail.com', 
      pass: 'password', 
    },
  });

  const mailOptions = {
    from: 'email@gmail.com', 
    to: email,
    subject: 'Email Verification',
    text: `Click the following link to verify your email: http://localhost:3000/auth/verify/${verificationToken}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending verification email to ${email}: ${error.message}`);
  }
};

export default sendVerificationEmail;

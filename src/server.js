const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'naveenkumartceit@gmail.com', // Replace with your email
    pass: 'fqsradrmktxnxnaf', // Replace with your email password
  },
});

app.post('/api/send-email', (req, res) => {
  const { title, name, occupation, companyType, mobile, email, productInterest, department, expectedDate, expectedTime } = req.body;

  const mailOptionsUser = {
    from: 'naveenkumartceit@gmail.com', // Replace with your email
    to: email,
    subject: 'Appointment Request',
    text: `Dear ${title} ${name},\n\nYour appointment is requested for ${expectedDate} at ${expectedTime}.\n\nThank you for choosing FusionGreen Healthcare.\n\nRegards,\nFusionGreen Healthcare`,
  };

  const mailOptionsAdmin = {
    from: 'naveenkumartceit@gmail.com', // Replace with your email
    to: 'gokulpriyan@student.tce.edu', // Replace with admin email
    subject: 'New Appointment Request',
    text: `New appointment request details:\n\nName: ${title} ${name}\nOccupation: ${occupation}\nCompany Type: ${companyType}\nMobile: ${mobile}\nEmail: ${email}\nProduct Interest: ${productInterest}\nDepartment: ${department}\nExpected Date: ${expectedDate}\nExpected Time: ${expectedTime}`,
  };

  transporter.sendMail(mailOptionsUser, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    transporter.sendMail(mailOptionsAdmin, (error, info) => {
      if (error) {
        return res.status(500).send(error.toString());
      }
      res.status(200).send('Emails sent successfully');
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

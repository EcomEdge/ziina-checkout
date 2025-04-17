// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Root route - Home page for the server
app.get('/', (req, res) => {
  res.send('Welcome to the Ziina Checkout API! 🚀');
});

// Ziina payment link endpoint
app.post('/create-ziina-payment', async (req, res) => {
  const { amount, email, phone } = req.body;

  try {
    const response = await axios.post('https://api.ziina.com/payment-links', {
      amount,
      currency: 'AED',
      description: `Ecom Edge Membership - ${amount} AED`,
      customer: {
        email,
        phone
      },
      callback_url: 'https://yourwebsite.com/thank-you' // Optional redirect after payment
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.ZIINA_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const paymentUrl = response.data.payment_url;
    res.json({ url: paymentUrl });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to create payment link' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
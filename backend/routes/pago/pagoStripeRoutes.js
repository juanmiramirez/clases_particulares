const express = require('express');
const router = express.Router();
const { crearCheckoutSession } = require('../../controllers/pago/pagoStripeController');

router.post('/checkout', crearCheckoutSession);

module.exports = router;
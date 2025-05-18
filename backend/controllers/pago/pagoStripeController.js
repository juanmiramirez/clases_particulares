const stripe = require('../../utils/stripe');
const db = require('../../db');

const crearCheckoutSession = async (req, res) => {
  const { id_clase, monto, id_estudiante } = req.body;

  if (!id_clase || !monto || !id_estudiante) {
    return res.status(400).json({ error: 'Faltan datos para el pago' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Clase ${id_clase}`,
            description: 'Reserva de clase en plataforma de profesores'
          },
          unit_amount: Math.round(monto * 100)
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel'
    });

    // Guardamos pago "pendiente"
    await db.query(`
      INSERT INTO pago (id_clase, id_estudiante, metodo, estado_pago, monto, stripe_session_id)
      VALUES ($1, $2, 'stripe', 'pendiente', $3, $4)
    `, [id_clase, id_estudiante, monto, session.id]);

    res.json({ checkout_url: session.url });
  } catch (error) {
    console.error('Error al crear sesión de pago Stripe:', error);
    res.status(500).json({ error: 'Error al crear el enlace de pago' });
  }
};

module.exports = { crearCheckoutSession };
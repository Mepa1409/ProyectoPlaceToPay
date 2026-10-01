require('dotenv').config();

const express = require('express');
const cors = require('cors');

const {
    createPaymentSession,
    getPaymentSession
} = require('./services/placetopayService');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Backend funcionando correctamente'
    });
});

app.post('/api/payment', async (req, res) => {
    try {
        const { items, payer } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                error: 'El carrito no puede estar vacío' //se valida que el carrito debe tener almenos un producto
            });
        }

        if (!payer) {
            return res.status(400).json({
                error: 'Los datos del comprador son obligatorios'
            });
        }

        for (const item of items) {
            if (
                !item.id ||
                !item.name ||
                typeof item.price !== 'number' ||
                typeof item.quantity !== 'number' ||
                item.price <= 0 ||
                item.quantity <= 0
            ) {
                return res.status(400).json({
                    error: 'Los productos del carrito no tienen información válida'
                });
            }
        }

        const result = await createPaymentSession(items, payer);

        res.json(result);

    } catch (error) {
        console.error(error.response?.data || error.message);

        res.status(500).json({
            error: 'Error al crear la sesión de pago',
            details: error.response?.data || error.message
        });
    }
});

app.get('/api/payment/:requestId', async (req, res) => {
    try {
        const result = await getPaymentSession(req.params.requestId);

        res.json(result);

    } catch (error) {
        console.error(error.response?.data || error.message);

        res.status(500).json({
            error: 'Error al consultar la sesión de pago',
            details: error.response?.data || error.message
        });
    }
});

app.get('/return', (req, res) => {
    console.log('Retorno de Placetopay:', req.query);

    res.json({
        message: 'Regresamos desde Placetopay',
        data: req.query
    });
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
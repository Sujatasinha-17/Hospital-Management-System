const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');

router.get('/', async (req, res) => {
    const bills = await Bill.find();
    res.json(bills);
});

router.post('/', async (req, res) => {
    const count = await Bill.countDocuments();
    const newBill = new Bill({ id: `INV-${503 + count}`, ...req.body });
    await newBill.save();
    res.json(newBill);
});

router.patch('/:id/pay', async (req, res) => {
    await Bill.updateOne({ id: req.params.id }, { status: 'Paid' });
    res.json({ success: true });
});

module.exports = router;

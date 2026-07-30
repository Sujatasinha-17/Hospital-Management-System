const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

router.get('/', async (req, res) => {
    const appointments = await Appointment.find();
    res.json(appointments);
});

router.post('/', async (req, res) => {
    const count = await Appointment.countDocuments();
    const newAppt = new Appointment({ id: A-${String(4 + count).padStart(2, '0')}, status: 'Scheduled', ...req.body });
    await newAppt.save();
    res.json(newAppt);
});

router.patch('/:id/cancel', async (req, res) => {
    await Appointment.updateOne({ id: req.params.id }, { status: 'Cancelled' });
    res.json({ success: true });
});

module.exports = router;

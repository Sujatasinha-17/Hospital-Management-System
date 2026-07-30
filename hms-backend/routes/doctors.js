const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

router.get('/', async (req, res) => {
    const doctors = await Doctor.find();
    res.json(doctors);
});

router.post('/', async (req, res) => {
    const count = await Doctor.countDocuments();
    const newDoctor = new Doctor({ id: `D-${String(4 + count).padStart(2, '0')}`, ...req.body });
    await newDoctor.save();
    res.json(newDoctor);
});

router.delete('/:id', async (req, res) => {
    await Doctor.deleteOne({ id: req.params.id });
    res.json({ success: true });
});

module.exports = router;

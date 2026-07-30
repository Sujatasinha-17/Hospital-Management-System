const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

router.get('/', async (req, res) => {
    const patients = await Patient.find();
    res.json(patients);
});

router.post('/', async (req, res) => {
    const count = await Patient.countDocuments();
    const newPatient = new Patient({ id: P-${1005 + count}, ...req.body });
    await newPatient.save();
    res.json(newPatient);
});

router.delete('/:id', async (req, res) => {
    await Patient.deleteOne({ id: req.params.id });
    res.json({ success: true });
});

module.exports = router;

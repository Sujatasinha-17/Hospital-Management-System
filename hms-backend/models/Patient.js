const mongoose = require('mongoose');
const patientSchema = new mongoose.Schema({
    id: String,
    name: String,
    age: Number,
    gender: String,
    condition: String,
    doctorId: String,
    status: String,
});
module.exports = mongoose.model('Patient', patientSchema);

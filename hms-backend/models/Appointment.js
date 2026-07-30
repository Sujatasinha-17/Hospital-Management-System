const mongoose = require('mongoose');
const appointmentSchema = new mongoose.Schema({
    id: String,
    patientId: String,
    doctorId: String,
    date: String,
    time: String,
    status: String,
});
module.exports = mongoose.model('Appointment', appointmentSchema);

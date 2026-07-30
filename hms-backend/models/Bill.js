const mongoose = require('mongoose');
const billSchema = new mongoose.Schema({
    id: String,
    patientId: String,
    amount: Number,
    status: String,
});
module.exports = mongoose.model('Bill', billSchema);

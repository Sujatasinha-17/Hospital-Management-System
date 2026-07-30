const mongoose = require('mongoose');
const doctorSchema = new mongoose.Schema({
    id: String,
    name: String,
    specialty: String,
    email: String,
    phone: String,
});
module.exports = mongoose.model('Doctor', doctorSchema);

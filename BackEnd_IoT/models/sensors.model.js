const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const sensorSchema = new mongoose.Schema({
    temperature: {
        type: Number,
        required: true
    },
    humidity: {
        type: Number,
        required: true
    },
    light: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});
// Sử dụng plugin AutoIncrement để thêm trường id tự tăng
sensorSchema.plugin(AutoIncrement, { inc_field: 'id' });

const Sensor = mongoose.model('Sensor', sensorSchema, 'sensors');

module.exports = Sensor;
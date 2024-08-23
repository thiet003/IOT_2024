const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const actionSchema = new mongoose.Schema({
    sensorName: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});
// Sử dụng plugin AutoIncrement để thêm trường id tự tăng
actionSchema.plugin(AutoIncrement, { inc_field: 'action_id' });

const Action = mongoose.model('Action', actionSchema, 'actions');

module.exports = Action;
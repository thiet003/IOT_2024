const Sensor = require('../models/sensors.model');
// Top 10 dữ liệu mới nhất, sắp xếp theo thời gian giảm dần
module.exports.topLastSensor = async (req, res) => {
    try {
        const sensors = await Sensor.find().sort({ date: -1 }).limit(10);
        
        res.json(sensors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
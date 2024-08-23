const express = require('express');
const app = express();
const cors = require('cors');
const port = 8000;
const mongoose = require('mongoose');
const Sensor = require('./models/sensors.model');

// Allow parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import controllers
const changeFan = require('./controllers/changeFan.controller');
const changeAir = require('./controllers/changeAir.controller');
const changeLamp = require('./controllers/changeLamp.controller');
const topLastSensor = require('./controllers/topLastSensor.controller');
const getHistoryAction = require('./controllers/getHistoryAction.controller');
const getAllSenSor = require('./controllers/getAllSenSor.controller');

// Kết nối đến broker MQTT
const mqttClient = require('./mqtt/mqttClient');

// Cài đặt CORS
app.use(cors());

// Routes
app.post('/api/v1/fan/status', changeFan);
app.post('/api/v1/air/status', changeAir);
app.post('/api/v1/lamp/status', changeLamp);

app.get('/api/v1/top-last-sensor', topLastSensor.topLastSensor);
app.get('/api/v1/history-action', getHistoryAction);
app.get('/api/v1/sensors', getAllSenSor);
mqttClient.on('message', (topic, message) => {
  // message là một Buffer, chuyển đổi nó thành chuỗi
  if (topic === 'sensor/data') {
    const data = message.toString();
    try {
      const parsedData = JSON.parse(data);
      // Trích xuất nhiệt độ, độ ẩm và ánh sáng từ dữ liệu
      const temperature = parsedData.temperature;
      const humidity = parsedData.humidity;
      const light = parsedData.light;
      // Lưu dữ liệu vào MongoDB
      if (temperature && humidity && light) {
        const sensor = new Sensor({
          temperature: parseFloat(temperature),
          humidity: parseFloat(humidity),
          light: parseFloat(light),
        });
        sensor.save();
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  }
});

// Connect DB
mongoose.connect('mongodb://127.0.0.1:27017/iot')
  .then(() => {
    app.listen(port, () => {
      console.log('Connect successfully!');
      console.log(`Server listening at http://localhost:${port}`);
    });
  });


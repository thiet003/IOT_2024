const express = require('express');
const app = express();
const cors = require('cors');
const port = 8000;
const mongoose = require('mongoose');
const Sensor = require('./models/sensors.model');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
// Allow parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cấu hình các tùy chọn cho Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for your Node.js project',
    },
  },
  apis: ['./routes/*.js'], // Đường dẫn tới các tệp chứa chú thích Swagger
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Cấu hình Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Kết nối đến broker MQTT
const mqttClient = require('./mqtt/mqttClient');

// Cài đặt CORS
app.use(cors());

// Routes
const mainRoute = require('./routes/main.route');
app.use('/' ,mainRoute);

mqttClient.on('message', (topic, message) => {
  // message là một Buffer, chuyển đổi nó thành chuỗi
  if (topic === 'sensor/datas') {
    const data = message.toString();
    try {
      // console.log('data:', data);
      const parsedData = JSON.parse(data);
      // Trích xuất nhiệt độ, độ ẩm và ánh sáng từ dữ liệu
      const temperature = parsedData.temperature;
      const humidity = parsedData.humidity;
      const light = parsedData.light;
      // console.log('temperature:', temperature);
      
      // Lưu dữ liệu vào MongoDB
      if (temperature && humidity && light) {
        const sensor = new Sensor({
          temperature: parseFloat(temperature),
          humidity: parseFloat(humidity),
          light: 1024 - parseFloat(light),
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


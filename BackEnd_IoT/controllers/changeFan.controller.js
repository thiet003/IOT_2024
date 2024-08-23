const mqttClient = require('../mqtt/mqttClient');
const Action = require('../models/actions.model');
const changeFan = (req, res) => {
    const state = req.body.state;
    console.log(state);
    
    if (state === "on" || state === "off") {
      // Đặt một callback để lắng nghe phản hồi từ MQTT
      const mqttResponseHandler = (topic, message) => {
        if (topic === 'iot/fan/status') {
          const status = message.toString();
          console.log(`Received Fan status: ${status}`);
          
          if (status === state) {
            // Lưu hành động vào database
            const actionStr = state === 'on' ? 'Bật' : 'Tắt';
            const action = new Action({
              sensorName: 'Quạt',
              action: actionStr
            });
            action.save();
            res.status(200).json({ fanState: state });
          } else {
            res.status(500).json({ message: 'Failed to change Fan state' });
          }
          
          // Loại bỏ listener sau khi nhận được phản hồi
          mqttClient.removeListener('message', mqttResponseHandler);
        }
      };
  
      // Đăng ký listener cho phản hồi từ MQTT
      mqttClient.on('message', mqttResponseHandler);
  
      // Gửi yêu cầu bật/tắt đèn qua MQTT
      mqttClient.publish('iot/fan', state);
      console.log('Sent fan');
  
    } else {
      res.status(400).json({ message: 'Invalid state' });
    }
};

module.exports = changeFan;
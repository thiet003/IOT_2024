# IoT Dashboard

This is an IoT project that involves real-time monitoring and control of devices. The project consists of three main parts: embedded code running on an ESP8266 microcontroller, a backend server built with Express.js, and a frontend developed using ReactJS. The project was developed as part of the IoT course at PTIT under the guidance of Mr. Uy.

## Getting Started

This project allows you to monitor environmental data such as temperature, humidity, and light levels, and control various devices remotely through a web interface. Data is transmitted between the ESP8266 and the backend server via MQTT, and the backend server communicates with the frontend to display real-time data and control options.

## Project Structure

- **Embedded Code**: Code that runs on the ESP8266 microcontroller to read sensor data and control devices.
- **BackEnd_IoT**: The backend server built with Express.js that handles data from the ESP8266 and serves it to the frontend.
- **frontend_iot**: The frontend application built with ReactJS that provides a user interface for monitoring and controlling devices.

## Setup

### Embedded Code

1. Install Arduino IDE.
2. Install the necessary libraries located in the `embedded/lib` directory.
3. Open Arduino IDE, create a new project, and paste the code from `/sketch_aug18a.ino` into it.
4. Upload the code to the ESP8266 microcontroller.

### Backend

1. Navigate to the backend directory:

   ```bash
   cd BackEnd_IoT/
   ```
2. Install the required dependencies:

    ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
 
### Frontend
1. Navigate to the frontend directory:
    ```bash
   cd frontend_iot/
   ```

2. Install the required dependencies:
    ```bash
   npm install
   ```
3. Start the frontend application:
    ```bash
   npm start
   ```

### Contributing
Feel free to contribute to this project by submitting issues or pull requests. Any contributions are highly appreciated.
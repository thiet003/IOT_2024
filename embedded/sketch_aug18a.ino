// const char* mqtt_broker = "broker.hivemq.com"; 
#include <DHT.h>
#include <PubSubClient.h>
#include <ESP8266WiFi.h>
#include <NTPClient.h>
#include <WiFiUdp.h>

#define DHT_PIN D4        // Chân GPIO nối với DATA của cảm biến DHT
#define FAN_PIN D5        
#define AIR_CONDITIONER D6        
#define LAMP D0        
#define DHT_TYPE DHT11  
#define LIGHT_PIN A0
DHT dht(DHT_PIN, DHT_TYPE);

// const char* ssid = "T3 T"; 
const char* ssid = "Redmi Note 13"; 
const char* password = "88888888";  
// MQTT Broker
const char* mqtt_broker = "192.168.234.35"; // Địa chỉ broker MQTT
// const char* mqtt_broker = "192.168.32.11"; // Địa chỉ broker MQTT
const int mqtt_port = 1883;
const char* mqtt_username = "thiet003";
const char* mqtt_password = "123456";
// Topic
const char *topicFan = "iot/fan";
const char *topicAirConditioner = "iot/air";
const char *topicLamp = "iot/lamp";
int dust = 0;
WiFiClient espClient;
PubSubClient client(espClient);

// Define NTP Client to get time
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");

// Variable to save current epoch time
unsigned long epochTime;

// Function that gets current epoch time
unsigned long getTime() {
    timeClient.update();
    unsigned long now = timeClient.getEpochTime();
    return now;
}

void connectWifi() {
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(100);
        Serial.print(".");
    }
    Serial.println();
    Serial.print("Wifi Connected! as ");
    Serial.println(WiFi.localIP().toString());
}

void setFan(bool status) {
    if (status == true) {
        digitalWrite(FAN_PIN, HIGH);  
        Serial.println("Turn on the fan");
    } else {
        digitalWrite(FAN_PIN, LOW); 
        Serial.println("Turn off the fan");
    }
}
void setAirConditioner(bool status) {
    if (status == true) {
        digitalWrite(AIR_CONDITIONER, HIGH);  
        Serial.println("Turn on the air conditioner");
    } else {
        digitalWrite(AIR_CONDITIONER, LOW);  
        Serial.println("Turn off the air conditioner");
    }
}
void setLamp(bool status) {
    if (status == true) {
        digitalWrite(LAMP, HIGH);  
        Serial.println("Turn on the lamp");
    } else {
        digitalWrite(LAMP, LOW);  
        Serial.println("Turn off the lamp");
    }
}
void callback(char *topic, byte *payload, unsigned int length) {
    Serial.print("Message arrived in topic: ");
    Serial.println(topic);

    String message;
    for (int i = 0; i < length; i++) {
        message += (char) payload[i];
    }
    Serial.printf("Message: %s\n", message.c_str());

    if (strcmp(topic, topicFan) == 0) {
        setFan(message.equals("on"));
        // Gửi lại xác nhận về trạng thái quạt
        String fanStatus = message.equals("on") ? "on" : "off";
        client.publish("iot/fan/status", fanStatus.c_str());
    }
    else if (strcmp(topic, topicAirConditioner) == 0) {
        setAirConditioner(message.equals("on"));
        // Gửi lại xác nhận về trạng thái điều hòa
        String acStatus = message.equals("on") ? "on" : "off";
        client.publish("iot/air/status", acStatus.c_str());
    }
    else if (strcmp(topic, topicLamp) == 0) {
        setLamp(message.equals("on"));
        // Gửi lại xác nhận về trạng thái đèn
        String lampStatus = message.equals("on") ? "on" : "off";
        client.publish("iot/lamp/status", lampStatus.c_str());
    }
    Serial.println("-----------------------");
}

void connectMqtt() {
    //connecting to a mqtt broker
    client.setServer(mqtt_broker, 1883);
    client.setCallback(callback);
}
void reconnect(){
    while (!client.connected()) {
        String client_id = "esp8266-client-";
        client_id += String(WiFi.macAddress());

        Serial.printf("The client %s connects to mosquitto mqtt broker\n", client_id.c_str());

        if (client.connect("ESP8266Client",mqtt_username, mqtt_password)) {
            Serial.println("Public emqx mqtt broker connected");
            registerTopicMqtt();
        } else {
            Serial.print("failed with state ");
            Serial.print(client.state());
            delay(2000);
        }
    }
}
void registerTopicMqtt() {
    client.subscribe(topicFan);
    client.subscribe(topicAirConditioner);
    client.subscribe(topicLamp);
}

void readDht() {
        // Đọc dữ liệu từ cảm biến DHT
        float humidity = dht.readHumidity();
        float temperature = dht.readTemperature();
        int light = analogRead(LIGHT_PIN);
        Serial.print("LDR Value: ");
        Serial.println(light); // In giá trị ra Serial Monitor
        // dust = random(101);
        // Serial.print("Dust Value: ");
        // Serial.println(dust);
        // Kiểm tra xem d/ữ liệu có đọc được không
        if (isnan(humidity) || isnan(temperature) || isnan(light)) {
          Serial.println("Failed to read from DHT sensor!");
          return;
        }

        // Tạo payload JSON với dữ liệu đọc được từ cảm biến
        Serial.println(temperature);
        String payload = "{\"temperature\": " + String(temperature) + 
                    ", \"humidity\": " + String(humidity) + 
                    ", \"light\": " + String(light) + "}";

        client.publish("sensor/datas", payload.c_str()); // Gửi dữ liệu tới chủ đề MQTT
        Serial.println("Published data to 'sensor/datas'");
}
void setup() {
  Serial.begin(115200);
    connectWifi();
    timeClient.begin();
    pinMode(FAN_PIN, OUTPUT);
    pinMode(AIR_CONDITIONER, OUTPUT);
    pinMode(LAMP, OUTPUT);
    connectMqtt();
    registerTopicMqtt();

    randomSeed(getTime());
    // Khởi tạo cảm biến DHT11
    dht.begin();
}

void loop() {
    // wait server connected
    delay(1000);
    if (!client.connected()) {
    reconnect();  // Kết nối lại nếu cần
  }
    client.loop();
    readDht();
    delay(1000);
}

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <DHT.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>

// Wi-Fi setup
#define WIFI_SSID "AirFiber 2G"
#define WIFI_PASSWORD "Raghu973*#12345"
// Firebase setup
#define API_KEY "AIzaSyDfg6ZcahC6s7dEF5IsEBFaRUxtZ21fU5s"
#define DATABASE_URL "https://crop-recommendation-syst-92fe6-default-rtdb.asia-southeast1.firebasedatabase.app/"
FirebaseConfig config;
FirebaseAuth auth;
FirebaseData firebaseData;



// OLED and Sensor setup
#define PH_SENSOR_PIN 34
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
const int sensorPin = 35;
int soilmoisturevalue = 0;
int soilmoisturepercent = 0;
float voltage, pHValue;
const float calibrationFactor = 3.5;
const int sensorSamples = 10;
DHT dht(18, DHT11);
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);



void setup() {
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting...");
  while (WiFi.status()!=WL_CONNECTED)  {
  Serial.print(".");
  delay(500);
  }  
  Serial.println();
  Serial.println("Connected!!!");
  Serial.println(WiFi.localIP());

  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  if(Firebase.signUp(&config, &auth, "", "")){
    Serial.println("Connected to Firebase...");
  } else {
    Serial.println("Not Connected");
  }

  dht.begin();
  Firebase.begin(&config, &auth);  

  if (!display.begin(SSD1306_PAGEADDR, 0x3C)) { 
    Serial.println(F("SSD1306 allocation failed"));
    for (;;);
  }

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.println(F("Crop Recommendation"));
  display.display();
  delay(2000);

  // Initialize DHT sensor


  
}


void loop() {
  // pH sensor reading
  float total = 0;
  for (int i = 0; i < sensorSamples; i++) {
    total += analogRead(PH_SENSOR_PIN);
    delay(10);
  }
  float averageADC = total / sensorSamples;
  voltage = (averageADC / 4095.0) * 0.03;
  pHValue = 7.0 + ((voltage - calibrationFactor) * -0.03);

  // Read DHT sensor
  float temp = dht.readTemperature();
  float humidity = dht.readHumidity();
  if (isnan(temp) || isnan(humidity)) {
    Serial.println("Failed to read from DHT sensor");
    temp = 0; humidity = 0; // Assign default values
  }

  // Soil moisture sensor reading
  soilmoisturevalue = analogRead(sensorPin);
  soilmoisturepercent = soilmoisturevalue/10;

  Firebase.RTDB.setFloat(&firebaseData, "temperature", temp);
  Firebase.RTDB.setFloat(&firebaseData, "humidity", humidity);
  Firebase.RTDB.setFloat(&firebaseData, "moisture", soilmoisturepercent);
  Firebase.RTDB.setFloat(&firebaseData, "ph", pHValue);

  // Display data on OLED
  display.clearDisplay();
  display.setCursor(0, 0);
  display.print(F("Moisture: "));
  display.println(soilmoisturepercent);
  display.print(F("Temperature: "));
  display.println(temp);
  display.print(F("Humidity: "));
  display.println(humidity);
  display.print(F("pH Value: "));
  display.println(pHValue);
  display.print(F("Voltage: "));
  display.println(voltage);
  display.display();

  delay(1000); // Delay for the next reading
}

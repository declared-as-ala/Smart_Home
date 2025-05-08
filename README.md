# 🏠 SmartHome — Real-Time IoT Control & Monitoring App

**SmartHome** is a real-time IoT-based smart house application built with **React Native**, powered by the **MQTT protocol** for seamless communication between sensors and actuators. It enables users to monitor and control home devices such as **lights, doors, windows, and fans** across different rooms, with **live sensor data visualization**.

<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <img src="https://github.com/user-attachments/assets/0fca5c6b-b031-4929-9646-ea67c6bf18c6" width="200"/>
  <img src="https://github.com/user-attachments/assets/d9ceb689-d3ca-4959-96b1-b7c6d933a97a" width="200"/>
  <img src="https://github.com/user-attachments/assets/2da5bf88-d377-4ed7-b19b-20f5ea5f8eaf" width="200"/>
  <img src="https://github.com/user-attachments/assets/cede9cb6-53e0-45f7-b2e8-7325eab82c4c" width="200"/>
  <img src="https://github.com/user-attachments/assets/ef6b8a07-947f-4d75-adca-c0cd86bc7d85" width="200"/>
</div>


---

## 🔧 Features

### 📶 Real-Time MQTT Integration
- Live communication with a central **MQTT broker** (e.g., Mosquitto)
- Subscribes and publishes to specific **topics per device**
- Ensures near-instantaneous updates across sensors and controls

### 💡 Room-Based Control
- Toggle **lights, fans**, and **open/close doors or windows**
- Support for multiple rooms:
  - **Living Room**
  - **Bedroom**
  - **Kitchen**

### 📊 Live Sensor Data Monitoring
Real-time display of environmental metrics:
- **Temperature** 🌡️
- **Humidity** 💧
- **Light Intensity** ☀️
- **Motion Detection** 🕵️

### 📈 Charts and Visualization
- Historical data displayed using **line and bar charts**
- Powered by `react-native-chart-kit` for rich UI representation

### 🌙 Light/Dark Theme Support
- Dynamic theming using:
  - `Zustand` for state management
  - Custom `useTheme` hook for switching themes

### 🔐 Secure & Efficient Architecture
- **Efficient state management** with Zustand
- Modular and reusable **UI components**
- Clean and extendable **API integration** for backend expansion

---

## ⚙️ Technologies Used

| Layer       | Technologies |
|-------------|--------------|
| **Frontend** | React Native (Expo SDK 53), Zustand, ChartKit |
| **Communication** | MQTT via **Aedes** or **Mosquitto** |
| **Devices** | Raspberry Pi / ESP32 (publishing/subscribing to MQTT topics) |
| **Backend (Optional)** | Node.js or FastAPI for logs, alerts, analytics |

---

> **Note**: SmartHome is designed to be extensible. It can easily be integrated with additional IoT hardware or expanded into cloud-based infrastructure using backend services.

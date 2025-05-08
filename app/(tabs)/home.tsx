// --- Imports
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  ImageBackground,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Lightbulb,
  DoorOpen,
  AppWindow as Window,
  Thermometer,
  Wind,
  Flame,
  Fan as FanIcon,
  WifiOff,
} from 'lucide-react-native';
import { useMQTT } from '@/hooks/useMQTT';
import { useTheme } from '@/contexts/ThemeContext';
import EnvironmentCharts from '@/components/charts/EnvironmentCharts';

// --- Mock data for charts
const mockChartData = {
  temperature: [22, 23, 24, 23.5, 22.8, 23.2, 23.8],
  humidity: [45, 46, 44, 47, 45, 43, 45],
  gas: [0, 2, 1, 3, 2, 1, 0],
  labels: ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM'],
};

// --- Types
type Room = {
  id: string;
  name: string;
  devices: {
    lights: boolean;
    door: boolean;
    window: boolean;
    fan?: boolean; // ✅ optional fan
  };
};

// --- Initial rooms
const initialRooms: Room[] = [
  {
    id: 'living',
    name: 'Living Room',
    devices: { lights: false, door: false, window: false, fan: false },
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    devices: { lights: false, door: false, window: false },
  },
  {
    id: 'garage',
    name: 'Garage',
    devices: { lights: false, door: false, window: false },
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    devices: { lights: false, door: false, window: false, fan: false },
  },
];

export default function HomeScreen() {
  const { publish, subscribe, reading, alert, online } = useMQTT();
  const { colors, isDarkMode } = useTheme();

  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showCharts, setShowCharts] = useState(false);

  useEffect(() => {
    if (!online) {
      Alert.alert(
        'MQTT Not Connected',
        'Unable to connect to the MQTT broker.'
      );
    } else {
      subscribe(['maison/capteurs/all', 'maison/+/+/status']);
    }
  }, [online]);

  const toggleDevice = (roomId: string, device: string, state: boolean) => {
    if (!online) {
      Alert.alert('Not Connected', 'Cannot control devices while offline');
      return;
    }
    publish(`maison/${roomId}/${device}/set`, state ? '0' : '1');
  };

  const renderControls = () => {
    if (!selectedRoom) return null;

    const { id: roomId, devices } = selectedRoom;

    return (
      <View style={[styles.controls, { backgroundColor: colors.card }]}>
        <Text style={[styles.controlsTitle, { color: colors.text }]}>
          {selectedRoom.name} Controls
        </Text>
        <View style={styles.controlsGrid}>
          {['lights', 'door', 'window'].map((device) => (
            <TouchableOpacity
              key={device}
              style={styles.controlButton}
              onPress={() =>
                toggleDevice(
                  roomId,
                  device,
                  devices[device as keyof typeof devices]
                )
              }
            >
              {device === 'lights' ? (
                <Lightbulb
                  size={24}
                  color={devices.lights ? colors.primary : colors.subtext}
                />
              ) : device === 'door' ? (
                <DoorOpen
                  size={24}
                  color={devices.door ? colors.primary : colors.subtext}
                />
              ) : (
                <Window
                  size={24}
                  color={devices.window ? colors.primary : colors.subtext}
                />
              )}
              <Text style={[styles.controlText, { color: colors.text }]}>
                {device.charAt(0).toUpperCase() + device.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}

          {/* ✅ Fan control only for living room */}
          {roomId === 'living' ||
            ('Bedroom' && (
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => toggleDevice(roomId, 'fan', devices.fan!)}
              >
                <FanIcon
                  size={24}
                  color={devices.fan ? colors.primary : colors.subtext}
                />
                <Text style={[styles.controlText, { color: colors.text }]}>
                  Fan
                </Text>
              </TouchableOpacity>
            ))}
        </View>

        <TouchableOpacity
          style={[styles.chartToggle, { backgroundColor: colors.primary }]}
          onPress={() => setShowCharts(!showCharts)}
        >
          <Text style={styles.chartToggleText}>
            {showCharts ? 'Hide' : 'Show'} Environmental Data
          </Text>
        </TouchableOpacity>

        {showCharts && (
          <View style={styles.chartContainer}>
            <EnvironmentCharts
              data={{
                temperature: [
                  reading.temperature,
                  ...mockChartData.temperature.slice(1),
                ],
                humidity: [
                  reading.humidity,
                  ...mockChartData.humidity.slice(1),
                ],
                gas: [reading.gas, ...mockChartData.gas.slice(1)],
                labels: mockChartData.labels,
              }}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <ImageBackground
      source={{
        uri: isDarkMode
          ? 'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg'
          : 'https://images.pexels.com/photos/3255245/pexels-photo-3255245.jpeg',
      }}
      style={styles.container}
    >
      <View
        style={[
          styles.overlay,
          {
            backgroundColor: isDarkMode
              ? 'rgba(0,0,0,0.7)'
              : 'rgba(255,255,255,0.85)',
          },
        ]}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.sensorBoxes}>
            <View style={[styles.box, { backgroundColor: colors.card }]}>
              <Thermometer size={20} color={colors.primary} />
              <Text style={[styles.boxLabel, { color: colors.subtext }]}>
                Temp
              </Text>
              <Text style={[styles.boxValue, { color: colors.text }]}>
                {reading.temperature.toFixed(1)}°C
              </Text>
            </View>
            <View style={[styles.box, { backgroundColor: colors.card }]}>
              <Wind size={20} color={colors.primary} />
              <Text style={[styles.boxLabel, { color: colors.subtext }]}>
                Humidity
              </Text>
              <Text style={[styles.boxValue, { color: colors.text }]}>
                {reading.humidity.toFixed(1)}%
              </Text>
            </View>
            <View style={[styles.box, { backgroundColor: colors.card }]}>
              <Flame
                size={20}
                color={reading.gas > 1800 ? colors.error : colors.primary}
              />
              <Text style={[styles.boxLabel, { color: colors.subtext }]}>
                Gas
              </Text>
              <Text style={[styles.boxValue, { color: colors.text }]}>
                {reading.gas} ppm
              </Text>
            </View>
          </View>

          {alert && (
            <Text
              style={{
                color: colors.error,
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              {alert.text}
            </Text>
          )}

          {!online && (
            <View
              style={[styles.offlineBar, { backgroundColor: colors.error }]}
            >
              <WifiOff size={16} color="#fff" />
              <Text style={styles.offlineText}>MQTT Connection Lost</Text>
            </View>
          )}

          <ScrollView style={styles.content}>
            <View style={styles.roomsGrid}>
              {rooms.map((room) => (
                <Pressable
                  key={room.id}
                  onPress={() => {
                    setSelectedRoom(room);
                    setShowCharts(false);
                  }}
                  style={({ pressed }) => [
                    styles.roomCard,
                    { backgroundColor: colors.card },
                    selectedRoom?.id === room.id && {
                      borderColor: colors.primary,
                      borderWidth: 2,
                    },
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Text style={[styles.roomName, { color: colors.text }]}>
                    {room.name}
                  </Text>
                  <View style={styles.deviceIcons}>
                    <Lightbulb
                      size={20}
                      color={
                        room.devices.lights ? colors.primary : colors.subtext
                      }
                    />
                    <DoorOpen
                      size={20}
                      color={
                        room.devices.door ? colors.primary : colors.subtext
                      }
                    />
                    <Window
                      size={20}
                      color={
                        room.devices.window ? colors.primary : colors.subtext
                      }
                    />
                    {room.id === 'living' && (
                      <FanIcon
                        size={20}
                        color={
                          room.devices.fan ? colors.primary : colors.subtext
                        }
                      />
                    )}
                  </View>
                </Pressable>
              ))}
            </View>

            {renderControls()}
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

// ✅ Styles identiques à ta version précédente
const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1 },
  safeArea: { flex: 1 },
  sensorBoxes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  box: {
    width: 100,
    height: 90,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  boxLabel: { fontSize: 12, marginTop: 4 },
  boxValue: { fontSize: 18, fontWeight: '600', marginTop: 2 },
  offlineBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  offlineText: { color: '#fff', fontWeight: '600' },
  content: { flex: 1 },
  roomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  roomCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  roomName: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  deviceIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  controls: {
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  controlsTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  controlsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 16,
    marginBottom: 16,
  },
  controlButton: { alignItems: 'center', padding: 12, borderRadius: 12 },
  controlText: { fontSize: 14, marginTop: 4 },
  chartToggle: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  chartToggleText: { color: '#fff', fontWeight: '600' },
  chartContainer: { marginTop: 16 },
});

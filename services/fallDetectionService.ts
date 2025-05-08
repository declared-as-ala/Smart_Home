import { Platform } from 'react-native';

const API_URL = Platform.select({
  web: 'http://localhost:8000', // Your Pi IP
  default: 'http://localhost:8000',
});
const WS_URL = API_URL.replace('http://', 'ws://');

let websocket: WebSocket | null = null;

export const connectToCamera = (onFrame: (frame: string) => void) => {
  if (Platform.OS !== 'web') return () => {};

  websocket = new WebSocket(`${WS_URL}/camera-stream`);

  websocket.onmessage = (event) => onFrame(event.data);
  websocket.onerror = (error) => console.error('WebSocket error:', error);

  return () => websocket?.close();
};

export const detectFall = async (base64Image: string) => {
  try {
    const res = await fetch(`${API_URL}/detect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image }),
    });
    return await res.json();
  } catch (err) {
    console.error('Detection error:', err);
    return { fall: false };
  }
};

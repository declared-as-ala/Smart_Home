// screens/CameraScreen.tsx
import React, { FC, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
  ActivityIndicator,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';

const PI_IP = '172.20.10.3';
const CAMERA_URL = `http://${PI_IP}:8080/?action=stream`;
const WS_URL = `ws://${PI_IP}:8000/ws/fall`;
const STATUS_URL = `http://${PI_IP}:8000/latest-fall`;

const BANNER_HEIGHT = 50;

const CameraScreen: FC = () => {
  const [loading, setLoading] = useState(true);
  const [streamError, setStreamError] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [lastTs, setLastTs] = useState(0);

  // Banner animation
  const bannerAnim = useRef(new Animated.Value(-BANNER_HEIGHT)).current;

  // Slide banner down/up
  const showBanner = (conf: number) => {
    setConfidence(conf);
    Animated.timing(bannerAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(bannerAnim, {
          toValue: -BANNER_HEIGHT,
          duration: 300,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }).start();
      }, 2500);
    });
  };

  // Native: WebSocket for immediate alerts
  useEffect(() => {
    if (Platform.OS !== 'web') {
      const ws = new WebSocket(WS_URL);
      ws.onmessage = ({ data }) => {
        const evt = JSON.parse(data);
        if (evt.fall) {
          showBanner(Math.round(evt.confidence * 100));
        }
      };
      ws.onerror = (e) => console.error('WS error', e);
      ws.onclose = () => console.log('WS closed');
      return () => ws.close();
    }
  }, []);

  // Web: poll every 1s
  useEffect(() => {
    if (Platform.OS === 'web') {
      const id = setInterval(async () => {
        try {
          const res = await fetch(STATUS_URL);
          const evt = await res.json();
          if (evt.fall && evt.timestamp > lastTs) {
            setLastTs(evt.timestamp);
            showBanner(Math.round(evt.confidence * 100));
          }
        } catch (e) {
          console.error('Status fetch error', e);
        }
      }, 1000);
      return () => clearInterval(id);
    }
  }, [lastTs]);

  const { width, height } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Camera Monitor</Text>
        <Text style={styles.subtitle}>Live Stream & Alerts</Text>
      </View>

      {/* Top Banner */}
      <Animated.View
        style={[styles.banner, { transform: [{ translateY: bannerAnim }] }]}
      >
        <Text style={styles.bannerText}>
          ⚠️ Fall detected! Confidence: {confidence}%
        </Text>
      </Animated.View>

      {/* Stream */}
      <View style={styles.streamWrapper}>
        {Platform.OS === 'web' ? (
          <Image
            source={{ uri: CAMERA_URL }}
            style={[styles.stream, { width, height: height - 100 }]}
            onLoadStart={() => {
              setLoading(true);
              setStreamError(false);
            }}
            onLoadEnd={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setStreamError(true);
            }}
          />
        ) : (
          <WebView
            source={{ uri: CAMERA_URL }}
            style={styles.stream}
            onLoadStart={() => {
              setLoading(true);
              setStreamError(false);
            }}
            onLoadEnd={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setStreamError(true);
            }}
          />
        )}

        {loading && !streamError && (
          <ActivityIndicator style={styles.loader} size="large" />
        )}
        {streamError && (
          <Text style={styles.errorText}>⚠️ Unable to connect to camera.</Text>
        )}
      </View>
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  header: { padding: 16, backgroundColor: '#6200EE', alignItems: 'center' },
  title: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  subtitle: { color: 'white', fontSize: 14 },
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: BANNER_HEIGHT,
    backgroundColor: '#B00020',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  bannerText: { color: 'white', fontWeight: 'bold' },
  streamWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: BANNER_HEIGHT,
  },
  stream: { flex: 1, alignSelf: 'stretch', backgroundColor: 'black' },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -18,
    marginTop: -18,
  },
  errorText: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
    color: '#B00020',
    fontSize: 16,
  },
});

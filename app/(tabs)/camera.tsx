import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import CameraControls from '@/components/camera/CameraControls';
import FallAlert from '@/components/camera/FallAlert';
import { detectFall, connectToCamera } from '@/services/fallDetectionService';
import { useNotifications } from '@/hooks/useNotifications';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isDetecting, setIsDetecting] = useState(false);
  const [fallDetected, setFallDetected] = useState(false);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraRef = useRef(null);
  const { colors } = useTheme();
  const { sendLocalNotification } = useNotifications();

  // Connect to WebSocket stream
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const disconnect = connectToCamera(async (frameBase64) => {
      if (!isDetecting) return;
      const res = await detectFall(frameBase64);
      if (res.fall) {
        setFallDetected(true);
        setConfidence(res.confidence ?? null);
        sendLocalNotification(
          '⚠️ Fall Detected!',
          `Confidence: ${(res.confidence || 0) * 100}%`
        );
      }
    });

    return () => disconnect();
  }, [isDetecting]);

  // Web fallback stream
  useEffect(() => {
    if (Platform.OS === 'web') initializeWebCamera();
  }, [facing]);

  const initializeWebCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing === 'front' ? 'user' : 'environment' },
      });
      setVideoStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
    if (Platform.OS === 'web' && videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      initializeWebCamera();
    }
  };

  const toggleDetection = () => {
    setIsDetecting(!isDetecting);
    setFallDetected(false);
    setConfidence(null);
  };

  const dismissAlert = () => {
    setFallDetected(false);
    setConfidence(null);
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0891B2" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <AlertTriangle color="#F59E0B" size={48} style={styles.icon} />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need your permission to use the camera for fall detection.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.cameraContainer}>
        {Platform.OS === 'web' ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
            onError={(error) => console.error('Camera error:', error)}
          >
            {/* Overlay */}
          </CameraView>
        )}

        <View style={styles.overlay}>
          <View
            style={[
              styles.statusIndicator,
              fallDetected
                ? styles.statusFall
                : isDetecting
                ? styles.statusActive
                : styles.statusInactive,
            ]}
          >
            <Text style={styles.statusText}>
              {fallDetected
                ? `FALL DETECTED${
                    confidence ? ` (${(confidence * 100).toFixed(0)}%)` : ''
                  }`
                : isDetecting
                ? 'Monitoring Active'
                : 'Monitoring Inactive'}
            </Text>
          </View>

          <CameraControls
            isDetecting={isDetecting}
            onToggleDetection={toggleDetection}
            onToggleCamera={toggleCameraFacing}
          />
        </View>
      </View>

      {fallDetected && (
        <FallAlert
          onDismiss={dismissAlert}
          onRestart={toggleDetection}
          confidence={confidence}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cameraContainer: { flex: 1 },
  camera: { flex: 1 },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 20,
  },
  statusIndicator: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 10,
  },
  statusActive: { backgroundColor: 'rgba(22, 163, 74, 0.8)' },
  statusInactive: { backgroundColor: 'rgba(100, 116, 139, 0.8)' },
  statusFall: { backgroundColor: 'rgba(220, 38, 38, 0.8)' },
  statusText: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: '#1E293B',
  },
  permissionText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: '#0891B2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  icon: { marginBottom: 20 },
});

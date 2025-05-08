import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { RefreshCcw, Play, Pause, FileVideo } from 'lucide-react-native';

type CameraControlsProps = {
  isDetecting: boolean;
  onToggleDetection: () => void;
  onToggleCamera: () => void;
};

const CameraControls = ({ 
  isDetecting, 
  onToggleDetection, 
  onToggleCamera 
}: CameraControlsProps) => {
  return (
    <View style={styles.controlsContainer}>
      <TouchableOpacity
        style={styles.controlButton}
        onPress={onToggleCamera}
      >
        <RefreshCcw size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.primaryButton,
          isDetecting ? styles.stopButton : styles.startButton,
        ]}
        onPress={onToggleDetection}
      >
        {isDetecting ? (
          <>
            <Pause size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>Stop</Text>
          </>
        ) : (
          <>
            <Play size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>Start</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.controlButton}
      >
        <FileVideo size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 60,
    borderRadius: 30,
    gap: 8,
  },
  startButton: {
    backgroundColor: '#0891B2',
  },
  stopButton: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default CameraControls;